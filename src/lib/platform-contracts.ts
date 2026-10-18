import type {
  LearningProgress,
  MusicTimeline,
  Question,
} from "./learning-types";

/** Integration contracts only: no provider is implemented or connected in this phase. */
export type PlatformResult<T> =
  | { ok: true; data: T }
  | {
      ok: false;
      error: {
        code:
          | "not-connected"
          | "unauthenticated"
          | "forbidden"
          | "not-found"
          | "invalid-input"
          | "conflict"
          | "unavailable";
        message: string;
      };
    };

export type PlatformSession =
  | { state: "anonymous" }
  | {
      state: "authenticated";
      user: { id: string; displayName: string };
      expiresAt: string;
    };

export interface AuthenticationProvider {
  getSession(): Promise<PlatformResult<PlatformSession>>;
  /** The server must validate this local return path and the login redirect. */
  beginSignIn(returnTo: string): Promise<PlatformResult<{ redirectUrl: string }>>;
  signOut(): Promise<PlatformResult<null>>;
}

export type CloudLearningProgress = {
  progress: LearningProgress;
  /** Opaque server revision; browser timestamps must not resolve write conflicts. */
  revision: string;
  savedAt: string;
};

export interface LearningProgressProvider {
  get(courseId: string): Promise<PlatformResult<CloudLearningProgress | null>>;
  save(input: {
    progress: LearningProgress;
    /** null creates a new record; an existing record requires its current revision. */
    expectedRevision: string | null;
  }): Promise<PlatformResult<CloudLearningProgress>>;
  remove(courseId: string): Promise<PlatformResult<null>>;
}

export type CourseAccess =
  | {
      state: "granted";
      courseId: string;
      reason: "free" | "enrollment" | "purchase";
      expiresAt: string | null;
    }
  | {
      state: "denied";
      courseId: string;
      reason: "sign-in-required" | "entitlement-required" | "unavailable";
    };

/** Checks server-owned entitlements; this contract cannot create a purchase. */
export interface CourseAccessProvider {
  getAccess(courseId: string): Promise<PlatformResult<CourseAccess>>;
}

export type TeacherAnswer = {
  teacherId: string;
  text: string;
  reviewTask: string | null;
  answeredAt: string;
};

/** Kept separate from Question's local-demo status and fixed sample feedback. */
export type SubmittedQuestion = Pick<
  Question,
  "id" | "courseId" | "text" | "createdAt"
> & {
  learnerId: string;
  status: "awaiting-teacher" | "answered" | "closed";
  answer: TeacherAnswer | null;
  updatedAt: string;
};

export type PageRequest = { cursor?: string; limit?: number };
export type ResultPage<T> = { items: T[]; nextCursor: string | null };

export interface TeacherQuestionProvider {
  listMine(
    courseId: string,
    page?: PageRequest,
  ): Promise<PlatformResult<ResultPage<SubmittedQuestion>>>;
  submit(input: {
    courseId: string;
    text: string;
  }): Promise<PlatformResult<SubmittedQuestion>>;
  remove(questionId: string): Promise<PlatformResult<null>>;
}

export type StoredMusicTimeline = {
  courseId: string;
  timeline: MusicTimeline;
  revision: string;
  confirmation: { teacherId: string; confirmedAt: string } | null;
};

export interface TeacherWorkspaceProvider {
  getTimeline(courseId: string): Promise<PlatformResult<StoredMusicTimeline>>;
  /** Server checks course assignment, validates timestamps, and records reviewer. */
  confirmTimeline(input: {
    courseId: string;
    timeline: Omit<MusicTimeline, "reviewStatus">;
    expectedRevision: string;
  }): Promise<PlatformResult<StoredMusicTimeline>>;
  listAssignedQuestions(
    courseId: string,
    page?: PageRequest,
  ): Promise<PlatformResult<ResultPage<SubmittedQuestion>>>;
  answerQuestion(input: {
    questionId: string;
    text: string;
    reviewTask: string | null;
  }): Promise<PlatformResult<SubmittedQuestion>>;
}
