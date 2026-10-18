"use client";
import Link from "next/link";
import { useState, useSyncExternalStore } from "react";
import { courses } from "@/data/courses";
import { progressKey, readProgress } from "@/lib/learning-storage";
const subscribe = () => () => {};
export default function ProgressDemo() {
  const client = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
  return client ? <LocalProgress /> : <p>正在读取本机进度……</p>;
}
function LocalProgress() {
  const [items, setItems] = useState(() =>
    courses.flatMap((course) => {
      const saved = readProgress(course.id);
      return saved ? [{ course, saved }] : [];
    }),
  );
  const [message, setMessage] = useState(
    "仅此浏览器保存，不会跨设备同步；这些记录不代表课程完成或学习评价。",
  );
  return (
    <>
      <p className="demo-notice" role="status">
        {message}
      </p>
      {items.length === 0 ? (
        <div className="catalog-card">
          <h2>还没有本机学习记录</h2>
          <p>进入课程播放器，设置视角、速度或播放测试片后，可在此继续。</p>
          <Link className="text-link" href="/learn">
            去探索课程 →
          </Link>
        </div>
      ) : (
        <div className="course-grid">
          {items.map(({ course, saved }) => (
            <article className="catalog-card" key={course.id}>
              <span className="sample-label">
                {saved.technical ? "技术测试片记录" : "播放器设置记录"} ·
                本机演示
              </span>
              <h2>{course.title}</h2>
              <p>
                已观看位置：{saved.time.toFixed(1)} 秒 · 倍速 {saved.speed}x
              </p>
              <p>
                视角：
                {{ front: "正面", back: "背面", mirror: "对镜" }[saved.view]} ·
                模式：
                {
                  {
                    teacher: "跟随老师",
                    music: "音乐跟练",
                    independent: "独立练习",
                  }[saved.mode]
                }
              </p>
              <Link
                className="button primary"
                href={`/courses/${course.id}/player`}
              >
                继续上次位置
              </Link>
              <button
                type="button"
                onClick={() => {
                  try {
                    localStorage.removeItem(progressKey(course.id));
                    setItems(
                      items.filter((item) => item.course.id !== course.id),
                    );
                    setMessage("该课程的本机进度已删除。");
                  } catch {
                    setMessage("浏览器不允许修改本地存储，无法删除记录。");
                  }
                }}
              >
                清除此课程记录
              </button>
            </article>
          ))}
        </div>
      )}
    </>
  );
}
