"use client";
import { CardType } from "@/store";
import { errorModal } from "@/utils/confirm";
import { useEffect, useRef, useState } from "react";
import type ReactPlayerClass from "react-player";
import dynamic from "next/dynamic";
const ReactPlayer = dynamic(() => import("react-player/lazy"), {
  ssr: false,
}) as unknown as typeof ReactPlayerClass;

interface Type {
  setCurrentTime(value: number): void;
  cards: CardType[];
  quickCards: CardType[];
  videoLink: string | null;
  isSelected: number;
  isQuickCardSelected: number;
  progress: string;
  signal: boolean;
}

const PreviewVideo: React.FC<Type> = ({
  setCurrentTime,
  cards,
  quickCards,
  videoLink,
  isSelected,
  isQuickCardSelected,
  progress,
  signal,
}) => {
  const videoRef = useRef<ReactPlayerClass | null>(null);
  const maxTime = Number(process.env.NEXT_PUBLIC_MAX_TIME || 240);
  const [isReady, setIsReady] = useState<boolean>(false);
  const playingStartedRef = useRef<boolean>(false);
  const [playing, setPlaying] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (videoRef.current && progress === "cards" && !loading) {
      const toSecond = cards[isSelected].start;
      videoRef.current.seekTo(toSecond, "seconds");
      setPlaying(false);
      // videoRef.current.getInternalPlayer()?.pause();
    }
  }, [isSelected, progress,signal]);
  useEffect(() => {
    if (videoRef.current && progress === "quickCards" && !loading) {
      const toSecond = quickCards[isQuickCardSelected].start;
      videoRef.current.seekTo(toSecond, "seconds");
      setPlaying(false);
      // videoRef.current.getInternalPlayer()?.pause();
    }
  }, [isQuickCardSelected, progress]);

  // Go to first card start time
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
      }
    })();
  }, [isReady]);

  const onProgress = () => {
    if (!videoRef.current) return;
    const currentTime = Math.floor(videoRef.current.getCurrentTime());
    if (currentTime < maxTime) {
      setCurrentTime(currentTime);
    } else {
      videoRef.current?.seekTo(0, "seconds");
      setCurrentTime(0);
      // videoRef.current.getInternalPlayer()?.pause();
      setPlaying(false);
      errorModal("You can't see any further. The maximum time is 4 minutes.");
    }
  };
  const onSeek = () => {
    if (!videoRef.current) return;
    const currentTime = Math.floor(videoRef.current.getCurrentTime());
    if (currentTime > maxTime) {
      // videoRef.current?.seekTo(0, "seconds");
      // videoRef.current.getInternalPlayer().pause();
      setPlaying(false);
      errorModal(
        "You can't select any further. The maximum time is 4 minutes."
      );
    } else {
      setCurrentTime(currentTime);
    }
  };
  const onSeekEnd = () => {
    playingStartedRef.current = true;
  };

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
