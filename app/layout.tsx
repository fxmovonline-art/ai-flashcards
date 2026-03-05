import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI Conversation Flashcard Builder",
  description: "Transform your conversations into interactive flashcards with AI.",
};

import Header from "@/components/Header";
import { HistoryProvider } from "@/components/HistoryProvider";
import SidebarWrapper from "../components/SidebarWrapper";

import { AuthProvider } from "@/components/AuthProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-slate-50 dark:bg-slate-950`}
      >
        <AuthProvider>
          <HistoryProvider>
            <Header />
            <div className="flex">
              <aside className="hidden lg:block">
                <SidebarWrapper />
              </aside>
              <main className="flex-1 w-full lg:pl-72 py-12 px-6">
                <div className="max-w-5xl mx-auto">
                  {children}
                </div>
              </main>
            </div>
          </HistoryProvider>
        </AuthProvider>
        
        <footer className="border-t border-slate-200 dark:border-slate-800 py-12 bg-white dark:bg-slate-900 lg:pl-72">
           <div className="container mx-auto px-6 text-center text-slate-500 text-sm">
             &copy; 2026 FlashAI Builder. Powered by Advanced AI.
           </div>
        </footer>
      </body>
    </html>
  );
}
