import Link from "next/link";
import { notFound } from "next/navigation";
import SiteNav from "@/components/site-nav";
import QuestionDemo from "@/components/question-demo";
import { courses, findCourse } from "@/data/courses";
export function generateStaticParams() {
  return courses.map((course) => ({ courseId: course.id }));
}
export default async function Questions({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = await params;
  const course = findCourse(courseId);
  if (!course) notFound();
  return (
    <>
      <SiteNav />
      <main className="shell section">
        <Link className="text-link" href={`/courses/${course.id}/player`}>
          ← 返回本节课播放器
        </Link>
        <p className="eyebrow">教师专属答疑 · 本地演示</p>
        <h1 className="page-title">遇到问题，慢慢说清楚</h1>
        <p className="page-lead">
          关联课程：{course.title}
          。以下演示异步个人指导流程，不提供实时教师服务。
        </p>
        <QuestionDemo course={course} />
      </main>
    </>
  );
}
