# POVCE 收藏室与在线后台

网站：https://povce-official.github.io/

管理入口：https://povce-official.github.io/admin/

前台使用 Shirone + Astro 和 GitHub Pages，在线编辑使用 Pages CMS：https://pagescms.org/

## 首次开通

1. 在管理入口打开 Pages CMS，使用 GitHub 登录并确认服务条款。
2. 安装 Pages CMS GitHub App 时选择 Only select repositories，仅勾选 POVCE-official.github.io。
3. 打开该仓库的 main 分支。后台读取 .pages.yml，显示 Songs、Artists、Movie、Series、Game、设计作品、站点与个人资料七个栏目。

管理服务的授权需要账号所有者完成；部署网站和后台配置不会自动授予服务仓库权限。

## 日常管理

- 新建收藏：进入对应栏目新建，填写名称、状态、收录日期、笔记和标签，上传或选择封面，再保存。
- 编号自动生成，无需修改。填写收录日期，首页与各分区都按该日期由新到旧展示。
- Artists：新建艺人或团队，选择 Solo / Band；头像与照片墙独立管理。「艺人照片墙」支持多张图片，在同一张艺人信息卡片内展示，点击照片可看原图。「官方详情页网址」可填写自定义 http(s) 链接，留空隐藏入口。
- Movie 用于电影，Series 用于剧集与番剧；原有影视内容仍保留在 Movie，原有音乐保留在 Songs。
- 查找修改：在对应栏目搜索或按日期排序，打开条目后编辑并保存。
- 暂不展示：打开此开关后，该条目不会显示在网站上。仓库公开，原文件仍能被读取，勿保存私密内容。
- 删除收藏：删除对应条目；不要删除仍被其他收藏引用的图片。
- 修改资料：在「站点与个人资料」中编辑站名、简介、头像、主题色相、横幅和关于页。横幅留空时使用主题默认图片。
- 设计作品：独立管理，前台入口继续放在页脚和关于页。

每次保存会提交到 GitHub 并触发自动发布，通常需要几分钟。等待发布成功再刷新网站。发布失败时上一版本继续显示，错误文件和字段会写入发布日志。

发布进度：https://github.com/POVCE-official/POVCE-official.github.io/actions

## 数据位置

- content/site.json：站点与个人资料。
- content/music/*.json：Songs 歌曲，每个文件一条；前台 /music/ 使用线性列表。
- content/artists/*.json：Artists 艺人 / 团队；前台 /music/artists/。
- content/movies/*.json：Movie 电影；前台 /media/，旧 /movies/ 入口自动跳转。
- content/series/*.json：Series 剧集与番剧；前台 /media/series/。
- content/games/*.json：游戏，每个文件一条。
- content/works/*.json：设计作品，每个文件一条。
- public/uploads/：后台上传的图片。
- .pages.yml：后台表单和媒体配置。

src/data/collections.ts 负责装载数据，日常管理不需要修改它。收藏状态按栏目固定；作品链接只接受 http/https。封面接受站内图片路径或 http/https 图片链接。上传目录只接受图片。

scripts/content-validation.mjs 校验数据，脚本在检查与发布前运行。.pages.yml 采用合法 YAML 1.2 的 JSON 写法。

## 本地开发

使用 Node.js 24 和 pnpm 11.25.0，依次执行 pnpm install --frozen-lockfile、pnpm dev。修改代码后执行 pnpm test、pnpm check、pnpm build。Windows 可使用 pnpm.cmd。不要修改 node_modules 中的主题文件。

2022 年旧站文件已从当前版本移除，没有另建资料备份目录；Git 历史仍保留正常版本记录。
