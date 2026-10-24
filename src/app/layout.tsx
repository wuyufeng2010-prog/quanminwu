import type { Metadata, Viewport } from "next";
import "./globals.css";
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};
export const metadata: Metadata = {
  title: { default: "全民舞 · 从容起舞，自在生长", template: "%s · 全民舞" },
  description:
    "面向18—65岁成人的舞蹈学习平台原型，探索中国古典舞、民族民间舞、体态拉伸与音乐节奏。当前内容均为演示。",
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
