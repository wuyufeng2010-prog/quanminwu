# 全民舞 QuanMinWu · V3.3 教学播放器原型

面向18—65岁成人的中国舞在线教学平台原型，**尚未正式上线**。保留 Next.js 16 App Router、React 19、TypeScript、Tailwind CSS 4 技术体系；手机竖屏选课，横屏观看，平板与桌面同样可用。

**这是可操作的教学技术原型。没有正式教学内容、真实账号、付费课程、AI分析、教师服务或生产版权保护。**

## 本地运行

### 首页视觉与内容更新（2026-10-26）

首页采用已确认的东方当代版式、自然成人群像与第 04 版中文字标。页面包含真实样课筹备说明、F/A/B/C/S 五组入口、技术演示的学习方式、常见问题及品牌介绍；样课主题、教师和上线时间均标为待确认。AI 主视觉不是实际教学场景，课程结构与教师服务仍为演示。

新增样式限定在首页 CSS Module 内，不改变课程数据、旧路径别名或播放器。手机菜单支持选择链接后关闭与 Escape 返回焦点。图片均在本地 `public/images/`，出处及生成要求见该目录 README。`tests/home.spec.ts` 覆盖五组入口、筹备信息、320–1440px 响应式、图片加载、手机菜单和键盘操作。

后续模块与首屏统一使用同系列 AI 配图：五组图文入口保留完整 3:2 画面，A/B 并列同宽；样课筹备配备课意象及三项“待确认”说明；学习方式使用 HTML/CSS 功能示意；FAQ 和品牌介绍沿用同一字号、朱红强调与留白体系。民族民间舞方向配图不代表具体民族舞种示范。

推荐 Node.js 24 LTS（`.nvmrc`）。Node.js 22.22.2 已实测可完整跑通 `npm ci`、`lint`、`typecheck`、`build`、`test:e2e`（`package.json` 的 `engines` 要求 `>=22.0.0`），不是阻塞项；使用已提交的 npm 锁文件：

```bash
npm ci
npm run dev
```

浏览器打开本机端口3000。无需环境变量、密钥、外部图片或字体服务。`.npmrc` 使用 `/tmp/quanminwu-npm-cache` 缓存，目录可重建。开发服务监听 `0.0.0.0`，仅应在可信的本地测试网络使用。

```bash
npm run lint
npm run typecheck
npm run build
npm run start
npm run test:e2e
```

`typecheck` 会先生成 Next.js 路由类型；`test:e2e` 需先构建，会自行在3100端口启动并停止生产服务。自动化不需要 FFmpeg，测试视频已包含在仓库内。

### 测试浏览器的来源与 Windows 配置

`playwright.config.ts` 按以下顺序确定 Chromium 可执行文件，命中即止：

1. 环境变量 `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH`；
2. 路径 `/usr/bin/chromium`（Linux 常见路径，**Windows 下通常不存在**）；
3. 以上皆为空时使用 Playwright 自带 Chromium，未安装则先执行 `npx.cmd playwright install chromium`（Git Bash / macOS 用 `npx playwright install chromium`）。

Windows 用本机 Chrome 运行测试，只需在当前终端设置该变量（进程级，不写入仓库、不改系统环境变量）：

```powershell
# PowerShell（仓库根目录）
$env:PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH = "C:\Program Files\Google\Chrome\Application\chrome.exe"
npm.cmd run test:e2e
```

```bash
# Git Bash
export PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH="C:/Program Files/Google/Chrome/Application/chrome.exe"
npm run test:e2e
```

Chrome 通常为系统级安装：`C:\Program Files\Google\Chrome\Application\chrome.exe`；少数为用户级安装：`%LOCALAPPDATA%\Google\Chrome\Application\chrome.exe`。路径以本机实际位置为准，可用 PowerShell 确认：

```powershell
Test-Path "C:\Program Files\Google\Chrome\Application\chrome.exe"   # 返回 True 即可直接填入上面的变量
```

> Chrome 安装后通常**不在** `PATH` 中，因此 `where chrome`（cmd）在本机会返回“找不到文件”，不要据此判断没有安装 Chrome。

> **PowerShell 注意**：Windows 客户端默认执行策略为 `Restricted`，此时裸写 `npm` / `npx` 会因 `.ps1` 包装脚本被拦截而报 `PSSecurityException`；改用 `npm.cmd` / `npx.cmd` 即可正常运行。`$env:VAR = "值"` 这种赋值不受执行策略影响，反斜杠路径会原样传给 Node 与 Playwright（本机实测：Node 读到的值即为该路径，`existsSync` 为 `true`）。

实测 Windows 11 + Node 22.22.2 + 本机 Chrome 155.0.8059.85 可跑通全部 18 条用例（该结论来自 **Git Bash** 下的完整运行），不需要下载 Playwright 自带浏览器。

