"use client";
import { useState, useSyncExternalStore } from "react";
import type { Course, Question } from "@/lib/learning-types";
import { questionKey, readQuestions } from "@/lib/learning-storage";
const subscribe = () => () => {};
export default function QuestionDemo({ course }: { course: Course }) {
  const client = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
  return client ? (
    <QuestionForm course={course} />
  ) : (
    <p>正在读取本机演示问题……</p>
  );
}
function QuestionForm({ course }: { course: Course }) {
  const [questions, setQuestions] = useState(() => readQuestions(course.id));
  const [text, setText] = useState("");
  const [videoName, setVideoName] = useState<string | null>(null);
  const [message, setMessage] = useState(
    "问题仅保存在本机浏览器，真实教师不会收到。请勿填写隐私或敏感信息。",
  );
  function persist(next: Question[]) {
    setQuestions(next);
    try {
      localStorage.setItem(questionKey(course.id), JSON.stringify(next));
      return true;
    } catch {
      setMessage("浏览器无法保存，问题仅在当前页面暂存；没有上传到后台。");
      return false;
    }
  }
  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!text.trim()) {
      setMessage("请先填写本节课的问题。");
      return;
    }
    const question: Question = {
      id: `local-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      courseId: course.id,
      text: text.trim(),
      localVideoName: videoName,
      createdAt: new Date().toISOString(),
      status: "local-demo",
      feedback: null,
    };
    const saved = persist([question, ...questions].slice(0, 20));
    setText("");
    setVideoName(null);
    event.currentTarget.reset();
    if (saved)
      setMessage(
        "已添加到本机演示问题列表；没有上传视频，没有真实教师接收。最多保留最近20条。",
      );
  }
  function showFeedback(id: string) {
    const saved = persist(
      questions.map((question) =>
        question.id !== id
          ? question
          : {
              ...question,
              feedback: {
                kind: "sample",
                text: "示例反馈：先降低练习速度，按本节段落观察手位、步伐和身体方向。此文本为固定演示，不是教师对您动作的判断。",
                reviewTask:
                  "复习任务示例：回到课程播放器，用0.75倍速查看分段，再按身体感受决定是否练习。",
              },
            },
      ),
    );
    if (saved)
      setMessage("已展开固定示例反馈，没有联系教师，也没有分析您的视频。");
  }
  return (
    <div className="question-demo">
      <div className="demo-notice">
        <strong>演示功能，未连接教师后台</strong>
        <p>
          选择练习视频仅显示文件名，不读取或上传内容。问题和文件名会保存在本机浏览器，您可随时删除；不提供账号隔离或生产隐私保护。
        </p>
      </div>
      <form onSubmit={submit} className="question-form">
        <h2>描述本节课的问题</h2>
        <label htmlFor="question-text">
          想请教什么？
          <textarea
            id="question-text"
            value={text}
            onChange={(event) => setText(event.target.value)}
            required
            maxLength={2000}
            rows={5}
            placeholder="例如：八拍移步时，我该怎样理解重心变化？"
          />
        </label>
        <label htmlFor="practice-video">
          练习视频（只选文件名，不上传）
          <input
            id="practice-video"
            type="file"
            accept="video/*"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (!file) {
                setVideoName(null);
                return;
              }
              if (
                !file.type.startsWith("video/") ||
                file.size > 50 * 1024 * 1024
              ) {
                setVideoName(null);
                event.target.value = "";
                setMessage(
                  "演示选择只接受不超过50MB的视频文件；生产上传尚未实现。",
                );
                return;
              }
              setVideoName(file.name);
              setMessage("已记录文件名，视频未上传，教师无法查看。");
            }}
          />
        </label>
        <p className="form-help">
          {videoName
            ? `已选择：${videoName}（未上传）`
            : "未选择文件也可以添加问题。"}
        </p>
        <button type="submit" className="button primary">
          添加到本机演示列表
        </button>
      </form>
      <p role="status" className="form-status">
        {message}
      </p>
      <section className="question-list">
        <h2>本节课的问题与示例反馈</h2>
        {questions.length === 0 ? (
          <p>还没有本机演示问题。真实一对一服务尚未开放。</p>
        ) : (
          questions.map((question) => (
            <article key={question.id}>
              <span className="sample-label">本机演示 · 非真实提交</span>
              <h3>我的问题</h3>
              <p className="question-text">{question.text}</p>
              <small>
                关联课程：{course.title} ·{" "}
                {new Date(question.createdAt).toLocaleString("zh-CN")}
              </small>
              {question.localVideoName && (
                <p>所选文件：{question.localVideoName}（未上传）</p>
              )}
              <div className="detail-actions">
                <button type="button" onClick={() => showFeedback(question.id)}>
                  查看示例教师反馈
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (
                      persist(
                        questions.filter((item) => item.id !== question.id),
                      )
                    )
                      setMessage("该问题已从本机演示列表删除。");
                  }}
                >
                  删除本机问题
                </button>
              </div>
              {question.feedback && (
                <div className="sample-feedback">
                  <h4>示例反馈 · 非真实教师回复</h4>
                  <p>{question.feedback.text}</p>
                  <p>{question.feedback.reviewTask}</p>
                </div>
              )}
            </article>
          ))
        )}
      </section>
    </div>
  );
}
