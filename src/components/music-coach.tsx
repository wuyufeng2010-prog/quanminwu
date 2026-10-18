import { timelineAt } from "@/lib/music-timeline";
import type { MusicTimeline, PracticeMode } from "@/lib/learning-types";
export default function MusicCoach({
  timeline,
  time,
  mode,
  beatsPerBar,
  active,
}: {
  timeline: MusicTimeline;
  time: number;
  mode: PracticeMode;
  beatsPerBar: 4 | 8;
  active: boolean;
}) {
  if (mode === "independent")
    return (
      <div className="music-coach">
        <strong>独立练习 · 提示已关闭</strong>
        <p>仍使用原视频音轨，不产生自动评分。</p>
      </div>
    );
  if (!active)
    return (
      <div className="music-coach">
        <strong>等待匹配的教学时间轴</strong>
        <p>暂无对应素材，或本地文件尚未校准拍点，当前不显示数拍。</p>
      </div>
    );
  const { beat, phrase } = timelineAt(timeline, time, beatsPerBar);
  return (
    <div className="music-coach" aria-label="音乐数拍提示">
      <div>
        <span className="coach-label">音乐跟练 · 人工时间轴演示</span>
        <p>
          {beat?.preparation ? "预备拍" : `${beatsPerBar}拍练习`}{" "}
          <strong className="beat-number" data-testid="beat-count">
            {beat?.count ?? "—"}
          </strong>
          <span>{phrase?.label ?? "等待播放"}</span>
        </p>
      </div>
      <p>
        {mode === "music"
          ? beat?.cue
          : "跟随老师模式 · 正式内容将提供教师口令；当前为技术测试"}
      </p>
      <small>
        根据视频实际时间同步 · {timeline.bpm} BPM ·{" "}
        {timeline.reviewStatus === "teacher-confirmed"
          ? "教师已确认时间轴"
          : "演示时间轴 · 待教师确认"}{" "}
        · 无自动AI分析或评分
      </small>
    </div>
  );
}
