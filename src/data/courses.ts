import type {
  Course,
  CourseGroup,
  MusicTimeline,
  VideoResource,
  View,
} from "@/lib/learning-types";

export const viewNames: Record<View, string> = {
  front: "正面",
  back: "背面",
  mirror: "对镜",
};
export const levelNames = ["L1 启蒙", "L2 基础", "L3 提高", "L4 表现"];
export const foundationModules = [
  "F0 成人舞蹈入门与安全认知",
  "F1 体态与身体排列",
  "F2 关节活动度、柔韧拉伸与基础力量",
  "F3 节奏、乐感与音乐理解",
  "F4 身体协调、重心与基础舞步",
  "F5 中国舞审美与初步舞蹈表达",
];
export const folkStyles = [
  "藏族舞",
  "蒙古族舞",
  "维吾尔族舞",
  "傣族舞",
  "汉族民间舞",
];
export const interestTopics = [
  "中国舞零基础体验",
  "古典舞气质与基础身韵",
  "民族民间舞主题兴趣班",
  "成品舞教学",
  "作品展演课程",
];
export const supportTopics = [
  "每日热身",
  "体态练习",
  "柔韧与放松",
  "音乐节奏练习",
  "教师答疑",
  "安全调整",
  "学习评价",
];
export const groups: {
  code: CourseGroup;
  slug: string;
  title: string;
  subtitle: string;
  symbol: string;
  color: string;
}[] = [
  {
    code: "F",
    slug: "foundation",
    title: "成人中国舞通用基础",
    subtitle: "边跳边学，从认识身体与听拍开始",
    symbol: "启",
    color: "sage",
  },
  {
    code: "A",
    slug: "classical",
    title: "中国古典舞",
    subtitle: "由体态、手位与步法，走近身韵和表达",
    symbol: "韵",
    color: "rose",
  },
  {
    code: "B",
    slug: "folk",
    title: "中国民族民间舞",
    subtitle: "尊重文化脉络，感受各具特色的动律",
    symbol: "舞",
    color: "amber",
  },
  {
    code: "C",
    slug: "interest",
    title: "综合兴趣课程",
    subtitle: "无需先完成等级，从喜欢的主题进入",
    symbol: "趣",
    color: "rose",
  },
  {
    code: "S",
    slug: "support",
    title: "日常练习与教学支持",
    subtitle: "热身、节奏、答疑与安全调整相伴",
    symbol: "伴",
    color: "blue",
  },
];

