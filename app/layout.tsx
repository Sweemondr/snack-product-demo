import type { Metadata } from "next";
import "./globals.css";
import "./product-pages.css";

export const metadata: Metadata = {
  title: "Snack · 产品全景协作 Demo",
  description: "Snack 当前产品页面与从录音转写到项目跟踪的完整协作流程。",
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
  openGraph: {
    title: "Snack · 产品全景协作 Demo",
    description: "从对话到交付，让工作持续推进。",
    images: ["https://snack-recording-flow-0801.sweemond.chatgpt.site/og.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Snack · 产品全景协作 Demo",
    description: "从对话到交付，让工作持续推进。",
    images: ["https://snack-recording-flow-0801.sweemond.chatgpt.site/og.png"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="zh-CN"><body>{children}</body></html>;
}
