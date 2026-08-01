import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Snack · 录音会议协作流程",
  description: "从录音转写、会议纪要到项目任务和会前简报的完整协作流程。",
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="zh-CN"><body>{children}</body></html>;
}
