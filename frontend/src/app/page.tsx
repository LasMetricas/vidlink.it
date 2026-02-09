"use client";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";

const HomeDesktop = dynamic(() => import("@/app/_components/root/desktop"), { ssr: false });
const HomeMobile = dynamic(() => import("@/app/_components/root/mobile"), { ssr: false });

export default function Page() {
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Show loading while detecting device
  if (isMobile === null) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-black">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue"></div>
      </div>
    );
  }

  return <>{isMobile ? <HomeMobile /> : <HomeDesktop />}</>;
}
