"use client";
import dynamic from "next/dynamic";
import Loading from "@/app/_components/ui/loading";

const WatchContent = dynamic(() => import("./WatchContent"), {
  ssr: false,
  loading: () => <Loading />,
});

export default function WatchPage() {
  return <WatchContent />;
}