## 推荐演示流程

1. 首页 → 中国古典舞 → 基础手位与身韵初识 → 进入演示播放器。
2. 初始为背面空状态。点“加载技术测试片”，加载三份不同的原创图形测试片；**不是舞蹈示范、多机位或真实对镜拍摄**。
3. 点“沉浸跟练”进入占满可用窗口的练习模式，不依赖浏览器全屏授权；手动横放手机。常驻按钮可一键开始/暂停和循环当前段，自定义AB默认收起。播放、暂停、拖动进度，使用0.5 / 0.75 / 0.9 / 1 / 1.25倍速；切换正面、背面、对镜通道，尽量保留时间、速度、段落与循环。
4. “开启镜像”只左右翻转视频，不改变按钮与字幕区域；它不等同于真实对镜拍摄。
5. 选择“音乐跟练”，观察预备拍5、6、7、8及随实际媒体时间同步的四拍/八拍数字、动作和乐句提示；“独立练习”关闭提示。合成节拍与测试时间轴相符，没有真实AI或自动评分。
6. 可手动设置A、B（秒），或直接“循环本段”。越出循环区间拖动会取消循环；修改A/B后需重新开启。素材不足以覆盖段落时会提示。
7. 演示水印在视频四角边缘每5秒媒体时间换位；暂停时不移动，跨视角会话编号保持不变。它是可移除的前端覆盖层，没有账号追溯或防录屏能力。
8. 暂停、退出再进入，自动恢复本机保存的位置、视角、速度、练习模式、镜像和段落循环；不会自动播放。学习进度页可继续或清除记录。
9. 点“向老师提问（演示）” → 填问题 → 可选择视频文件名 → 添加到本机列表 → 查看固定示例反馈及复习任务。**没有教师收件，没有上传文件或AI视频分析**，可删除本机问题。

## 手机与横屏测试

- 手机与开发电脑连接同一可信局域网，在手机打开开发电脑的局域网IP及端口3000。云环境需使用平台支持的安全访问方式，不能把电脑的环回地址当作手机地址。
- 竖屏检查课程列表、答疑与进度，关闭系统方向锁定后手动横放设备；网站不调用强制方向锁定。
- 控件触控区域至少44px。视频使用 `object-fit: contain`，避免裁切头部、手臂与脚步；支持安全区域内边距。
- 闲置4.5秒后高级控件自动收起，数拍与动作提示持续显示，并保留一键暂停。触摸画面或“显示播放控件”恢复；触控交互会重置闲置时间，编辑AB或倍速、键盘操作期间不自动隐藏。滑块支持方向键。
- “沉浸跟练”使用页面内布局占满窗口，支持退出按钮、Escape和键盘焦点循环。浏览器支持 Fullscreen API 时还可对整个播放器全屏；两种模式均保留水印和数拍。低高度横屏把视频与工具分列，快捷播放/暂停、视角和本段循环常驻，高级设置可滚动操作。
- 不支持或拒绝网页全屏的 iOS Safari、部分 Android/微信浏览器会显示手动横屏提示，保留页内播放；**不使用会丢失水印与控件的原生视频全屏作为替代**。
- 已执行的是 Chromium 实际播放、响应式尺寸与触控模拟测试，以及不支持/拒绝全屏的模拟降级。真实 iPhone、Android、微信和刘海屏安全区域仍需真机验收，不能据此宣称所有浏览器兼容。

## 课程体系

**这里有两个不同层次，不要混为一谈：**

- **入口层（当前生效）**：首页的「探索学习方向」与 `/learn` 都按 `src/data/courses.ts` 的 `groups` 渲染，共 **5 个学习方向**，路由为 `/learn/foundation`、`/learn/classical`、`/learn/folk`、`/learn/interest`、`/learn/support`。
- **旧版四大入口**：`classical`、`folk`、`posture`、`rhythm` 是本项目早期（第一阶段之前）的四个入口。其中 `classical`、`folk` 现在是 A、B 两组的正式 slug（同名延续）；`posture`、`rhythm` 已归入 S 教学支持，**仅作为旧路由别名保留**——`/learn/posture`、`/learn/rhythm` 仍返回 200 并等价于 S 组内容，不要再当作与五组并列的第 3、4 个入口。其旧数据文件 `src/data/categories.ts` 当前已无代码引用。

首页使用容易理解的中文；教材管理分组为：

