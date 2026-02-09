"use client";
import { CardType } from "@/store";
import { errorModal } from "@/utils/confirm";
import { setItem } from "@/utils/localstorage";
import { useEffect, useRef, useState } from "react";
import type ReactPlayerClass from "react-player";
import dynamic from "next/dynamic";
const ReactPlayer = dynamic(() => import("react-player/lazy"), {
  ssr: false,
}) as unknown as typeof ReactPlayerClass;

interface Type {
  setCurrentTime(value: number): void;
  setEdit(value: string): void;
  cards: CardType[];
  videoLink: string | null;
  isSelected: number;
  signal: boolean;
  info: string;
  title: string;
}

const PreviewVideo: React.FC<Type> = ({
  setCurrentTime,
  setEdit,
  cards,
  videoLink,
  isSelected,
  signal,
  info,
  title,
}) => {
  const videoRef = useRef<ReactPlayerClass | null>(null);
  const maxTime = Number(process.env.NEXT_PUBLIC_MAX_TIME || 240);
  const [isReady, setIsReady] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const [playing, setPlaying] = useState<boolean>(false);
  const playingStartedRef = useRef<boolean>(false);

  // Go to selected card start time
  useEffect(() => {
    if (videoRef.current && !loading) {
      const toSecond = cards[isSelected].start;
      videoRef.current.seekTo(toSecond, "seconds");
      setPlaying(false);
      // videoRef.current.getInternalPlayer()?.pause();
    }
  }, [isSelected, signal]);

  // go to the first card start time.
  useEffect(() => {
    (async () => {
      if (isReady && videoRef.current) {
        setPlaying(true);
        const start = Date.now();
        while (!playingStartedRef.current && Date.now() - start < 12000) {
          await new Promise((resolve) => setTimeout(resolve, 100));
        }
        setPlaying(false);
        // const internalPlayer = videoRef.current.getInternalPlayer();
        // if (internalPlayer && typeof internalPlayer.pause === "function") {
        //   internalPlayer.pause();
        // }
        await new Promise((resolve) => setTimeout(resolve, 300));
        videoRef.current?.seekTo(cards[0].start || 0, "seconds");
        setLoading(false);
      }
    })();
  }, [isReady]);

  const onProgress = () => {
    if (!videoRef.current) return;
    const currentTime = Math.floor(videoRef.current.getCurrentTime());
    if (currentTime > maxTime) {
      videoRef.current?.seekTo(0, "seconds");
      // videoRef.current.getInternalPlayer()?.pause();
      setPlaying(false);
      errorModal("You can't see any further. The maximum time is 4 minutes.");
    } else {
      setCurrentTime(currentTime);
    }
  };
  const onSeek = () => {
    if (!videoRef.current || loading) return;
    const currentTime = Math.floor(videoRef.current.getCurrentTime());
    if (currentTime > maxTime) {
      videoRef.current?.seekTo(0, "seconds");
      // videoRef.current.getInternalPlayer()?.pause();
      setPlaying(false);
      errorModal(
        "You can't select any further. The maximum time is 4 minutes."
      );
    } else {
      setCurrentTime(currentTime);
    }
  };

  return (
    <>
      {/* title */}
      <h1 className="text-[9px] mb-[25px]">PREVIEW</h1>
      <div className="flex justify-between items-center px-[15px] w-full pb-[10px]">
        <h1 className="text-[14px] font-normal uppercase">
          <span className="text-blue">{title.toUpperCase()}</span>
          {info ? <span className="text-foreground"> - {info}</span> : null}
        </h1>
      </div>
      {videoLink ? (
        <div className="h-[225.42px] w-full rounded-[7.36px] overflow-hidden relative">
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

      {/* detail */}
      <div className="h-[72.58px] w-full relative flex items-center justify-center">
        {/* <div className="absolute left-[11px] top-[10.6px] flex gap-[12px]"> */}
        <div className=" absolute left-1/2 -translate-x-1/2 top-[10.6px] flex gap-[12px]">
          <div className="flex flex-col items-center gap-[5px]">
            <h1 className="text-[8px] font-semibold">CARDS</h1>
            <button className="border-[1.43px] w-[43px] h-[34px] rounded-[4.76px] text-center">
              {cards.length < 10 ? `0${cards.length}` : cards.length}
            </button>
          </div>
          <div className="flex flex-col items-center gap-[5px]">
            <h1 className="text-[8px] font-semibold">ADD MORE</h1>
            <button
              onClick={() => {
                setEdit("add");
                setItem("editStatus", "add");
              }}
              className="border-[1.43px] w-[43px] h-[34px] rounded-[4.76px] flex justify-center items-center"
            >
              <img src="/icon/detail/card/plus.svg" alt="" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
export default PreviewVideo;
