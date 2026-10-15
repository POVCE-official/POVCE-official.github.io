# POVCE 收藏室

基于 [Shirone](https://github.com/LyraVoid/Shirone)、[shirones](https://github.com/yCENzh/shirones) 和 Astro 构建的个人收藏站。

线上地址：https://povce-official.github.io/

主要入口：音乐 `/music/`、影视 `/movies/`、游戏 `/games/`。设计作品 `/works/` 只放在页脚与关于页。没有文章随笔分区。

## 添加收藏

编辑 `src/data/collections.ts` 的 `collections` 数组。第一版没有演示收藏，请填写自己的真实条目。数组末尾的新条目会出现在首页「最近收录」。

```ts
{
  id: "unique-id",
  kind: "music", // music / movies / games
  title: "作品名称",
  creator: "创作者",
  year: "发行年份",
  status: "常听", // 音乐：常听/在听/想听；影视：已看/在看/想看；游戏：在玩/已通关/想玩/搁置
  note: "自己的收藏笔记",
  tags: ["标签"],
  cover: "/covers/example.webp", // 可选，文件放 public/covers/
  url: "https://example.com/", // 可选，作品的官方页面
}
```

音乐先使用作品链接；有合法可用音源时再配置播放器。设计作品填写同一文件的 `works` 数组。

## 修改外观

- `shirones/config/siteConfig.ts`：站名、主题颜色、横幅、语言。
- `shirones/config/profileConfig.ts`：个人介绍、头像、GitHub 链接。
- `shirones/config/navBarConfig.ts`：顶部导航。
- `src/styles/archive.css`：收藏页样式，沿用 Shirone 设计令牌。
- `src/components/organisms/`：少量官方覆盖入口，隐藏文章分类栏并精简页脚。

## 本地开发

Node.js 24，pnpm 11.25.0。

```sh
corepack enable
pnpm install --frozen-lockfile
pnpm dev
pnpm check
pnpm build
pnpm preview
```

Windows PowerShell 可使用 `pnpm.cmd`。

## 自动部署

GitHub Settings → Pages → Source 设为 **GitHub Actions**。

推送到 `main` 会运行 `.github/workflows/deploy.yml`：安装锁定依赖、检查页面、构建并发布 `dist/`。不需要添加个人访问令牌。

2022 年旧站目录及旧静态资源已从当前版本移除，没有另建旧资料备份目录。Git 提交历史仍保留正常的版本记录。