- F 通用基础：F0安全认知、F1身体排列、F2活动度/柔韧/基础力量、F3节奏乐感、F4协调重心舞步、F5审美表达。8节导学交叉安排基础、动态热身与整理放松，不要求先学完理论才跳舞。
- A 中国古典舞：L1启蒙、L2基础、L3提高、L4表现；当前只有L1目录演示。
- B 中国民族民间舞：与A平等的四级主线；包括藏族、蒙古族、维吾尔族、傣族和汉族民间舞分类。文化背景与地域风格需专业审校，不混用服饰和动律。
- C 综合兴趣课：零基础体验、古典舞身韵、民族主题、成品舞与展演，不设强制等级先修。
- S 教学支持：热身、体态、柔韧放松、节奏、答疑、安全调整与学习评价。评价目前只有课程结构，不提供自动分数。

26份课程结构都是演示数据；24秒测试片的压缩段落不构成训练处方，不可代替完整热身。疼痛或不适应停止，伤病或运动限制请先咨询专业人士。

## 目录与模块

- `src/data/courses.ts`：五组课程、8节基础导学、三视角可替换资源、演示段落与音乐时间轴。
- `src/data/categories.ts`：旧版四大学习方向（古典舞、民族民间舞、体态拉伸、节奏）的演示数据。PR #1 之后首页与 `/learn` 已改为按 `courses.ts` 的五组渲染，**此文件当前无代码引用**，保留供旧版对照；其中 `posture`、`rhythm` 现已作为旧路由别名归入 S 组（见「课程体系」）。
- `src/app/not-found.tsx`：未知路由的中文 404 页面，引导返回首页。
- `src/lib/learning-types.ts`：课程、教学段落、节拍、乐句、进度、匿名水印会话、答疑模型及未来服务接口。
- `src/lib/music-timeline.ts`：按视频时间查询拍点与乐句，暂停、拖动、变速、循环均不依赖独立动画计时。
- `src/lib/platform-contracts.ts`：登录、云进度、课程权益与教师工作台的扩展类型协议，仅接口，未连接服务。
- `src/lib/learning-storage.ts`：带校验和失败降级的本机存储；无云端同步。
- `src/components/dance-player.tsx`、`dance-player.css`：媒体控制、三视角、AB与段落循环、全屏、触控和键盘。
- `src/components/music-coach.tsx`、`dynamic-watermark.tsx`：音乐提示与演示水印可复用模块。
- `src/components/question-demo.tsx`、`progress-demo.tsx`：本机答疑和学习记录。
- `src/app/learn`：分类及课程列表；保留旧版 `posture`、`rhythm` 路由，归入教学支持。
- `src/app/courses/[courseId]`：详情/目录，`player`播放器和`questions`答疑页面。
- `src/app/progress`：本机学习记录。
- `public/demo`：约320KB的三份原创H.264/AAC技术测试视频、来源与CC0许可说明。
- `tests/player.spec.ts`：真实媒体交互及学习流程测试。

## 数据、隐私与接入边界

- 本地视频只生成对象URL，离开页面后释放；刷新后需重新选择。分别配置三视角，缺失视角明确显示空状态，不拿另一段冒充。任意用户视频未经拍点校准时会停止显示演示数拍，避免误导；分别添加其他视角素材不会打断当前视频。暂无字幕文件导入。
- localStorage保存位置/设置、问题文字与所选文件名；不保存视频内容。共享设备没有账号隔离，请勿输入敏感信息，可在页面或浏览器内删除。本地存储被禁用/损坏时不阻断播放，但可能无法保存。
- 正式视频可配置每个视角 `timelineOffset`，统一课程时间转换为媒体时间；时长不足会限制恢复位置并停止无效循环，真实多机位同步仍需素材校准与真机验证。
- 音乐模型包含音频地址、BPM、拍号、偏移、拍点时间戳、乐句、段落与口令；当前音轨内嵌测试片，`audioUrl`为空，不启用独立音频播放器。正式拍点必须教师审核，AI分析只保留可替换接口。
- 动态水印匿名ID和会话ID均明确为DEMO，不包含姓名/电话。未来需服务器绑定会话、短期播放凭证、课程授权、私有视频托管；前端不生成假支付凭证。
- 生产答疑上传前必须实现课程授权、文件类型/大小验证、私有存储、访问控制、删除规则和教师后台。当前50MB限制只是本地选择演示，不能视为安全上传方案。
- Supabase、视频云、AI、真实支付和数据库均未连接，未部署或购买资源。未来接口说明见 `docs/platform-integration.md`，第一阶段范围与验收见 `docs/phase-one.md`。

## 工具链兼容性

Next.js ESLint配置中的部分插件目前仅声明兼容ESLint 9，因此保留ESLint 9.39.5。npm会提示其停止维护；待插件正式支持新版后整体升级，未用忽略peer依赖来掩盖冲突。TypeScript使用已验证的5.9.3，精确依赖见锁文件。
