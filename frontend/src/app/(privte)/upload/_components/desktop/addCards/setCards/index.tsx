"use client";
import { ChangeEvent, useEffect, useRef, useState } from "react";
// import lucideIcons from "@/../public/lucideIcon.json";
// import SetIcon from "./setIcon";
import * as LucideIcons from "lucide-react";
// import useClickOutside from "@/hooks/useClickOutside";
import type ReactPlayerClass from "react-player";
import dynamic from "next/dynamic";
const ReactPlayer = dynamic(() => import("react-player/lazy"), {
  ssr: false,
}) as unknown as typeof ReactPlayerClass;
import PreviewCard from "./previewCard";
import { cardAtom, CardType } from "@/store";
import { useAtom } from "jotai";
import { errorModal } from "@/utils/confirm";

interface Type {
  addCard(): void;
  setLink(value: string): void;
  setName(value: string): void;
  // setIcon(value: string): void;
  setStart(value: number): void;
  setIsSaved(value: boolean): void;
  link: string;
  name: string;
  start: number;
  // icon: string;
  isSaved: boolean;
  videoLink: string | null;
}

const Index: React.FC<Type> = ({
  addCard,
  setLink,
  setName,
  setStart,
  setIsSaved,
  // icon,
  link,
  name,
  start,
  isSaved,
  videoLink,
}) => {
  // const listRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<ReactPlayerClass | null>(null);
  // const [iconSearch, setIconSearch] = useState<string>("");
  const [startTxt, setStartTxt] = useState<string>("00:00");
  const [caution, setCaution] = useState<string>("");
  const [cards] = useAtom<CardType[]>(cardAtom);
  const maxTime = Number(process.env.NEXT_PUBLIC_MAX_TIME || 240);
  const playingStartedRef = useRef<boolean>(false);
  const [loading, setLoading] = useState(true);
  const [isReady, setIsReady] = useState<boolean>(false);
  const [playing, setPlaying] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      if (isReady && videoRef.current) {
        setPlaying(true);
        const start = Date.now();
        while (!playingStartedRef.current && Date.now() - start < 12000) {
          await new Promise((resolve) => setTimeout(resolve, 100));
        }
        setPlaying(false);
        const internalPlayer = videoRef.current.getInternalPlayer();
        if (internalPlayer && typeof internalPlayer.pause === "function") {
          internalPlayer.pause();
        }
        await new Promise((resolve) => setTimeout(resolve, 300));
        setLoading(false);
      }
    })();
  }, [isReady]);

  //video time capture
  const onProgress = () => {
    if (!videoRef.current) return;
    const currentTime = Math.floor(videoRef.current.getCurrentTime());
    if (currentTime > maxTime) {
      videoRef.current?.seekTo(maxTime, "seconds");
      // videoRef.current?.getInternalPlayer().pause();
      setPlaying(false)
      setStart(maxTime);
      errorModal("You can't see any further. The maximum time is 4 minutes.");
    } else {
      setStart(currentTime);
    }
  };

  const onSeek = () => {
    if (!videoRef.current || loading) return;
    const currentTime = Math.floor(videoRef.current.getCurrentTime());
    if (currentTime > maxTime) {
      // videoRef.current?.seekTo(maxTime, "seconds");
      // videoRef.current?.getInternalPlayer().pause();
      setPlaying(false)
      setStart(maxTime);
      errorModal(
        "You can't select any further. The maximum time is 4 minutes."
      );
    } else {
      setStart(currentTime);
    }
  };

  //auto paste
  const handleAutoPaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setLink(text); // Automatically paste clipboard content into input
    } catch (error) {
      console.error("Failed to read clipboard:", error);
    }
  };

  const handleName = (e: ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    if (name.length > 35) {
      errorModal("You can't add more. Maximum letter is 35.");
    } else {
      setName(name);
    }
  };

  useEffect(() => {
    setStartTxt(
      `${
        Math.floor(start / 60) < 10
          ? `0${Math.floor(start / 60)}`
          : Math.floor(start / 60)
      }:${start % 60 < 10 ? `0${start % 60}` : start % 60}`
    );
    setCaution("");
    // if (!videoRef.current || loading) return;
    // videoRef.current.seekTo(start, "seconds");
  }, [start]);

  const handleStartTxt = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim();
    const parts = value.split(":");

    if (parts.length !== 2 || !parts[0] || !parts[1]) {
      setCaution(
        'You must enter the start time in the correct format like "00:00".'
      );
    } else {
      const minute = Number(parts[0].trim());
      const seconds = Number(parts[1].trim());

      if (isNaN(minute) || isNaN(seconds) || minute > 59 || seconds > 59) {
        setCaution("You must enter valid numbers for minutes and seconds.");
      } else {
        if (!videoRef.current) return;
        const duration = videoRef.current.getDuration();
        const totalSeconds = minute * 60 + seconds;

        if (totalSeconds > maxTime) {
          setCaution(
            "You can't select any further. The maximum time is 4 minutes."
          );
        } else if (totalSeconds > duration) {
          setCaution(
            `You can't select any further. The video length is limited to ${Math.floor(
              duration
            )} seconds.`
          );
        } else {
          setCaution("");
          videoRef.current.seekTo(totalSeconds, "seconds");
        }
      }
    }

    setStartTxt(value);
  };

  return (
    <>
      <div className="mt-[68px] text-white text-[18px] font-semibold">
        <h1 className="text-[40px] font-bold tracking-[2px] mb-[74px]">
          2. SET CARDS
        </h1>

        <div className="flex flex-col lg:flex-row gap-[56px]">
          {/* LEFT SIDE - CARD FORM */}
          <div className="flex-1 flex flex-col gap-5">
            {/* CARD NAME */}
            <div>
              <label className="block mb-[18px]">CARD NAME *</label>
              <input
                value={name}
                onChange={handleName}
                type="text"
                placeholder="LOCATION"
                className="w-full h-[41px] font-normal bg-[#1E1E1E] border-[2.72px] border-[#505050] rounded-[10px] px-3 text-[16px] italic placeholder:text-[#505050]"
              />
            </div>

            {/* LINK FIELD */}
            <div>
              <div className="flex items-center mb-[18px] gap-2">
                <label>LINK *</label>
                <button onClick={handleAutoPaste} className="text-blue-400">
                  <LucideIcons.Link className="size-3" />
                </button>
              </div>
              <input
                value={link.trim().toLowerCase()}
                onChange={(e) => setLink(e.target.value)}
                type="url"
                placeholder="https://www.website.com"
                className="w-full h-[40px] bg-[#1E1E1E] font-normal border-[2.72px] border-[#505050] rounded-[10px] px-3 text-[16px] italic placeholder:text-[#505050]"
              />
            </div>

            {/* START TIME FIELD */}
            <div>
              <label className="block mb-[18px]">MINUTE CARD APPEAR *</label>
              <input
                value={startTxt}
                onChange={handleStartTxt}
                placeholder="00:00"
                className="w-[120px] h-[40px] bg-[#1E1E1E] font-normal border-[2.72px] border-[#505050] rounded-[10px] px-2 text-[16px] italic"
              />
              {caution && (
                <p className="text-[16px] text-red-500 mt-1">{caution}</p>
              )}
            </div>
            <div className="flex justify-between items-end">
              {/* SAVE BUTTON */}
              <button
                onClick={addCard}
                className="mt-2 h-[40px] w-[355px] px-4 bg-[#1A1A1A] border-2 border-white rounded-lg flex items-center justify-center gap-2 text-white text-[28px] font-bold hover:bg-[gray] transition"
              >
                <img src="/icon/desktop/upload/checkfat.png" alt="" />
                SAVE & NEXT CARD
              </button>
              <LucideIcons.ArrowBigRight className=" fill-foreground size-8" />
              {/* CARD PREVIEW */}
              <div>
                <label className="text-[13px]">
                  CARD PREVIEW{" "}
                  <span className="text-xs text-gray-400">({startTxt})</span>
                </label>
                <PreviewCard
                  name={name}
                  start={start}
                  no={cards.length + 1}
                  isSaved={isSaved}
                  link={link}
                  setIsSaved={setIsSaved}
                />
              </div>
            </div>
          </div>
          {/* RIGHT SIDE - VIDEO PREVIEW */}
          <div className="w-full lg:w-[529px] flex flex-col gap-4">
            {/* FRAME PREVIEW */}
            <div>
              <label className="text-[18px]">
                FRAME PREVIEW
                <span className="text-xs text-gray-400">({startTxt})</span>
              </label>
              {videoLink ? (
                <div className="mt-[18px] h-[391px] overflow-hidden rounded-[8px]">
                  <ReactPlayer
                    ref={videoRef}
                    url={videoLink}
                    preload="auto"
                    controls
                    playing={playing}
                    onProgress={onProgress}
                    onSeek={onSeek}
                    progressInterval={1000}
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
                <div className="w-full h-full flex items-center justify-center bg-black text-gray-400">
                  No video file.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Index;
