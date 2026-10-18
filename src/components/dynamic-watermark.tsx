import type { WatermarkSession } from "@/lib/learning-types";
export default function DynamicWatermark({
  session,
  time,
}: {
  session: WatermarkSession;
  time: number;
}) {
  // Playback-time movement is stable across pause and view switches; kept at the edge of the picture.
  const position = Math.floor(time / 5) % 4;
  return (
    <span
      className={`demo-watermark watermark-${position}`}
      data-testid="watermark"
    >
      演示水印 · {session.learnerId}
      <br />
      {session.courseId} · {session.sessionId}
    </span>
  );
}
