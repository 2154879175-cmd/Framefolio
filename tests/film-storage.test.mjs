import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { stripTypeScriptTypes } from 'node:module';
import { SourceTextModule, SyntheticModule } from 'node:vm';
import { DatabaseSync } from 'node:sqlite';

async function fixture() {
  const database = new DatabaseSync(':memory:');
  database.exec(readFileSync('drizzle/0000_productive_vivisector.sql', 'utf8'));
  database.exec(readFileSync('drizzle/0001_lively_magdalene.sql', 'utf8'));
  database.exec(readFileSync('drizzle/0003_empty_stick.sql', 'utf8'));
  let imageResult = ['https://image.tmdb.org/t/p/w780/new.jpg'];
  let imageCalls = 0;
  const db = { prepare(sql) {
    let values = [];
    return { bind(...args) { values = args; return this; },
      async first() { return database.prepare(sql).get(...values) ?? null; },
      async all() { return { results: database.prepare(sql).all(...values) }; },
      async run() { const result = database.prepare(sql).run(...values); return { meta: { changes: Number(result.changes) } }; },
    };
  }, async batch(statements) { return Promise.all(statements.map(statement => statement.run())); } };
  const dependencies = {
    'cloudflare:workers': new SyntheticModule(['env'], function () { this.setExport('env', { DB: db }); }),
    '@/lib/tmdb': new SyntheticModule(['getTmdbFilmImages'], function () {
      this.setExport('getTmdbFilmImages', async () => { imageCalls++; if (imageResult instanceof Error) throw imageResult; return imageResult; });
    }),
  };
  const module = new SourceTextModule(stripTypeScriptTypes(readFileSync('lib/movies.ts', 'utf8')));
  await module.link(name => dependencies[name]);
  await module.evaluate();
  return { database, api: module.namespace, failImages() { imageResult = new Error('TMDB unavailable'); }, imageCalls: () => imageCalls };
}
const snapshot = (stills = []) => ({ tmdbId: 99999, slug: 'test-film', title: '测试电影', originalTitle: 'Test film', releaseDate: '2020-01-01', countries: [], runtime: 90, overview: '', posterPath: null, director: '', cast: [], genres: [], stills });
const review = { rating: 8.5, watchedOn: null, shortReview: 'Keep this review.', longReview: '', containsSpoilers: false, status: 'published' };

test('new and duplicate imports preserve image snapshots and existing notes', async () => {
  const f = await fixture();
  try {
    const created = await f.api.createMovieFromSnapshot(snapshot(['first.jpg']));
    await f.api.updateMovie(created.id, review);
    const duplicate = await f.api.createMovieFromSnapshot(snapshot(['replacement.jpg']));
    assert.equal(duplicate.id, created.id);
    assert.equal(duplicate.duplicate, true);
    const film = await f.api.getAdminMovie(created.id);
    assert.deepEqual(film.stills, ['first.jpg']);
    assert.equal(film.shortReview, review.shortReview);
    assert.equal(f.imageCalls(), 0);
  } finally { f.database.close(); }
});
test('publication fills missing frames and does not fetch again after saving them', async () => {
  const f = await fixture();
  try {
    const { id } = await f.api.createMovieFromSnapshot(snapshot());
    await f.api.updateMovie(id, review);
    assert.equal((await f.api.getAdminMovie(id)).stills.length, 1);
    await f.api.updateMovie(id, review);
    assert.equal(f.imageCalls(), 1);
  } finally { f.database.close(); }
});
test('image service failure preserves published review and permits a later retry', async () => {
  const f = await fixture();
  try {
    const { id } = await f.api.createMovieFromSnapshot(snapshot());
    f.failImages();
    assert.equal(await f.api.updateMovie(id, review), true);
    assert.equal((await f.api.getPublishedMovie('test-film')).shortReview, review.shortReview);
    assert.deepEqual((await f.api.getAdminMovie(id)).stills, []);
    await f.api.updateMovie(id, review);
    assert.equal(f.imageCalls(), 2);
  } finally { f.database.close(); }
});
