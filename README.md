# 全民舞 QuanMinWu

面向18—65岁成人的在线舞蹈教学平台原型。使用 Next.js App Router、React、TypeScript 和 Tailwind CSS，采用手机优先的中文界面。

## 本地开发

推荐 Node.js 24 LTS（见 `.nvmrc`），使用 npm 和已提交的 `package-lock.json`。

```bash
npm ci
npm run dev
```

开发服务默认使用端口 3000。生产构建及启动：

```bash
npm run lint
npm run typecheck
npm run build
npm run start
```

`typecheck` 会先运行 `next typegen`，首次安装后无需先构建即可生成路由类型。`.npmrc` 将 npm 缓存放在可写的 `/tmp/quanminwu-npm-cache`；缓存可重建，不属于项目数据。无需环境变量或密钥。

## 目录

- `src/app/page.tsx`：中文首页，四大学习入口及平台介绍。
- `src/app/learn/[category]/page.tsx`：四个学习方向演示页，包含16:9视频占位和内容、练习、答疑导航。
- `src/app/layout.tsx`：中文语言标识和页面元信息。
- `src/app/globals.css`：Tailwind CSS 引入、响应式布局、焦点和减少动态效果支持。
- `src/data/categories.ts`：明确标识的演示学习方向数据。
- `src/app/not-found.tsx`：不存在的页面提示。

## 范围与限制

所有学习方向和资料均为演示，不代表已上线课程。没有真实教师宣传、可播放教学视频、报名、支付、用户数据库或 AI 服务。页面中的未来功能均标记为规划，学习进度不会保存。

当前无后端业务服务。未来可增加课程管理、授权视频播放、学员账户与答疑，并将音乐节拍分析作为独立异步服务。手机横屏播放和屏幕方向能力需在接入真实播放器后进行 iOS/Android 真机验证。

不使用外部字体或图片服务，不需要付费资源。上线部署、支付及第三方服务接入需要另行确认。

## 验证

提交前执行 lint、TypeScript 检查和生产构建；启动生产服务后检查首页、四个学习方向及未知路由。移动端重点检查 360px、390px 宽度、横屏、键盘焦点与点击区域。自动构建不能替代真机视频兼容性验证。

## 工具链兼容性

当前 Next.js ESLint 配置中的部分插件只声明兼容 ESLint 9，因此锁定 ESLint 9.39.5，未忽略 peer dependency 冲突强行采用 ESLint 10。npm 会提示 ESLint 9 已停止维护；后续应在这些插件正式支持新版后整体升级。TypeScript 暂采用经过当前工具链验证的 5.9.3，依赖的精确解析见锁文件。
