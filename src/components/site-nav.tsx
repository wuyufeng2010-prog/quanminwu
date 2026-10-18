import Link from "next/link";
export default function SiteNav() {
  return (
    <header className="site-header">
      <div className="shell header-inner">
        <Link href="/" className="brand" aria-label="全民舞首页">
          <span className="brand-mark" aria-hidden="true">
            舞
          </span>
          <span>
            全民舞<small>QUAN MIN WU</small>
          </span>
        </Link>
        <nav aria-label="主导航">
          <Link href="/learn">选课学习</Link>
          <Link href="/progress">学习进度</Link>
          <Link href="/#about">关于平台</Link>
        </nav>
        <span className="demo-pill">教学原型 · V3.3</span>
      </div>
    </header>
  );
}
