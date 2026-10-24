import Link from "next/link";
import { notFound } from "next/navigation";
import SiteNav from "@/components/site-nav";
import { courses, findCourse, groups } from "@/data/courses";
export function generateStaticParams() {
  return courses.map((course) => ({ courseId: course.id }));
}
export default async function CourseDetail({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = await params;
  const course = findCourse(courseId);
  if (!course) notFound();
  const group = groups.find((item) => item.code === course.group)!;
  return (
    <>
      <SiteNav />
      <main className="shell course-detail section">
        <Link className="text-link" href={`/learn/${group.slug}`}>
          ← {group.title}
        </Link>
        <p className="eyebrow">课程详情 · {course.level} · 演示</p>
        <h1 className="page-title">{course.title}</h1>
        <p className="page-lead">{course.description}</p>
        {course.culturalNote && (
          <p className="demo-notice">{course.culturalNote}</p>
        )}
        <div className="topic-list">
          {course.focus.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
        <div className="demo-notice">
          没有真实教学视频或报名服务。播放器内可加载24秒原创技术测试片，验证视角、时间轴和跟练工具；该时长不可代替完整热身或训练。
        </div>
        <div className="detail-actions">
          <Link
            className="button primary"
            href={`/courses/${course.id}/player`}
          >
            进入演示播放器 ↗
          </Link>
          <Link className="text-link" href={`/courses/${course.id}/questions`}>
            教师专属答疑（演示） →
          </Link>
        </div>
        <section className="section">
          <h2>章节目录</h2>
          <ol className="chapter-list">
            {course.segments.map((segment) => (
              <li key={segment.id}>
                <div>
                  <h3>{segment.title}</h3>
                  <p>{segment.instruction}</p>
                  <small>
                    技术演示时间轴：{segment.start}—{segment.end}秒
                  </small>
                </div>
                <Link
                  className="text-link"
                  href={`/courses/${course.id}/player#segment-title`}
                >
                  进入学习 →
                </Link>
              </li>
            ))}
          </ol>
        </section>
        <p className="safety-note">
          练习前充分动态热身；不在冷身时强压静态拉伸。疼痛或不适应停止，有伤病或运动限制请咨询专业人士。
        </p>
      </main>
    </>
  );
}
