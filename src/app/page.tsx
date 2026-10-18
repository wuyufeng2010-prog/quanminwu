import Link from "next/link";
import { groups } from "@/data/courses";
export default function Home() {
  return (
    <>
      <a href="#main" className="skip-link">
        跳转至主要内容
      </a>
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
            <a href="#explore">探索学习</a>
            <a href="#method">学习方式</a>
            <Link href="/progress">学习进度</Link>
          </nav>
          <span className="demo-pill">平台演示版</span>
        </div>
      </header>
      <main id="main">
        <section className="hero shell" aria-labelledby="hero-title">
          <div className="hero-copy">
            <p className="eyebrow">每个年龄，都有自己的舞步</p>
            <h1 id="hero-title">
              从容起舞，
              <br />
              自在<span>生长。</span>
            </h1>
            <p className="hero-description">
              为18—65岁的你，留一段与身体相处的时光。
              <br className="desktop-break" />
              从第一拍开始，慢慢找到属于自己的节奏。
            </p>
            <div className="hero-actions">
              <a className="button primary" href="#explore">
                探索学习方向 <span aria-hidden="true">↗</span>
              </a>
              <a className="text-link" href="#method">
                了解如何学习 <span aria-hidden="true">→</span>
              </a>
            </div>
            <p className="hero-note">零基础也能开始了解 · 按自己的节奏探索</p>
          </div>
          <div
            className="hero-art"
            role="img"
            aria-label="以圆月、流动曲线与舞字组成的东方舞蹈抽象插画"
          >
            <div className="art-orbit" />
            <div className="art-disc" />
            <span className="art-word">舞</span>
            <svg
              className="art-ribbon"
              viewBox="0 0 500 500"
              aria-hidden="true"
            >
              <path d="M70 440C420 400 10 185 330 85S530 225 330 280 70 270 165 110" />
            </svg>
            <span className="art-caption">身随心动 · 舞出日常</span>
            <span className="art-side">一呼一吸，皆有韵律</span>
          </div>
        </section>
        <section
          id="explore"
          className="section shell"
          aria-labelledby="explore-title"
        >
          <div className="section-heading">
            <div>
              <p className="eyebrow">找到你的第一步 / EXPLORE</p>
              <h2 id="explore-title">找到适合你的学习起点</h2>
            </div>
            <p>无需急于进阶，先从感兴趣的方向开始。</p>
          </div>
          <p className="demo-notice">
            演示内容说明：以下为学习方向与页面结构示例，暂无真实课程或教师服务；播放器提供原创技术测试片，不是舞蹈教学。
          </p>
          <div className="category-grid">
            {groups.map((c) => (
              <Link
                href={`/learn/${c.slug}`}
                className={`category-card ${c.color}`}
                key={c.slug}
              >
                <div className="card-art" aria-hidden="true">
                  <span className="card-number">{c.code} / EXPLORE</span>
                  <span className="card-symbol">{c.symbol}</span>
                  <span className="art-line" />
                </div>
                <div className="card-body">
                  <span className="sample-label">学习方向演示</span>
                  <h3>{c.title}</h3>
                  <p>{c.subtitle}</p>
                  <div className="tags">
                    <span>课程结构演示</span>
                  </div>
                  <span className="card-link">
                    查看学习方向 <span aria-hidden="true">↗</span>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
        <section id="method" className="method-section">
          <div className="shell section">
            <div className="section-heading">
              <div>
                <p className="eyebrow">让学习融入生活 / YOUR PACE</p>
                <h2>小小一步，也是一种进步</h2>
              </div>
              <p>播放器与答疑支持真实操作，教学内容和教师服务仍为演示。</p>
            </div>
            <div className="method-grid">
              <article>
                <span className="step">01</span>
                <h3>清晰看，慢慢学</h3>
                <p>
                  体验三视角、慢速播放与分段循环；可手动横屏，让每次练习都有自己的节奏。
                </p>
              </article>
              <article>
                <span className="step">02</span>
                <h3>听节奏，找感觉</h3>
                <p>
                  根据技术测试片的真实播放时间同步数拍与段落提示，尚无自动音乐分析或AI评分。
                </p>
              </article>
              <article>
                <span className="step">03</span>
                <h3>有疑问，一起聊</h3>
                <p>
                  体验本地答疑表单与示例反馈；没有真实教师接收问题，练习视频不会上传。
                </p>
              </article>
            </div>
          </div>
        </section>
        <section id="about" className="about shell section">
          <p className="eyebrow">关于全民舞</p>
          <h2>舞蹈，是与自己相处的另一种方式。</h2>
          <p>
            中国古典舞与中国民族民间舞并行发展，结合通用基础、兴趣课程与教学支持，让成人舞蹈学习更清晰、更从容。
            <br />
            尊重不同年龄、基础与身体状态，让热爱在日常里慢慢生长。
          </p>
          <p className="safety-note">
            练习时请量力而行，出现疼痛或不适应立即停止；有伤病或运动限制，请先咨询专业人士。
          </p>
        </section>
      </main>
      <footer className="footer">
        <div className="shell footer-inner">
          <span className="footer-brand">
            全民舞 <small>QUAN MIN WU</small>
          </span>
          <p>项目原型 · 所有学习资料均为演示 · 暂不提供购买与报名</p>
          <a href="#main">回到顶部 ↑</a>
        </div>
      </footer>
    </>
  );
}
