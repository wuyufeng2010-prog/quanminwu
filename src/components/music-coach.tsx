import { timelineAt } from "@/lib/music-timeline";
import type { MusicTimeline, PracticeMode } from "@/lib/learning-types";
export default function MusicCoach({
  timeline,
  time,
  mode,
  beatsPerBar,
}: {
  timeline: MusicTimeline;
  time: number;
  mode: PracticeMode;
  beatsPerBar: 4 | 8;
}) {
  if (mode === "independent")
    return (
      <div className="music-coach">
        <strong>独立练习 · 提示已关闭</strong>
        <p>仍使用原视频音轨，不产生自动评分。</p>
      </div>
    );
  const { beat, phrase } = timelineAt(timeline, time, beatsPerBar);
  return (
    <div className="music-coach" aria-label="音乐数拍提示">
      <div>
        <span className="coach-label">
          全民舞 AI音乐跟练教练 · 人工配置演示
        </span>
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
        根据视频实际时间同步 · {timeline.bpm} BPM · 当前时间轴未经教学审核，不含
        AI 分析或评分
      </small>
    </div>
  );
}
