import Link from "next/link";
import { notFound } from "next/navigation";
import SiteNav from "@/components/site-nav";
import {
  courses,
  groups,
  foundationModules,
  levelNames,
  folkStyles,
  interestTopics,
  supportTopics,
} from "@/data/courses";
export function generateStaticParams() {
  return [
    ...groups.map((group) => ({ category: group.slug })),
    { category: "posture" },
    { category: "rhythm" },
  ];
}
export default async function LearningPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const group =
    groups.find((item) => item.slug === category) ??
    (["posture", "rhythm"].includes(category)
      ? groups.find((item) => item.code === "S")
      : undefined);
  if (!group) notFound();
  const selected = courses.filter((course) => course.group === group.code);
  const topics =
    group.code === "F"
      ? foundationModules
      : group.code === "A"
        ? levelNames
        : group.code === "B"
          ? [...levelNames, ...folkStyles]
          : group.code === "C"
            ? interestTopics
            : supportTopics;
  return (
    <>
      <SiteNav />
      <main className="shell section">
        <Link className="text-link" href="/learn">
          ← 全部学习方向
        </Link>
        <p className="eyebrow">课程分类 · 演示</p>
        <h1 className="page-title">{group.title}</h1>
        <p className="page-lead">{group.subtitle}</p>
        <div className="topic-list">
          {topics.map((topic) => (
            <span key={topic}>{topic}</span>
          ))}
        </div>
        {group.code === "F" && (
          <p className="page-lead">
            以下8节导学结合动态热身、主体教学与课后放松，交叉覆盖基础模块，不设置理论先修门槛。
          </p>
        )}
        <p className="demo-notice">
          课程标题与目录仅作演示，未发布真实教学视频。专业主线的L2—L4目前仅为等级规划；可进入启蒙演示体验播放器。
        </p>
        <div className="course-grid">
          {selected.map((course, i) => (
            <Link
              className="catalog-card"
              href={`/courses/${course.id}`}
              key={course.id}
            >
              <span className="sample-label">
                演示课程 · {String(i + 1).padStart(2, "0")}
              </span>
              <h2>{course.title}</h2>
              <p>{course.description}</p>
              <span>{course.level}</span>
              <span className="text-link">查看章节与课程 →</span>
            </Link>
          ))}
        </div>
      </main>
    </>
  );
}
