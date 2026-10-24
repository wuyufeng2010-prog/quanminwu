# 项目协作约定

- 在现有 checkout 中工作；云任务已经隔离，除非用户明确要求，不创建 Git worktree。
- 技术栈为 Next.js App Router + TypeScript + Tailwind CSS；使用 npm，保留并更新 package-lock.json，优先 `npm ci`。
- 推荐 Node.js 24 LTS；Node.js 22.22.2 已实测可完整跑通全部脚本（`engines` 要求 `>=22.0.0`）。开发 `npm run dev`；验证 `npm run lint`、`npm run typecheck`、`npm run build`；生产本地验证 `npm run start`。
- 页面使用简体中文，以18—65岁成人为目标；手机优先，正文清晰，交互点击区域至少44px，保留键盘焦点和减少动态效果支持。
- 数据必须明确标记为演示。不得虚构真实课程、教师、销量、评价或教学效果；规划中的能力要标明尚未开放。
- 未获明确授权，不接入真实支付、用户数据库、AI 服务，不部署、不购买资源，不保存或提交密钥。
- 不强制推送；推送前检查远端变化，保留用户修改。新增业务功能需同步更新 README。
- 四大学习入口必须可访问；保留手机横屏教学所需的16:9视频区域及内容、练习、答疑导航。
- 入口的层次不要混用：当前**方向/入口**以 `courses.ts` 的五组 `groups`（F/A/B/C/S）为准，首页与 `/learn` 都按它渲染；早期四大入口中的 `classical`、`folk` 已是 A、B 组的正式 slug，`posture`、`rhythm` 作为**旧路由别名**归入 S 教学支持并保持可访问，不得删除或改为 404。`src/data/categories.ts` 为旧版数据，已无代码引用，改动导航时以 `courses.ts` 为准。

## 播放器与演示数据

- 课程以 `src/data/courses.ts` 为准；保持F通用基础、A古典舞、B民族民间舞、C兴趣课、S教学支持的结构。A/B是平等专业主线，兴趣课不设强制先修。
- 三视角素材分别配置，默认背面；真实对镜拍摄与CSS镜像翻转必须区分。缺失素材显示空状态，不自动伪造视角。
- 数拍与水印依赖真实媒体时间。技术测试片不属于舞蹈教学，AI、教师反馈、生产水印和后台未接入时必须明确标注。
- 修改播放器后运行 `npm run test:e2e`（先构建），覆盖真实播放、循环、响应式与本机数据恢复；真机兼容性未经验证不得宣称已通过。
- 本机问题/文件名不等于已上传，不得暗示真实教师已收件；生产上传与课程授权应另行实现并审核。

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
