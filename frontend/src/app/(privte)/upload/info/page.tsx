"use client";
import dynamic from "next/dynamic";
import { isMobile } from "react-device-detect";

const InfoDesktop = dynamic(() => import("./_components/step2-info"), { ssr: false });
// const InfoMobile = dynamic(() => import("./_components/mobile"), { ssr: false });

const Page = () => {
  // For now, use desktop version for both
  return <InfoDesktop />;
};
export default Page;
