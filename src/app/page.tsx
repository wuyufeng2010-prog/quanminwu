import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { groups } from "@/data/courses";
import HomeNavigation from "@/components/home-navigation";
import styles from "./home.module.css";

export const metadata: Metadata = {
  title: { absolute: "全民舞 · 从喜欢开始，让舞蹈走进生活" },
  description: "面向成人的中国舞学习平台原型。探索通用基础、中国古典舞、中国民族民间舞、综合兴趣课程与教学支持五组方向。真实样课筹备中，当前课程与服务均为演示。",
};

const groupNotes: Record<string, string> = {
  F: "认识身体 · 听懂节拍 · 练习协调",
  A: "体态与手位 · 基础步法 · 身韵表达",
  B: "文化脉络 · 不同动律 · 风格体验",
  C: "零基础体验 · 主题兴趣 · 成品舞",
  S: "日常热身 · 节奏练习 · 安全调整",
};

const questions = [
  ["没有基础，可以从哪里开始？", "可以先浏览 F 通用基础，了解身体、节奏与安全认知；也可以从 C 兴趣课程寻找喜欢的主题。兴趣课不设强制先修，专业内容仍需结合自己的基础选择。"],
  ["古典舞和民族民间舞，要按顺序学习吗？", "不需要。A 中国古典舞与 B 中国民族民间舞是平等的两条专业主线，可以根据兴趣分别了解。通用基础也可以与舞蹈练习穿插进行。"],
  ["现在可以看真实样课或报名吗？", "暂时不可以。真实教学视频、课程授权与教师服务仍在筹备，尚未开放购买或报名。当前播放器使用原创技术测试片，不是舞蹈教学视频；答疑记录只保存在本机，没有真实教师接收。"],
];

function Wordmark({ footer = false }: { footer?: boolean }) {
  return <Link href="/" aria-label="全民舞首页" className={footer ? styles.footerLogo : styles.logo}>
    <Image src="/images/quanminwu-wordmark.png" width={640} height={233} alt="全民舞" unoptimized />
  </Link>;
}

