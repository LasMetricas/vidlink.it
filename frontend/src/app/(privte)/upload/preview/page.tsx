"use client";
import dynamic from "next/dynamic";

const PreviewDesktop = dynamic(() => import("./_components/step4-preview"), { ssr: false });

const Page = () => {
  return <PreviewDesktop />;
};
export default Page;
