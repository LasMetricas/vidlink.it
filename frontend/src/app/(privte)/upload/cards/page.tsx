"use client";
import dynamic from "next/dynamic";

const CardsDesktop = dynamic(() => import("./_components/step3-cards"), { ssr: false });

const Page = () => {
  return <CardsDesktop />;
};
export default Page;
