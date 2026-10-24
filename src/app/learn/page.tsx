import Link from "next/link";
import SiteNav from "@/components/site-nav";
import { groups } from "@/data/courses";
export default function Learn() {
  return (
    <>
      <SiteNav />
      <main className="shell section">
        <p className="eyebrow">按自己的节奏，开始学习</p>
        <h1 className="page-title">今天，想从哪里开始？</h1>
        <p className="page-lead">
          通用基础可与跳舞穿插进行，无需学完理论再开始。古典舞与民族民间舞是平等的两条专业主线，兴趣课可直接进入。
        </p>
        <p className="demo-notice">
          全部为结构化课程演示。测试片仅含原创图形与合成节拍，不含真实教学或教师服务。
        </p>
        <div className="course-grid">
          {groups.map((group) => (
            <Link
              className={`catalog-card ${group.color}`}
              key={group.slug}
              href={`/learn/${group.slug}`}
            >
              <span className="catalog-symbol" aria-hidden="true">
                {group.symbol}
              </span>
              <h2>{group.title}</h2>
              <p>{group.subtitle}</p>
              <span className="text-link">查看课程 →</span>
            </Link>
          ))}
        </div>
      </main>
    </>
  );
}
