"use client";
import Link from "next/link";
import { VideoType } from "../../page";
import ReactPlayer from "react-player";
import { formatDuration, formatBigNum } from "@/utils/calculateBigNum";
import { Eye } from "lucide-react";
import { useState } from "react";

interface Type {
  moreVideos: VideoType[];
  description: string;
}
const MoreVideos: React.FC<Type> = ({ moreVideos, description }) => {
  const [loading, setLoading] = useState(true);
  return (
    <>
      <div className="flex flex-col flex-grow">
        <div className="leading-6 tracking-wider mb-[87px]">
          <span className="font-semibold">DESCRIPTION: </span>
          <i>{description}</i>
        </div>
        <div>
          <h1 className="text-[18px] pb-[11px] font-semibold uppercase">
            MORE OF YOUR VIDEOS{" "}
            <span className=" italic font-normal">
              @{moreVideos[0].user.userName}
            </span>
          </h1>
          <ul className=" overflow-hidden h-[205px] gap-x-[2%] gap-y-[15px] flex items-start">
            {moreVideos.map((item, index) => (
              <li
                key={index}
                className="h-full w-[23.5%] flex flex-col items-center justify-between"
              >
                <div className="h-[172px] w-full rounded-[20px] overflow-hidden relative">
                  {item.videoLink && (
                    <>
                      <Link
                        href={`/videos/${item._id}`}
                        className="w-full h-full"
                      >
                        <ReactPlayer
                          url={item.videoLink}
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
                      </Link>
                      {loading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                          <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin" />
                        </div>
                      )}
                      <span className="absolute right-4 bottom-2 text-white text-[14px] leading-[20px] bg-black/60 px-1 rounded">
                        {formatDuration(item.duration)}
                      </span>
                    </>
                  )}
                </div>

                <div className="text-[12px] tracking-wider w-full px-[2px]">
                  <div className="flex items-center justify-between w-full font-semibold mb-[5px]">
                    <h1 className="text-blue uppercase">
                      {item.title.toUpperCase()}
                      {item.info ? (
                        <span className="text-foreground"> - {item.info}</span>
                      ) : null}
                    </h1>
                    <div className="flex gap-[5px] items-center">
                      <Eye className="size-[12px]" />
                      {formatBigNum(item.views)}
                    </div>
                  </div>
                  <div className="font-normal flex justify-end gap-[16px]">
                    <p className="text-gray-400 uppercase flex items-center gap-[4px]">
                      <img
                        className="size-[10px]"
                        src="/icon/desktop/profile/sticker.png"
                        alt=""
                      />
                      {item.card}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};
export default MoreVideos;
