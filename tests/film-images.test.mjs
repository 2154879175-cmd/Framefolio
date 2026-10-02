import { test } from 'node:test';
import assert from 'node:assert/strict';
import { selectFilmImages } from '../lib/film-images.ts';

const backdrop = (file_path, extra = {}) => ({ file_path, width: 1920, height: 1080, iso_639_1: null, ...extra });
test('selects at most three distinct landscape images without language overlays', () => {
  assert.deepEqual(selectFilmImages([
    backdrop('/poster.jpg', { width: 500, height: 750 }),
    backdrop('/english.jpg', { iso_639_1: 'en' }),
    backdrop('/first.jpg'), backdrop('/first.jpg'), backdrop('/second.jpg'),
    backdrop('/third.jpg'), backdrop('/fourth.jpg'), backdrop('/../bad.jpg'),
  ]), ['first', 'second', 'third'].map(name => `https://image.tmdb.org/t/p/w780/${name}.jpg`));
});
test('no images is a valid result', () => assert.deepEqual(selectFilmImages(), []));