export default function Home() {
  return (
    <div className={styles.home}>
      <a href="#main" className={styles.skip}>跳转至主要内容</a>
      <header className={styles.header}><div className={styles.container}><Wordmark /><HomeNavigation /></div></header>
      <main id="main" tabIndex={-1}>
        <section className={`${styles.hero} ${styles.container}`} aria-labelledby="hero-title">
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}>成人中国舞 · 每个人，都有自己的舞步</p>
            <h1 id="hero-title">从喜欢开始，<br />让舞蹈走进生活<span className={styles.fullStop}>。</span></h1>
            <span className={styles.redLine} aria-hidden="true" />
            <p className={styles.lead}>面向成人的中国舞学习，从基础认识、动作练习到舞蹈表达，找到适合自己的起点。</p>
            <div className={styles.actions}>
              <a href="#explore" className={styles.primary}>探索学习方向 <span aria-hidden="true">↗</span></a>
              <a href="#method" className={styles.secondary}>了解学习方式 <span aria-hidden="true">→</span></a>
            </div>
            <p className={styles.heroNote}>当前为平台演示，真实样课筹备中。</p>
          </div>
          <figure className={styles.heroFigure}>
            <Image src="/images/adult-dance-hero.webp" alt="AI 创作的品牌场景：三位成人在阳光下微笑着同步起舞，非真实教师或学员" width={1536} height={1024} sizes="(max-width: 760px) 100vw, 58vw" preload />
            <figcaption><span>一起起舞，让热爱发生。</span><small>AI 品牌意象 · 非真实教学场景</small></figcaption>
          </figure>
        </section>

        <div className={`${styles.manifesto} ${styles.container}`}>
          <p>不必先成为舞者，<br className={styles.mobileBreak} />也可以开始喜欢舞蹈。</p>
          <span>认识身体 <i aria-hidden="true">／</i> 感受节奏 <i aria-hidden="true">／</i> 找到表达</span>
        </div>

        <section id="sample" className={`${styles.sample} ${styles.container}`} aria-labelledby="sample-title">
          <div className={styles.sampleTicket}>
            <span className={styles.eyebrow}>第一支真实样课 / IN THE MAKING</span>
            <span className={styles.ticketTitle} aria-hidden="true">第一步，<br />认真准备。</span>
            <span className={styles.ticketFooter}>内容策划 → 素材制作 → 教学验收</span>
          </div>
          <div className={styles.sampleCopy}>
            <span className={styles.status}>筹备中 · 尚未开放</span>
            <h2 id="sample-title">先做好一节，<br />值得跟着学的课。</h2>
            <p>接下来，我们将围绕成人中国舞制作真实在线样课，让动作讲解、示范与练习衔接起来。</p>
            <p className={styles.small}>样课主题、教师、素材与上线时间待确认。当前可浏览课程结构与技术演示，尚无真实教学内容。</p>
            <Link href="/courses/classical-intro" className={styles.underlined}>先看古典舞课程结构演示 <span aria-hidden="true">↗</span></Link>
          </div>
        </section>

        <section id="explore" className={`${styles.explore} ${styles.container}`} aria-labelledby="explore-title">
          <div className={styles.sectionHeading}>
            <div><p className={styles.eyebrow}>五组课程方向 / FIND YOUR WAY</p><h2 id="explore-title">找到你的学习起点</h2></div>
            <p>基础可以边跳边学。<br />从兴趣出发，也从容向前。</p>
          </div>
          <p className={styles.catalogNotice}>以下为课程体系与学习方向演示，真实课程及教师服务尚未开放。</p>
          <div className={styles.groupGrid}>
            {groups.map((group) => (
              <Link href={`/learn/${group.slug}`} key={group.code} className={`${styles.group} ${group.code === "F" ? styles.foundation : ""}`}>
                <span className={styles.groupCode} aria-hidden="true">{group.code}<span> / {group.code === "F" ? "FOUNDATION" : group.code === "A" ? "CLASSICAL" : group.code === "B" ? "FOLK" : group.code === "C" ? "INTEREST" : "SUPPORT"}</span></span>
                <div className={styles.groupBody}><h3>{group.title}</h3><p>{group.subtitle}</p><small>{groupNotes[group.code]}</small></div>
                <span className={styles.groupLink}>查看方向 <span aria-hidden="true">↗</span></span>
              </Link>
            ))}
          </div>
          <p className={styles.pathNote}>A / B 为平等专业主线 · C 兴趣课不设强制先修 · F 基础与 S 支持可穿插学习</p>
          <Link href="/learn" className={styles.underlined}>浏览全部课程结构 <span aria-hidden="true">→</span></Link>
        </section>

        <section id="method" className={styles.method} aria-labelledby="method-title">
          <div className={styles.container}>
            <div className={styles.sectionHeading}><div><p className={styles.eyebrow}>按自己的节奏 / YOUR OWN PACE</p><h2 id="method-title">把练习，变成更清楚的小步。</h2></div><p>以下为可操作的技术原型。<br />教学内容与教师服务尚未接入。</p></div>
            <div className={styles.steps}>
              <article><span>01 / 看清楚</span><h3>动作，可以慢慢看。</h3><p>体验慢速播放、镜像翻转与分段循环，了解适合手机横屏的练习界面。</p><small>三视角通道当前使用图形技术测试片，非舞蹈示范。</small></article>
              <article><span>02 / 找节奏</span><h3>练习，有自己的步调。</h3><p>在技术测试片中体验与播放时间同步的数拍及段落提示，试着理解练习工具。</p><small>数拍基于预设时间轴，没有自动音乐分析或 AI 评分。</small></article>
              <article><span>03 / 留下问题</span><h3>把不懂的，先记下来。</h3><p>体验本机问题记录和示例反馈，为未来的学习反馈流程准备更清晰的表达。</p><small>记录只保存在本机，不上传视频，没有真实教师接收。</small></article>
            </div>
            <Link href="/courses/classical-intro/player" className={styles.underlined}>体验技术演示播放器 <span aria-hidden="true">↗</span></Link>
          </div>
        </section>

        <section className={`${styles.faq} ${styles.container}`} aria-labelledby="faq-title">
          <div><p className={styles.eyebrow}>开始之前 / A FEW QUESTIONS</p><h2 id="faq-title">你可能想先知道</h2></div>
          <div>{questions.map(([question, answer]) => <details key={question}><summary>{question}<span aria-hidden="true">＋</span></summary><p>{answer}</p></details>)}</div>
        </section>

        <section id="about" className={`${styles.about} ${styles.container}`} aria-labelledby="about-title">
          <p className={styles.eyebrow}>关于全民舞 / DANCE BELONGS TO EVERYONE</p>
          <h2 id="about-title">各有舞步，也能一起起舞。</h2>
          <p>“全民”，是尊重不同年龄、基础与身体状态；<br />“舞”，是从身体与节奏出发，慢慢找到自己的表达。</p>
          <p>我们希望，让成人中国舞的学习更清晰，也更贴近日常。</p>
          <p className={styles.safety}>练习请量力而行；疼痛或不适时立即停止。有伤病或运动限制，请先咨询专业人士。</p>
        </section>
      </main>

      <footer className={styles.footer}><div className={styles.container}>
        <Wordmark footer />
        <p>成人中国舞学习平台原型<br /><small>课程与服务均为演示 · 暂不提供购买与报名</small></p>
        <div><Link href="/progress">本机学习进度</Link><a href="#main">回到顶部 ↑</a></div>
      </div></footer>
    </div>
  );
}
