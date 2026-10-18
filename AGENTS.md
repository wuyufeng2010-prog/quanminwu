# 项目协作约定

- 在现有 checkout 中工作；云任务已经隔离，除非用户明确要求，不创建 Git worktree。
- 技术栈为 Next.js App Router + TypeScript + Tailwind CSS；使用 npm，保留并更新 package-lock.json，优先 `npm ci`。
- 推荐 Node.js 24。开发 `npm run dev`；验证 `npm run lint`、`npm run typecheck`、`npm run build`；生产本地验证 `npm run start`。
- 页面使用简体中文，以18—65岁成人为目标；手机优先，正文清晰，交互点击区域至少44px，保留键盘焦点和减少动态效果支持。
- 数据必须明确标记为演示。不得虚构真实课程、教师、销量、评价或教学效果；规划中的能力要标明尚未开放。
- 未获明确授权，不接入真实支付、用户数据库、AI 服务，不部署、不购买资源，不保存或提交密钥。
- 不强制推送；推送前检查远端变化，保留用户修改。新增业务功能需同步更新 README。
- 四大学习入口必须可访问；保留手机横屏教学所需的16:9视频区域及内容、练习、答疑导航。

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
