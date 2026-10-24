import type { MusicTimeline } from "./learning-types";
// Inputs are media time, never elapsed wall-clock time. Pauses, seeking and speed changes stay aligned.
export function timelineAt(
  timeline: MusicTimeline,
  time: number,
  beatsPerBar: 4 | 8 = timeline.beatsPerBar,
) {
  const phrase = timeline.phrases.find(
    (item) => time >= item.start && time < item.end,
  );
  const beat = phrase
    ? timeline.beats.findLast(
        (item) => item.time <= time && item.time >= phrase.start,
      )
    : null;
  return {
    beat: beat
      ? {
          ...beat,
          count: beat.preparation
            ? beat.count
            : ((beat.count - 1) % beatsPerBar) + 1,
        }
      : null,
    phrase,
  };
}
