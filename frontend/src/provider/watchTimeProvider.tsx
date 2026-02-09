"use client";
import useVideo from "@/hooks/useVideo";
import { videoIdAtom, watchTimeAtom } from "@/store";
import { useAtom } from "jotai";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

// 'use client'
const WatchTimeProvider = ({ children }: { children: React.ReactNode }) => {
  const { watchTime } = useVideo();
  const pathname = usePathname();
  const [watchingTime, setWatchingTime] = useAtom<number>(watchTimeAtom);
  const [videoId] = useAtom<string>(videoIdAtom);
  useEffect(() => {
    if (watchingTime > 0 && videoId) {
      watchTime(watchingTime, videoId);
      setWatchingTime(0);
    }
  }, [pathname]);
  return <>{children}</>;
};
export default WatchTimeProvider;
