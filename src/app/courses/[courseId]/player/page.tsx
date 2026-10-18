import Link from "next/link";
import { notFound } from "next/navigation";
import DancePlayer from "@/components/dance-player";
import { courses, findCourse } from "@/data/courses";
export function generateStaticParams() {
  return courses.map((course) => ({ courseId: course.id }));
}
export default async function PlayerPage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = await params;
  const course = findCourse(courseId);
  if (!course) notFound();
  return (
    <main className="shell player-page">
      <nav className="player-page-nav" aria-label="学习导航">
        <Link href={`/courses/${course.id}`}>← 课程与章节</Link>
        <Link href="/progress">学习进度</Link>
        <Link href={`/courses/${course.id}/questions`}>个人答疑（演示）</Link>
      </nav>
      <p className="eyebrow">全民舞 · {course.title}</p>
      <h1 className="sr-only">{course.title}演示播放器</h1>
      <DancePlayer course={course} />
    </main>
  );
}
