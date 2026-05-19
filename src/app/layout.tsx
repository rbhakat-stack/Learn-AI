import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/layout/theme-provider";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap"
});
const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap"
});

export const metadata: Metadata = {
  title: {
    default: "Agentic AI Lab — Learn, design, and build the agent stack",
    template: "%s · Agentic AI Lab"
  },
  description:
    "An interactive platform for AI architects, engineers, and product leaders to discover agentic AI tools, design workflows, and ship production-ready proofs of concept.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"),
  keywords: [
    "agentic ai",
    "ai agents",
    "multi-agent systems",
    "langgraph",
    "crewai",
    "mcp",
    "rag",
    "ai architecture",
    "enterprise ai"
  ]
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${mono.variable}`}>
      <body>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
