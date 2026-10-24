"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { technicalVideos, viewNames } from "@/data/courses";
import { progressKey, readProgress } from "@/lib/learning-storage";
import type {
  Course,
  LearningProgress,
  PracticeMode,
  View,
  WatermarkSession,
} from "@/lib/learning-types";
import MusicCoach from "./music-coach";
import DynamicWatermark from "./dynamic-watermark";
import "./dance-player.css";

type LocalSource = { url: string; name: string; timelineOffset: number };
const speeds = [0.5, 0.75, 0.9, 1, 1.25];
const subscribe = () => () => {};
const clientSnapshot = () => true;
const serverSnapshot = () => false;
function clock(seconds: number) {
  if (!Number.isFinite(seconds)) return "00:00";
  return `${Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0")}:${Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0")}`;
}
export default function DancePlayer({ course }: { course: Course }) {
  const client = useSyncExternalStore(
    subscribe,
    clientSnapshot,
    serverSnapshot,
  );
  return client ? (
    <PlayerSession
      key={course.id}
      course={course}
      saved={readProgress(course.id)}
    />
  ) : (
    <p className="demo-notice">正在准备播放器；课程内容均为演示。</p>
  );
}
function PlayerSession({
  course,
  saved,
}: {
  course: Course;
  saved: LearningProgress | null;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const keyboardInteraction = useRef(false);
  const lastInteraction = useRef(0);
  const immersiveTrigger = useRef<HTMLButtonElement>(null);
  const immersiveExit = useRef<HTMLButtonElement>(null);
  const urls = useRef(new Set<string>());
  const pendingTime = useRef(saved?.time ?? 0);
  const resumePlaying = useRef(false);
  const [locals, setLocals] = useState<Partial<Record<View, LocalSource>>>({});
  const [technical, setTechnical] = useState(saved?.technical ?? false);
  const [view, setView] = useState<View>(saved?.view ?? "back");
  const [duration, setDuration] = useState(0);
  const [time, setTime] = useState(saved?.time ?? 0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(saved?.speed ?? 1);
  const [mirrored, setMirrored] = useState(saved?.mirrored ?? false);
  const [mode, setMode] = useState<PracticeMode>(saved?.mode ?? "teacher");
  const [beatsPerBar, setBeatsPerBar] = useState<4 | 8>(8);
  const [pointA, setPointA] = useState(saved?.pointA ?? "");
  const [pointB, setPointB] = useState(saved?.pointB ?? "");
  const [looping, setLooping] = useState(saved?.looping ?? false);
  const [segmentId, setSegmentId] = useState<string | null>(
    saved?.segmentId ?? null,
  );
  const [failed, setFailed] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [immersive, setImmersive] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [message, setMessage] = useState(
    saved
      ? "已恢复本课程设置与位置；不会自动播放。本地文件需重新选择。"
      : "暂无教学素材。可加载原创技术测试片，验证播放器与数拍。",
  );
  const [storageFailed, setStorageFailed] = useState(false);
  const [session] = useState<WatermarkSession>(() => ({
    kind: "demo",
    learnerId: "DEMO-001",
    courseId: course.id,
    sessionId: `DEMO-${globalThis.crypto?.randomUUID?.().slice(0, 8) ?? Math.random().toString(36).slice(2, 10)}`,
    serverSessionId: null,
  }));
  const source =
    locals[view] ?? (technical ? technicalVideos[view] : course.videos[view]);
  const offset = source?.timelineOffset ?? 0;
  const ready = !!source && duration > 0 && !failed;
  const a = Number(pointA),
    b = Number(pointB);
  const validLoop =
    ready &&
    pointA !== "" &&
    pointB !== "" &&
    Number.isFinite(a) &&
    Number.isFinite(b) &&
    a >= 0 &&
    b - a >= 0.1 &&
    b <= duration;
  const currentSegment = course.segments.find(
    (segment) => time >= segment.start && time < segment.end,
  );
  const snapshot = useRef<LearningProgress | null>(null);

  useEffect(() => {
    snapshot.current = {
      version: 1,
      courseId: course.id,
      time,
      view,
      speed,
      mode,
      mirrored,
      segmentId,
      pointA,
      pointB,
      looping,
      technical: technical && !locals[view],
      updatedAt: new Date().toISOString(),
    };
  }, [
    course.id,
    time,
    view,
    speed,
    mode,
    mirrored,
    segmentId,
    pointA,
    pointB,
    looping,
    technical,
    locals,
  ]);
  useEffect(() => {
    const ownedUrls = urls.current;
    const save = () => {
      if (!snapshot.current) return;
      try {
        localStorage.setItem(
          progressKey(course.id),
          JSON.stringify(snapshot.current),
        );
      } catch {
        setStorageFailed(true);
      }
    };
    const interval = setInterval(save, 1000);
    window.addEventListener("pagehide", save);
    return () => {
      clearInterval(interval);
      window.removeEventListener("pagehide", save);
      save();
      ownedUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [course.id]);
  useEffect(() => {
    if (!immersive) return;
    const previousOverflow = document.body.style.overflow;
    const trigger = immersiveTrigger.current;
    document.body.style.overflow = "hidden";
    immersiveExit.current?.focus();
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !document.fullscreenElement)
        setImmersive(false);
    };
    document.addEventListener("keydown", escape);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", escape);
      if (trigger?.isConnected) trigger.focus();
    };
  }, [immersive]);
  useEffect(() => {
    const changed = () =>
      setFullscreen(document.fullscreenElement === frameRef.current);
    document.addEventListener("fullscreenchange", changed);
    return () => document.removeEventListener("fullscreenchange", changed);
  }, []);
  useEffect(() => {
    if (!playing) return;
    let request: number;
    let sampledAt = 0;
    const tick = (now: number) => {
      const video = videoRef.current;
      if (video) {
        let position = Math.max(0, video.currentTime - offset);
        if (looping && validLoop && (position >= b || position < a)) {
          video.currentTime = a + offset;
          position = a;
        }
        // Reuse the media clock at most 10 times a second; no independent beat timer.
        if (now - sampledAt >= 100) {
          sampledAt = now;
          pendingTime.current = position;
          setTime(position);
        }
      }
      request = requestAnimationFrame(tick);
    };
    request = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(request);
  }, [playing, looping, validLoop, a, b, offset]);
  useEffect(() => {
    if (!playing || hidden) return;
    lastInteraction.current = Date.now();
    const timer = setInterval(() => {
      const editing =
        frameRef.current?.contains(document.activeElement) &&
        document.activeElement?.matches("input[type=number], select");
      if (
        !keyboardInteraction.current &&
        !editing &&
        Date.now() - lastInteraction.current >= 4500
      )
        setHidden(true);
    }, 250);
    return () => clearInterval(timer);
  }, [playing, hidden]);

  function prepareSwitch() {
    pendingTime.current = videoRef.current
      ? Math.max(0, videoRef.current.currentTime - offset)
      : time;
    resumePlaying.current = playing;
    videoRef.current?.pause();
    setPlaying(false);
    setDuration(0);
    setFailed(false);
    setHidden(false);
  }
  function switchView(next: View) {
    if (next === view) return;
    prepareSwitch();
    setView(next);
    setMessage(
      `切换到${viewNames[next]}，保留课程时间与练习设置；缺失素材时不替代为其他视角。`,
    );
  }
  async function play() {
    const video = videoRef.current;
    if (!video) return;
    try {
      await video.play();
    } catch (error) {
      if (!(error instanceof DOMException && error.name === "AbortError"))
        setMessage("暂时无法播放，请点击重试或更换支持的视频格式。");
    }
  }
  function seek(value: number) {
    if (!ready || !videoRef.current) return;
    if (looping && (value < a || value >= b)) {
      setLooping(false);
      setMessage("已跳出循环区间，AB 循环已停止。");
    }
    videoRef.current.currentTime = value + offset;
    setTime(value);
    pendingTime.current = value;
  }
  function chooseFile(file: File | undefined, target: View) {
    if (!file) return;
    if (
      !file.type.startsWith("video/") &&
      !/\.(mp4|webm|mov|m4v|ogv)$/i.test(file.name)
    ) {
      setMessage("请选择视频文件，例如 MP4 或 WebM。");
      return;
    }
    if (target === view) prepareSwitch();
    const previous = locals[target];
    const url = URL.createObjectURL(file);
    urls.current.add(url);
    setLocals((current) => ({
      ...current,
      [target]: { url, name: file.name, timelineOffset: 0 },
    }));
    if (previous) {
      URL.revokeObjectURL(previous.url);
      urls.current.delete(previous.url);
    }
    setMessage(
      "已选择本地文件，仅在本页读取。演示时间轴不代表该文件的实际节拍；正式素材需配置并审核时间轴。",
    );
  }
  function useTechnical() {
    prepareSwitch();
    if (technical && !locals[view]) videoRef.current?.load();
    urls.current.forEach((url) => URL.revokeObjectURL(url));
    urls.current.clear();
    setLocals({});
    setTechnical(true);
    setMessage(
      "已加载三份不同的原创技术测试图与合成节拍音，不是舞蹈、多机位或真实对镜教学。",
    );
  }
  function activateLoop(start = a, end = b, label?: string) {
    if (
      !ready ||
      !Number.isFinite(start) ||
      !Number.isFinite(end) ||
      start < 0 ||
      end - start < 0.1 ||
      end > duration ||
      (!label && (pointA === "" || pointB === ""))
    ) {
      setMessage(
        "请设置有效循环：0 ≤ A < B ≤ 视频时长，间隔至少0.1秒；当前素材须覆盖该教学段落。",
      );
      return;
    }
    setPointA(start.toFixed(1));
    setPointB(end.toFixed(1));
    setLooping(true);
    if (videoRef.current) videoRef.current.currentTime = start + offset;
    setTime(start);
    setMessage(`${label ?? "AB 段"}循环已开启，点击播放开始练习。`);
  }
  async function toggleFullscreen() {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else if (
        frameRef.current?.requestFullscreen &&
        document.fullscreenEnabled
      )
        await frameRef.current.requestFullscreen();
      else
        setMessage(
          "此浏览器不支持包含控件与水印的网页全屏。请手动横放手机，继续使用页内跟练；未使用会丢失覆盖层的原生视频全屏。",
        );
    } catch {
      setMessage("全屏请求未被浏览器允许。请手动横放手机，继续在页面内跟练。");
    }
  }

  return (
    <div className="dance-player">
      <div className="player-heading">
        <div>
          <p className="eyebrow">DANCE PRACTICE / 教学播放器原型</p>
          <h2 id="video-title">把每个动作，慢慢看清楚</h2>
        </div>
        <div className="player-entry-actions">
          <button
            ref={immersiveTrigger}
            type="button"
            aria-haspopup="dialog"
            onClick={() => {
              setHidden(false);
              setImmersive(true);
            }}
          >
            沉浸跟练
          </button>
          <Link className="text-link" href={`/courses/${course.id}/questions`}>
            向老师提问（演示） →
          </Link>
        </div>
      </div>
      <p className="player-intro">
        暂无授权教学视频。三视角分别配置，默认背面；对镜拍摄与左右镜像是两种不同功能。
      </p>
      <div
        className={`player-frame ${hidden ? "controls-hidden" : ""} ${immersive ? "is-immersive" : ""}`}
        ref={frameRef}
        role={immersive ? "dialog" : "region"}
        aria-modal={immersive ? true : undefined}
        aria-label="舞蹈视频播放器"
        onKeyDown={(event) => {
          if (!immersive || event.key !== "Tab") return;
          const focusable = Array.from(
            frameRef.current?.querySelectorAll<HTMLElement>(
              "button:not(:disabled), input:not(:disabled), select:not(:disabled), summary, a[href]",
            ) ?? [],
          ).filter((element) => {
            const closedDetails = element.closest("details:not([open])");
            return (
              element.getClientRects().length > 0 &&
              (!closedDetails ||
                (element.tagName === "SUMMARY" &&
                  element.parentElement === closedDetails))
            );
          });
          const first = focusable[0],
            last = focusable[focusable.length - 1];
          if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last?.focus();
          } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first?.focus();
          }
        }}
        onPointerMove={() => {
          lastInteraction.current = Date.now();
        }}
        onKeyDownCapture={() => {
          keyboardInteraction.current = true;
        }}
        onPointerDownCapture={() => {
          keyboardInteraction.current = false;
          lastInteraction.current = Date.now();
        }}
      >
        <div className="player-viewbar">
          <div className="view-switch" role="group" aria-label="示范视角">
            {(["front", "back", "mirror"] as const).map((option) => (
              <button
                key={option}
                type="button"
                aria-pressed={view === option}
                onClick={() => switchView(option)}
              >
                {viewNames[option]}示范
                {!(locals[option] || technical || course.videos[option]) && (
                  <small> · 暂无素材</small>
                )}
              </button>
            ))}
          </div>
          <span className="mirror-badge">
            {mirrored ? "镜像已开启 · 左右翻转" : "原始画面 · 镜像关闭"}
          </span>
          {(immersive || fullscreen || hidden) && (
            <button
              type="button"
              className="quick-play"
              disabled={!ready}
              onClick={() => {
                if (playing) videoRef.current?.pause();
                else void play();
              }}
            >
              {playing ? "暂停跟练" : "开始跟练"}
            </button>
          )}
          {(immersive || fullscreen) && (
            <button
              type="button"
              className="quick-loop"
              disabled={!ready || !currentSegment}
              aria-pressed={looping}
              onClick={() => {
                if (looping) {
                  setLooping(false);
                  setMessage("循环已停止，继续正常播放。");
                } else if (currentSegment) {
                  setSegmentId(currentSegment.id);
                  activateLoop(
                    currentSegment.start,
                    currentSegment.end,
                    currentSegment.title,
                  );
                }
              }}
            >
              {looping ? "停止循环" : "本段循环"}
            </button>
          )}
          {(immersive || fullscreen) && (
            <button
              type="button"
              ref={immersiveExit}
              className="immersive-exit"
              onClick={() => {
                if (document.fullscreenElement)
                  void document
                    .exitFullscreen()
                    .catch(() => setMessage("请使用浏览器返回键退出全屏。"));
                setImmersive(false);
              }}
            >
              退出跟练
            </button>
          )}
        </div>
        <div className="player-stage" onPointerDown={() => setHidden(false)}>
          {source && (
            <video
              key={source.url + view}
              ref={videoRef}
              src={source.url}
              playsInline
              preload="metadata"
              aria-label={`${viewNames[view]}视频`}
              className={mirrored ? "is-mirrored" : ""}
              onLoadedMetadata={(event) => {
                const video = event.currentTarget;
                const length = video.duration - offset;
                if (Number.isFinite(length) && length > 0 && offset >= 0) {
                  setDuration(length);
                  video.playbackRate = speed;
                  const position = Math.min(
                    Math.max(pendingTime.current, 0),
                    Math.max(0, length - 0.1),
                  );
                  video.currentTime = position + offset;
                  setTime(position);
                  if (
                    looping &&
                    (!Number.isFinite(a) ||
                      !Number.isFinite(b) ||
                      pointA === "" ||
                      pointB === "" ||
                      a < 0 ||
                      b > length ||
                      b - a < 0.1)
                  ) {
                    setLooping(false);
                    setMessage(
                      "新视角时长不覆盖原循环，已停止循环；其他设置已保留。",
                    );
                  }
                  if (resumePlaying.current) {
                    resumePlaying.current = false;
                    void play();
                  }
                } else {
                  setFailed(true);
                  setLooping(false);
                  setMessage(
                    "此视频没有可用的有限时长或时间偏移不正确，请更换文件。",
                  );
                }
              }}
              onPlay={() => setPlaying(true)}
              onPause={() => {
                setPlaying(false);
                setHidden(false);
              }}
              onTimeUpdate={(event) => {
                const video = event.currentTarget;
                let position = Math.max(0, video.currentTime - offset);
                if (looping && validLoop && position >= b) {
                  video.currentTime = a + offset;
                  position = a;
                }
                setTime(position);
                pendingTime.current = position;
              }}
              onEnded={() => {
                if (looping && validLoop && videoRef.current) {
                  videoRef.current.currentTime = a + offset;
                  void play();
                } else setPlaying(false);
              }}
              onError={() => {
                setFailed(true);
                setPlaying(false);
                setLooping(false);
                setMessage(
                  "视频无法读取或格式不受支持，请更换素材；不会自动伪造另一视角。",
                );
              }}
            />
          )}
          {(!source || failed) && (
            <div className="player-empty">
              <span aria-hidden="true">▷</span>
              <h3>
                {failed
                  ? "这段视频暂时无法播放"
                  : `暂无${viewNames[view]}示范视频`}
              </h3>
              <p>
                {failed
                  ? "请重新选择支持的视频文件。"
                  : "对应视角没有素材，不会用镜像冒充真实对镜。"}
              </p>
              <button type="button" onClick={useTechnical}>
                加载技术测试片
              </button>
            </div>
          )}
          {source && (
            <>
              <span className="source-label">
                {locals[view]
                  ? "本地文件 · 时间轴仅作演示"
                  : technical
                    ? "原创技术测试图 · 非舞蹈教学"
                    : "课程素材"}
              </span>
              <DynamicWatermark session={session} time={time} />
              {(immersive || fullscreen) && (
                <span className="stage-mirror-status">
                  {mirrored ? "镜像已开启 · 左右翻转" : "原始画面 · 镜像关闭"}
                </span>
              )}
            </>
          )}
        </div>
        <div className="player-coach">
          <MusicCoach
            timeline={course.music}
            time={time}
            mode={mode}
            beatsPerBar={beatsPerBar}
            active={ready && !locals[view]}
          />
        </div>
        <button
          type="button"
          className="controls-toggle"
          aria-expanded={!hidden}
          aria-controls="dance-controls"
          onClick={() => setHidden((value) => !value)}
        >
          {hidden ? "显示播放控件" : "收起播放控件"}
        </button>
        <div id="dance-controls" className="player-controls" hidden={hidden}>
          <div className="player-progress">
            <label htmlFor="dance-progress">播放进度</label>
            <input
              id="dance-progress"
              aria-valuetext={`${clock(time)}，共 ${clock(duration)}`}
              type="range"
              min="0"
              max={duration || 1}
              step="0.1"
              value={ready ? Math.min(time, duration) : 0}
              disabled={!ready}
              onChange={(event) => seek(Number(event.target.value))}
            />
            <output htmlFor="dance-progress" aria-live="off">
              {clock(time)} / {clock(duration)}
            </output>
          </div>
          <div className="player-toolbar">
            <button
              className="play-button"
              type="button"
              disabled={!ready}
              onClick={() => {
                if (playing) videoRef.current?.pause();
                else void play();
              }}
            >
              {playing ? "暂停" : "播放"}
            </button>
            <label className="speed-control">
              倍速
              <select
                aria-label="倍速"
                value={speed}
                disabled={!ready}
                onChange={(event) => {
                  const value = Number(event.target.value);
                  setSpeed(value);
                  if (videoRef.current) videoRef.current.playbackRate = value;
                }}
              >
                {speeds.map((value) => (
                  <option key={value} value={value}>
                    {value}x
                  </option>
                ))}
              </select>
            </label>
            <button
              type="button"
              disabled={!ready}
              onClick={() => {
                setSpeed(0.75);
                if (videoRef.current) videoRef.current.playbackRate = 0.75;
              }}
            >
              慢速 0.75x
            </button>
            <button
              type="button"
              aria-pressed={mirrored}
              onClick={() => setMirrored((current) => !current)}
            >
              {mirrored ? "关闭镜像" : "开启镜像"}
            </button>
            <button
              type="button"
              disabled={!ready || !currentSegment}
              aria-pressed={looping}
              onClick={() => {
                if (looping) {
                  setLooping(false);
                  setMessage("循环已停止，继续正常播放。");
                } else if (currentSegment) {
                  setSegmentId(currentSegment.id);
                  activateLoop(
                    currentSegment.start,
                    currentSegment.end,
                    currentSegment.title,
                  );
                }
              }}
            >
              {looping ? "停止单段循环" : "单段循环"}
            </button>
            <button type="button" onClick={() => void toggleFullscreen()}>
              {fullscreen ? "退出全屏" : "全屏"}
            </button>
          </div>
          <div className="practice-modes" role="group" aria-label="练习模式">
            {(
              [
                ["teacher", "跟随老师"],
                ["music", "音乐跟练"],
                ["independent", "独立练习"],
              ] as const
            ).map(([value, label]) => (
              <button
                key={value}
                type="button"
                aria-pressed={mode === value}
                onClick={() => setMode(value)}
              >
                {label}
              </button>
            ))}
            <label>
              数拍方式
              <select
                aria-label="数拍方式"
                value={beatsPerBar}
                onChange={(event) =>
                  setBeatsPerBar(Number(event.target.value) as 4 | 8)
                }
              >
                <option value="4">四拍</option>
                <option value="8">八拍</option>
              </select>
            </label>
          </div>

          <details className="advanced-loop" open={!immersive && !fullscreen}>
            <summary>
              自定义 AB 循环 <span>{looping ? "循环中" : "未开启"}</span>
            </summary>
            <fieldset className="loop-controls" disabled={!ready}>
              <legend>
                AB 段循环 <span>{looping ? "· 循环中" : "· 未开启"}</span>
              </legend>
              <div className="loop-fields">
                <label>
                  A 起点（秒）
                  <input
                    type="number"
                    min="0"
                    max={duration || 0}
                    step="0.1"
                    value={pointA}
                    onChange={(event) => {
                      setPointA(event.target.value);
                      setLooping(false);
                    }}
                  />
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setPointA(
                      (
                        Math.floor(
                          ((videoRef.current?.currentTime ?? offset) - offset) *
                            10,
                        ) / 10
                      ).toFixed(1),
                    );
                    setLooping(false);
                  }}
                >
                  当前设为 A
                </button>
                <label>
                  B 终点（秒）
                  <input
                    type="number"
                    min="0"
                    max={duration || 0}
                    step="0.1"
                    value={pointB}
                    onChange={(event) => {
                      setPointB(event.target.value);
                      setLooping(false);
                    }}
                  />
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setPointB(
                      (
                        Math.floor(
                          ((videoRef.current?.currentTime ?? offset) - offset) *
                            10,
                        ) / 10
                      ).toFixed(1),
                    );
                    setLooping(false);
                  }}
                >
                  当前设为 B
                </button>
                <button type="button" onClick={() => activateLoop()}>
                  开启循环
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setLooping(false);
                    setPointA("");
                    setPointB("");
                    setMessage("AB 循环已取消，继续正常播放。");
                  }}
                >
                  取消循环
                </button>
              </div>
            </fieldset>
          </details>
          <p className="player-status" role="status">
            {message}
          </p>
          <p className="player-orientation">
            沉浸跟练不依赖浏览器全屏。请手动横放手机；不强制锁定方向。自动收起控件后可触摸画面或按“显示播放控件”恢复。水印仅作演示，可被移除，不具备生产追溯能力。
          </p>
        </div>
      </div>
      {storageFailed && (
        <p role="status" className="demo-notice">
          浏览器不允许本地存储，本次仍可练习，但进度不会保存。
        </p>
      )}
      <p className="player-intro">
        {locals[view]
          ? "当前为本地文件，未校准拍点，暂停显示演示数拍。"
          : technical
            ? "当前为24秒原创测试片与合成节拍，三份测试图不是舞蹈多机位。"
            : "可用下方本地文件体验播放；任意文件与演示数拍不保证匹配。"}{" "}
        全程仅本机处理，不上传视频。位置、速度、视角与模式保存在当前浏览器。
      </p>
      <section className="segment-section" aria-labelledby="segment-title">
        <h3 id="segment-title">教学段落 · 演示目录</h3>
        <p>
          当前：{currentSegment?.title ?? "尚未开始"}
          。测试片是压缩演示，不能代替正式热身或训练。
        </p>
        <div className="segment-grid">
          {course.segments.map((segment) => (
            <article
              className={segmentId === segment.id ? "selected-segment" : ""}
              key={segment.id}
            >
              <small>
                {clock(segment.start)}—{clock(segment.end)}
              </small>
              <h4>{segment.title}</h4>
              <p>{segment.instruction}</p>
              <p className="correction">注意：{segment.correction}</p>
              <button
                type="button"
                disabled={!ready}
                onClick={() => {
                  if (segment.end > duration) {
                    setMessage("当前素材未覆盖该段落，请更换视频。");
                    return;
                  }
                  setSegmentId(segment.id);
                  setLooping(false);
                  seek(segment.start);
                }}
              >
                观看本段
              </button>
              <button
                type="button"
                disabled={!ready}
                onClick={() => {
                  setSegmentId(segment.id);
                  activateLoop(segment.start, segment.end, segment.title);
                }}
              >
                循环本段
              </button>
            </article>
          ))}
        </div>
      </section>
      <details className="local-materials">
        <summary>本地素材与演示说明</summary>
        <p>
          三个视角分别选择文件；真实对镜拍摄不等同于 CSS
          左右翻转。文件不上传、不保存，刷新后需重新选择；本地时间轴起点默认0，正式课程需审核统一时间偏移。不支持字幕导入。
        </p>
        <div className="material-grid">
          {(["front", "back", "mirror"] as const).map((option) => (
            <label key={option}>
              {viewNames[option]}示范视频
              <input
                type="file"
                aria-label={`${viewNames[option]}示范视频`}
                accept="video/*,.mp4,.webm,.mov,.m4v,.ogv"
                onChange={(event) => {
                  chooseFile(event.target.files?.[0], option);
                  event.target.value = "";
                }}
              />
              <span>{locals[option]?.name ?? "未选择本地素材"}</span>
            </label>
          ))}
        </div>
        <button type="button" onClick={useTechnical}>
          加载技术测试片
        </button>
        <p>
          测试视频为项目自行合成的图形、计时与120
          BPM节拍，无舞蹈素材、教师或第三方音乐。生产水印、教师审核、AI分析和授权播放均未接入。
        </p>
      </details>
    </div>
  );
}
