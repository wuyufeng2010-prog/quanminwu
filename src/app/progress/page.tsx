import SiteNav from "@/components/site-nav";
import ProgressDemo from "@/components/progress-demo";
export default function ProgressPage() {
  return (
    <>
      <SiteNav />
      <main className="shell section">
        <p className="eyebrow">按自己的节奏继续</p>
        <h1 className="page-title">我的学习进度 · 本机演示</h1>
        <p className="page-lead">
          自动记住同一课程的位置、视角、速度和练习模式。没有账号、数据库、AI评分或云端保存。
        </p>
        <ProgressDemo />
      </main>
    </>
  );
}
