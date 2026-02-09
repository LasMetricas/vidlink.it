"use client";
import useVideo from "@/hooks/useVideo";
import { CardType, watchTimeAtom } from "@/store";
import { errorModal } from "@/utils/confirm";
import { useAtom } from "jotai";
import { useEffect, useRef, useState } from "react";
import { useBeforeUnload } from "react-use";
import type ReactPlayerClass from "react-player";
import dynamic from "next/dynamic";
const ReactPlayer = dynamic(() => import("react-player/lazy"), {
  ssr: false,
}) as unknown as typeof ReactPlayerClass;

interface Type {
  setCurrentTime(value: number): void;
  cards: CardType[];
  videoLink: string | null;
  isSelected: number;
  signal: boolean;
  videoId: string;
}

const PreviewVideo: React.FC<Type> = ({
  setCurrentTime,
  cards,
  videoLink,
  isSelected,
  signal,
  videoId,
}) => {
  const { watchTime } = useVideo();
  const videoRef = useRef<ReactPlayerClass | null>(null);
  const maxTime = Number(process.env.NEXT_PUBLIC_MAX_TIME || 240);
  const [isReady, setIsReady] = useState<boolean>(false);
  const [watchingTime, setWatchingTime] = useAtom<number>(watchTimeAtom);
  const [lastTime, setLastTime] = useState<number>(0);
  const [isSeeking, setIsSeeking] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const [playing, setPlaying] = useState<boolean>(false);
  const playingStartedRef = useRef<boolean>(false);

  // Go to selected card start time
  useEffect(() => {
    if (videoRef.current && isReady && !loading) {
      const toSecond = cards[isSelected].start;
      videoRef.current.seekTo(toSecond, "seconds");
      // const internalPlayer = videoRef.current.getInternalPlayer();
      // if (internalPlayer && typeof internalPlayer.pause === "function") {
      //   internalPlayer.pause();
      // }
      setPlaying(false);
    }
  }, [isSelected, signal]);

  // go to the first card start time.
  useEffect(() => {
    (async () => {
      if (isReady && videoRef.current) {
        console.log("started");
        setPlaying(true);
        console.log(playingStartedRef.current, "playingStartedRef.current");
        const start = Date.now();
        while (!playingStartedRef.current && Date.now() - start < 12000) {
          console.log("repeat");
          await new Promise((resolve) => setTimeout(resolve, 100));
        }
        console.log("ended");
        console.log(playingStartedRef.current, "playingStartedRef.current");
        setPlaying(false);
        // const internalPlayer = videoRef.current.getInternalPlayer();
        // if (internalPlayer && typeof internalPlayer.pause === "function") {
        //   internalPlayer.pause();
        // }
        await new Promise((resolve) => setTimeout(resolve, 300));
        videoRef.current?.seekTo(cards[0].start, "seconds");
        setLoading(false);
        setWatchingTime(0);
        setLastTime(cards[0].start);
      }
    })();
  }, [isReady]);

  const onProgress = () => {
    if (!videoRef.current) return;
    const currentTime = Math.floor(videoRef.current.getCurrentTime());
    if (currentTime < maxTime) {
      // Track watch time
      if (currentTime > lastTime && !isSeeking) {
        setWatchingTime((prev) => prev + (currentTime - lastTime));
      }
      setLastTime(currentTime);
      setCurrentTime(currentTime);
    } else {
      videoRef.current?.seekTo(0, "seconds");
      setCurrentTime(0);
      // const internalPlayer = videoRef.current?.getInternalPlayer();
      // if (internalPlayer && typeof internalPlayer.pause === "function") {
      //   internalPlayer.pause();
      // }
      setPlaying(false);
      errorModal("You can't see any further. The maximum time is 4 minutes.");
    }
  };
  const onSeek = () => {
    if (!videoRef.current) return;
    const currentTime = Math.floor(videoRef.current.getCurrentTime());
    if (currentTime > maxTime) {
      // videoRef.current?.seekTo(0, "seconds");
      // const internalPlayer = videoRef.current.getInternalPlayer();
      // if (internalPlayer && typeof internalPlayer.pause === "function") {
      //   internalPlayer.pause();
      // }
      setPlaying(false);
      errorModal(
        "You can't select any further. The maximum time is 4 minutes."
      );
    } else {
      setLastTime(currentTime);
      setCurrentTime(currentTime);
      if (watchingTime) {
        setIsSeeking(true);
      }
    }
  };
  const onSeekEnd = () => {
    playingStartedRef.current = true;
    setIsSeeking(false);
  };

  const handleWatchTime = async () => {
    if (!videoId || !watchingTime) return;
    watchTime(watchingTime, videoId); // Required function
  };
  // Detect page close/refresh/navigation
  useBeforeUnload(() => {
    handleWatchTime();
    setWatchingTime(0);
    return true;
  });

  return (
    <>
      {videoLink ? (
        <div className="h-[575px] w-full rounded-[7.36px] overflow-hidden relative">
          <ReactPlayer
            ref={videoRef}
            url={videoLink}
            progressInterval={100}
            onSeek={onSeek}
            onProgress={onProgress}
            controls
            playing={playing}
            width="100%"
            height="100%"
            onReady={() => {
              setIsReady(true);
            }}
            onPause={onSeekEnd}
            onPlay={onSeekEnd}
            onStart={() => {
              playingStartedRef.current = true;
            }}
            config={{
              file: {
                attributes: {
                  playsInline: true,
                  style: {
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  },
                },
              },
            }}
          />
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black">
              <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </div>
      ) : (
        <div className="h-[225.42px] flex items-center justify-center">
          No video file.
        </div>
      )}
    </>
  );
};
export default PreviewVideo;
