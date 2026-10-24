export type View = "front" | "back" | "mirror";
export type PracticeMode = "teacher" | "music" | "independent";
export type CourseGroup = "F" | "A" | "B" | "C" | "S";
export type VideoResource = {
  url: string;
  kind: "technical" | "licensed";
  timelineOffset: number;
  label: string;
};
export type TeachingSegment = {
  id: string;
  title: string;
  start: number;
  end: number;
  instruction: string;
  correction: string;
  kind: "warmup" | "demo" | "breakdown" | "cooldown";
};
export type MusicTimeline = {
  audioUrl: string | null;
  bpm: number;
  beatsPerBar: 4 | 8;
  offset: number;
  beats: { time: number; count: number; cue: string; preparation?: boolean }[];
  phrases: { start: number; end: number; label: string }[];
  reviewStatus: "demo-only" | "teacher-confirmed";
};
export type Course = {
  id: string;
  title: string;
  group: CourseGroup;
  level: string;
  module: string;
  description: string;
  focus: string[];
  duration: number;
  culturalNote?: string;
  videos: Record<View, VideoResource | null>;
  segments: TeachingSegment[];
  music: MusicTimeline;
};
export type WatermarkSession = {
  kind: "demo";
  learnerId: string;
  courseId: string;
  sessionId: string;
  serverSessionId: null;
};
export type LearningProgress = {
  version: 1;
  courseId: string;
  time: number;
  view: View;
  speed: number;
  mode: PracticeMode;
  mirrored: boolean;
  segmentId: string | null;
  pointA: string;
  pointB: string;
  looping: boolean;
  technical: boolean;
  updatedAt: string;
};
export type Question = {
  id: string;
  courseId: string;
  text: string;
  localVideoName: string | null;
  createdAt: string;
  status: "local-demo";
  feedback: { kind: "sample"; text: string; reviewTask: string } | null;
};
// Future server adapters must validate authorization; no client credential or fake token.
export interface PlaybackAuthorizationProvider {
  authorize(
    courseId: string,
  ): Promise<{
    expiresAt: string;
    videos: Course["videos"];
    watermark: Omit<WatermarkSession, "kind" | "serverSessionId"> & {
      kind: "production";
      serverSessionId: string;
    };
  }>;
}
export interface BeatAnalysisProvider {
  analyze(audio: Blob): Promise<MusicTimeline>; // Output must be teacher-reviewed before publishing.
}
