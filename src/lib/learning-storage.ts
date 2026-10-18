import type { LearningProgress, Question } from "./learning-types";
export const progressKey = (id: string) => `quanminwu:progress:${id}`;
export const questionKey = (id: string) => `quanminwu:questions:${id}`;
export function readProgress(id: string): LearningProgress | null {
  try {
    const data = JSON.parse(localStorage.getItem(progressKey(id)) ?? "null");
    if (
      !data ||
      data.version !== 1 ||
      data.courseId !== id ||
      !Number.isFinite(data.time) ||
      data.time < 0 ||
      !["front", "back", "mirror"].includes(data.view) ||
      ![0.5, 0.75, 0.9, 1, 1.25].includes(data.speed) ||
      !["teacher", "music", "independent"].includes(data.mode)
    )
      return null;
    if (
      typeof data.mirrored !== "boolean" ||
      typeof data.technical !== "boolean" ||
      typeof data.looping !== "boolean" ||
      typeof data.pointA !== "string" ||
      typeof data.pointB !== "string" ||
      typeof data.updatedAt !== "string" ||
      (data.segmentId !== null && typeof data.segmentId !== "string")
    )
      return null;
    return data as LearningProgress;
  } catch {
    return null;
  }
}
export function readQuestions(id: string): Question[] {
  try {
    const data = JSON.parse(localStorage.getItem(questionKey(id)) ?? "[]");
    return Array.isArray(data)
      ? data.filter(
          (q): q is Question =>
            q?.courseId === id &&
            q.status === "local-demo" &&
            typeof q.id === "string" &&
            typeof q.text === "string" &&
            typeof q.createdAt === "string" &&
            (q.localVideoName === null ||
              typeof q.localVideoName === "string") &&
            (q.feedback === null ||
              (q.feedback?.kind === "sample" &&
                typeof q.feedback.text === "string" &&
                typeof q.feedback.reviewTask === "string")),
        )
      : [];
  } catch {
    return [];
  }
}
