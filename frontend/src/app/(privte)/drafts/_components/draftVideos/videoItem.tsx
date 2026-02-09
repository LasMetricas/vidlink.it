"use client";
import { Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import ReactPlayer from "react-player";
import { formatDuration } from "@/utils/calculateBigNum";
import { confirmModal } from "@/utils/confirm";

interface Type {
  handleDeleteVideo(value: string): void;
  src: string;
  videoId: string;
  title: string;
  duration: number;
  info: string;
  card: number;
  loading: boolean;
  createdAt: string;
}

const VideoItem: React.FC<Type> = ({
  handleDeleteVideo,
  src,
  videoId,
  title,
  duration,
  info,
  card,
  loading,
  createdAt = new Date().toISOString(),
}) => {
  const [isLoading, setIsLoading] = useState(true);

  function daysLeft(createdAt: string | Date) {
    const created = new Date(createdAt);
    const now = new Date();
    const diffTime = Math.max(0, now.getTime() - created.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const remaining = Math.max(30 - diffDays, 0); // assuming 30-day expiration
    return remaining;
  }

  const confirmDelete = () => {
    if (loading) return;
    confirmModal("Are you sure you want to delete this video?", () =>
      handleDeleteVideo(videoId)
    );
  };
  return (
    <li className="w-[23.5%] flex flex-col items-center gap-[17px] justify-between">
      <button
        onClick={confirmDelete}
        className="border-[2px] rounded-full size-[45px] flex justify-center items-center hover:bg-gray-600"
      >
        <Trash2 className="size-[25px]" />
      </button>
      <div className="h-[231px] w-full rounded-[27px] overflow-hidden relative">
        {src && (
          <>
            <Link
              href={`/upload?status=draft&videoId=${videoId}`}
              className="w-full h-full relative block"
            >
              <ReactPlayer
                url={src}
                muted
                loop
                width="100%"
                height="100%"
                progressInterval={1000}
                onReady={() => setIsLoading(false)}
                onBuffer={() => setIsLoading(true)}
                onBufferEnd={() => setIsLoading(false)}
                config={{
                  file: {
                    attributes: {
                      style: {
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      },
                    },
                  },
                }}
              />
              <div className="absolute inset-0 z-10"></div>
            </Link>
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin" />
              </div>
            )}
            <span className="absolute right-5 bottom-3 text-white text-[15px] leading-[22px] bg-black/60 px-1 rounded">
              {formatDuration(duration)}
            </span>
          </>
        )}
      </div>

      <div className="flex gap-[10px] w-full font-semibold">
        <div className="flex flex-col flex-1 text-[15px] gap-[5px] items-start tracking-wider">
          <h1 className="text-blue uppercase">
            {title.toUpperCase()}
            {info ? <span className="text-foreground"> - {info}</span> : null}
          </h1>
          <div className="flex items-center justify-between w-full gap-[10px]">
            <div className="flex items-center gap-[4px]">
              <img
                className="size-[17px]"
                src="/icon/desktop/profile/sticker.png"
                alt=""
              />
              {card}
            </div>
            <p
              className={`${
                daysLeft(createdAt) < 8 ? "text-[red]" : "text-gray-400"
              }  uppercase italic font-normal`}
            >
              {daysLeft(createdAt)} DAYS
            </p>
          </div>
        </div>
      </div>
    </li>
  );
};

export default VideoItem;
