import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import "./globals.css";
import ThemeProvider from "@/provider/themeProvider";
import JotaiProvider from "@/provider/jotaiProvider";
import SessionProvider from "@/provider/sessionProvider";
import { ToastContainer } from "react-toastify";
import HeaderProvider from "./_components/layout/common/headerProvider";
import WatchTimeProvider from "@/provider/watchTimeProvider";
import SmoothScroll from "./_components/ui/smoothScroll";
import ErrorBoundary from "@/app/_components/layout/common/ErrorBoundary";
import GlobalErrorHandler from "@/app/_components/layout/common/GlobalErrorHandler";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Vidlink",
  description: "VIDLINK is an innovative platform that allows users to upload videos and add interactive tags at key moments. This feature lets creators link products, information, or relevant websites directly from the video, enhancing viewer engagement.",
  manifest: "/manifest.json",
  // manifest: "/site.webmanifest",
  icons: {
    icon: "/favicon.ico", // Default favicon
    shortcut: "/favicon.ico", // Shortcut icon
    apple: "/android-chrome-192x192.png", // Apple touch icon (optional)
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="shortcut icon" href="/favicon.ico" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased font-sans`}
      >
        <ErrorBoundary>
          <GlobalErrorHandler />
          <JotaiProvider>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
              <HeaderProvider>
                <SessionProvider>
                  <WatchTimeProvider>
                    <SmoothScroll />
                    {children}
                  </WatchTimeProvider>
                </SessionProvider>
              </HeaderProvider>
            </ThemeProvider>
          </JotaiProvider>
        </ErrorBoundary>
        <ToastContainer />
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID || ""} />
      </body>
    </html>
  );
}
