# Movie archive

`movies.json` 保存本地数据库中的电影资料、评分、观影日期、短评、长评和发布状态，包含草稿。
`genres.json` 保存电影与类型的关联。

`reviews.json` 是 2026-10-02 从云端公开接口核对并保存的四篇已发布评论及电影资料，使用接口的 camelCase 字段。它是独立备份，不会被本地 `data:export` 命令覆盖，也不作为初始数据库导入文件。

这些文件位于公开仓库，所有内容均可被任何人读取。数据库本身仍是网站的内容来源；修改 JSON 不会直接修改网站。

更新本地内容后，在项目目录运行：

```sh
npm run data:export
git add data/archive
git commit -m "Update movie archive"
git push
```

所有后续本地数据快照继续写入这个目录。导出不包含 TMDB 密钥、登录凭据或运行日志。云端数据库需要另行导出，不能使用本地快照覆盖其新内容。
# Film imagery / 电影画面

`stills.json` records the TMDB source URLs and local paths of the three selected film images for each currently published film. Images are stored in `public/film-stills/`, so page viewing does not request TMDB's API. Existing movie and review records are unchanged. Newly added films without an image snapshot simply omit the filmstrip.

`public/decorations/cinema-projector.png` is an original generated illustration. The orbital ornament is drawn in `components/film-decorations.tsx`.
