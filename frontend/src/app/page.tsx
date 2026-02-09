"use client";
import { isMobile } from "react-device-detect";
import dynamic from "next/dynamic";
const HomeDesktop = dynamic(() => import("@/app/_components/root/desktop"));
const HomeMobile = dynamic(() => import("@/app/_components/root/mobile"));

export default function Page() {
  return <>{isMobile ? <HomeMobile /> : <HomeDesktop />}</>;
}
