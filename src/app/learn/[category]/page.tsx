import Link from "next/link";
import { notFound } from "next/navigation";
import { categories } from "@/data/categories";
export function generateStaticParams() { return categories.map(c => ({ category: c.slug })); }
export default async function LearningPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const item = categories.find(c => c.slug === category);
  if (!item) notFound();
  return <main className="shell learning-page"><Link className="text-link" href="/#explore">← 返回学习方向</Link><p className="eyebrow">全民舞 · 学习方向演示</p><h1>{item.title}</h1><p className="learning-description">{item.description}</p><div className="demo-notice">这是演示页面，不是真实课程。暂未接入视频、报名、支付或学员账户。</div><section aria-labelledby="video-title"><h2 id="video-title">横屏教学区域 · 功能规划</h2><div className="video-placeholder"><span aria-hidden="true">▷</span><p>未来在此呈现横屏教学视频</p><small>当前没有可播放视频</small></div><p>计划支持：动作分解、倍速、选段循环与断点续播。</p></section><nav className="learning-nav" aria-label="学习页面规划"><a href="#outline">内容规划</a><a href="#practice">练习提示</a><a href="#questions">答疑规划</a></nav><section id="outline"><h2>内容规划</h2><p>拟围绕{item.tags.join("、")}组织内容。实际课程需经教学审核后发布。</p></section><section id="practice"><h2>练习提示</h2><p>请在安全、宽敞的空间练习，先热身，并根据自身情况调整强度。</p></section><section id="questions"><h2>答疑规划</h2><p>学员提问与教师回复功能尚未开放，目前不会收集或保存任何问题。</p></section></main>;
}
