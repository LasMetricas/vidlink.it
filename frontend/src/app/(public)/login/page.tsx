'use client'
import { isMobile } from "react-device-detect";
import dynamic from "next/dynamic";
const LoginDesktop = dynamic(() => import("./_components/desktop"));
const LoginMobile = dynamic(() => import("./_components/mobile"));

const Page = () => {
  return <>{isMobile ? <LoginMobile /> : <LoginDesktop />}</>;
};
export default Page;
