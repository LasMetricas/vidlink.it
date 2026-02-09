"use client";
import dynamic from "next/dynamic";
import { isMobile } from "react-device-detect";
const UploadDesktop = dynamic(() => import("./_components/desktop"));
const UploadMobile = dynamic(() => import("./_components/mobile"));

const Page = () => {
  return <>{isMobile ? <UploadMobile /> : <UploadDesktop />}</>;
};
export default Page;