const beats: MusicTimeline["beats"] = Array.from(
  { length: 48 },
  (_, index) => ({
    time: index * 0.5,
    count: index < 4 ? index + 5 : ((index - 4) % 8) + 1,
    cue:
      index < 4
        ? "预备，听拍"
        : index < 20
          ? "完整示范 · 观察身体方向"
          : index < 36
            ? "分段讲解 · 留意手位与步伐"
            : "整理放松 · 自然呼吸",
    preparation: index < 4,
  }),
);
export const demoMusic: MusicTimeline = {
  audioUrl: null,
  bpm: 120,
  beatsPerBar: 8,
  offset: 2,
  beats,
  phrases: [
    { start: 0, end: 2, label: "预备拍 5、6、7、8" },
    { start: 2, end: 10, label: "两个八拍 · 完整观察" },
    { start: 10, end: 18, label: "两个八拍 · 分解练习" },
    { start: 18, end: 24, label: "整理放松" },
  ],
  reviewStatus: "demo-only",
};
export const technicalVideos: Record<View, VideoResource> = {
  front: {
    url: "/demo/front.mp4",
    kind: "technical",
    timelineOffset: 0,
    label: "正面通道技术测试图（非舞蹈拍摄）",
  },
  back: {
    url: "/demo/back.mp4",
    kind: "technical",
    timelineOffset: 0,
    label: "背面通道技术测试图（非舞蹈拍摄）",
  },
  mirror: {
    url: "/demo/mirror.mp4",
    kind: "technical",
    timelineOffset: 0,
    label: "对镜通道技术测试图（非真实对镜拍摄）",
  },
};
function makeCourse(
  id: string,
  title: string,
  group: CourseGroup,
  module: string,
  description: string,
  focus: string[],
  culturalNote?: string,
): Course {
  return {
    id,
    title,
    group,
    level: group === "A" || group === "B" ? "L1 启蒙" : "零基础可进入",
    module,
    description,
    focus,
    duration: 24,
    culturalNote,
    videos: { front: null, back: null, mirror: null },
    segments: [
      {
        id: "warmup",
        title: "课前动态热身与预备",
        start: 0,
        end: 2,
        instruction:
          "这是压缩的技术演示段落。正式练习前应完成充分、温和的动态热身。",
        correction: "不在冷身状态下做高强度静态拉伸。",
        kind: "warmup",
      },
      {
        id: "demo",
        title: "完整动作示范 · 两个八拍",
        start: 2,
        end: 10,
        instruction:
          "正式内容将提示手位、步伐及身体方向；当前测试图只验证数拍同步。",
        correction: "先观察，再按适合自己的幅度练习，不追求高难度。",
        kind: "demo",
      },
      {
        id: "breakdown",
        title: "分段讲解与重复练习",
        start: 10,
        end: 18,
        instruction: "预留手位、步伐和重心分解；可用单段循环反复观看。",
        correction: "不要憋气或强压关节；疼痛时立即停止。",
        kind: "breakdown",
      },
      {
        id: "cooldown",
        title: "课后整理与放松",
        start: 18,
        end: 24,
        instruction: "恢复自然呼吸；正式课程需提供充分整理放松时间。",
        correction: "演示片总长仅24秒，不可代替正式热身或训练。",
        kind: "cooldown",
      },
    ],
    music: demoMusic,
  };
}
const foundationTitles = [
  [
    "身体认知、自然站姿和听基本拍",
    "F0 / F1 / F3",
    "认识身体感受与自然站姿，边听拍边探索。",
  ],
  [
    "肩颈活动、四拍与手臂跟拍",
    "F2 / F3 / F4",
    "温和活动肩颈，让手臂和四拍配合。",
  ],
  ["骨盆、重心与八拍踏步", "F1 / F3 / F4", "认识重心变化与基础八拍踏步。"],
  ["髋膝踝协调与左右移步", "F2 / F4", "关注关节协调与左右移步的安全幅度。"],
  ["身体控制、平衡和八拍组合", "F1 / F4", "从小幅动作建立平衡与组合意识。"],
  ["身体活动度与十六拍动作", "F2 / F3 / F4", "将温和活动与十六拍练习结合。"],
  [
    "全身协调、乐句、呼吸及动作起止",
    "F3 / F4 / F5",
    "体会乐句与动作起止，保持自然呼吸。",
  ],
  [
    "三十二拍组合与入门评估",
    "F3 / F4 / F5",
    "通过自我观察认识下一步学习方向，不提供自动评分。",
  ],
];
export const courses: Course[] = [
  ...foundationTitles.map(([title, module, description], i) =>
    makeCourse(`foundation-${i + 1}`, title, "F", module, description, [
      "课前动态热身",
      "主体教学",
      "课后整理放松",
    ]),
  ),
  makeCourse(
    "classical-intro",
    "古典舞 · 基础手位与身韵初识",
    "A",
    "A-L1",
    "由基本体态、手型手位与步法，了解身韵、身法和舞蹈表达的学习路径。",
    ["基本体态", "手型手位", "步法与身韵", "身体控制", "组合与作品表现"],
  ),
  ...folkStyles.map((style, i) =>
    makeCourse(
      `folk-${i + 1}`,
      `${style} · 风格认知导学`,
      "B",
      "B-L1",
      `认识${style}的文化背景、地域差异和基础动律；演示数据不代替专业教学。`,
      ["文化背景", "地域风格", "典型动律"],
      `本页仅为${style}分类演示。正式内容须由相应专业教师审校，不混用其他民族服饰或典型动律。`,
    ),
  ),
  ...interestTopics.map((title, i) =>
    makeCourse(
      `interest-${i + 1}`,
      title,
      "C",
      `C${i + 1}`,
      "兴趣课可直接进入，不强制完成通用基础或专业等级。当前为课程结构演示。",
      ["零基础可进入", "按兴趣探索"],
    ),
  ),
  ...supportTopics.map((title, i) =>
    makeCourse(
      `support-${i + 1}`,
      title,
      "S",
      `S${i + 1}`,
      "配合当日身体状态与主课学习使用，不构成医疗或个性化运动处方。",
      ["量力而行", "辅助主课"],
    ),
  ),
];
export function findCourse(id: string) {
  return courses.find((course) => course.id === id);
}
