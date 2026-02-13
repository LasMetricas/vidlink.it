"use client";
import dynamic from "next/dynamic";
import { isMobile } from "react-device-detect";

const UploadDesktop = dynamic(() => import("./_components/step1-upload"), { ssr: false });
const UploadMobile = dynamic(() => import("./_components/mobile"), { ssr: false });

const Page = () => {
  return <>{isMobile ? <UploadMobile /> : <UploadDesktop />}</>;
};
export default Page;
