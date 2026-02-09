"use client";
import { Eye } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import ReactPlayer from "react-player";
import { timeAgo, formatDuration, formatBigNum } from "@/utils/calculateBigNum";

interface Type {
  videoId: string;
  src: string;
  title: string;
  info: string;
  duration: number;
  views: number;
  card: number;
  createdAt?: string; // optional if you want to handle relative time
}

const VideoItem: React.FC<Type> = ({
  videoId,
  src,
  title,
  info,
  duration,
  views,
  card,
  createdAt = new Date().toISOString(),
}) => {
  const [loading, setLoading] = useState(true);
  return (
    <li className="w-[23.5%] flex flex-col items-center gap-[17px] justify-between">
      <div className="h-[316px] w-full rounded-[27px] overflow-hidden relative">
        {src && (
          <>
            <Link
              href={`/videos/${videoId}`}
              className="w-full h-full relative block"
            >
              <ReactPlayer
                url={src}
                muted
                loop
                width="100%"
                height="100%"
                progressInterval={1000}
                onReady={() => setLoading(false)}
                onBuffer={() => setLoading(true)}
                onBufferEnd={() => setLoading(false)}
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
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin" />
              </div>
            )}
            <span className="absolute right-5 bottom-3 text-white text-[18px] leading-[22px] bg-black/60 px-1 rounded">
              {formatDuration(duration)}
            </span>
          </>
        )}
      </div>

      <div className="flex gap-[10px] w-full font-semibold">
        <div className="flex flex-col flex-1 text-[18px] gap-[5px] items-start tracking-wider">
          <h1 className="text-blue uppercase">
            {title.toUpperCase()}
            {info ? <span className="text-foreground"> - {info}</span> : null}
          </h1>
          <div className="flex items-center gap-[10px]">
            <div className="flex gap-[5px] items-center">
              <Eye className="size-[17px]" />
              {formatBigNum(views)}
            </div>
            <div className="flex items-center gap-[4px]">
              <img
                className="size-[17px]"
                src="/icon/desktop/profile/sticker.png"
                alt=""
              />
              {card}
            </div>
            <p className="text-gray-400 uppercase">{timeAgo(createdAt)}</p>
          </div>
        </div>
      </div>
    </li>
  );
};

export default VideoItem;
