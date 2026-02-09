"use client";
import Link from "next/link";
import { VideoType } from "../../../page";
import ReactPlayer from "react-player";
import { formatDuration, formatBigNum, timeAgo } from "@/utils/calculateBigNum";
import { Eye } from "lucide-react";
import { useState } from "react";

interface Type {
  userVideos: VideoType[];
  userName: string;
}
const UserVideo: React.FC<Type> = ({ userVideos, userName }) => {
  const [loading, setLoading] = useState(true);
  return (
    <>
      <div className="">
        <h1 className="text-[18px] pb-[11px]">
          <span className="font-semibold">MORE OF</span>&nbsp;-{" "}
          <i>@{userName.toUpperCase()}</i>
        </h1>
        <ul className=" overflow-hidden h-[287px] gap-x-[2%] gap-y-[15px] flex flex-wrap items-start">
          {userVideos.map((item, index) => (
            <li
              key={index}
              className="w-[23.5%] h-full flex flex-col items-center justify-between"
            >
              <div className="h-[242px] w-full rounded-[20px] overflow-hidden relative">
                {item.videoLink && (
                  <>
                    <Link
                      href={`/videos/${item._id}`}
                      className="w-full h-full relative block"
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
                      <div className="absolute inset-0 z-10"></div>
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

              <div className="flex gap-[10px] w-full">
                <Link href={`/profile/${item.user._id.trim()}`}>
                  {item.user.picture ? (
                    <img
                      className="size-[32px] rounded-full object-cover"
                      src={item.user.picture}
                      alt=""
                      loading="eager"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <span className="size-[42px]"></span>
                  )}
                </Link>

                <div className="flex flex-col flex-1 text-[14px] gap-[5px] items-start tracking-wider">
                  <div className="flex items-center justify-between w-full font-semibold">
                    <h1 className="text-blue uppercase">
                      {item.title.toUpperCase()}
                      {item.info ? (
                        <span className="text-foreground"> - {item.info}</span>
                      ) : null}
                    </h1>
                    <div className="flex gap-[5px] items-center">
                      <Eye className="size-[17px]" />
                      {formatBigNum(item.views)}
                    </div>
                  </div>
                  <div className="font-normal flex items-center gap-[16px]">
                    <p className="uppercase">{item.user.userName}</p>
                    <p className="text-gray-400 uppercase">
                      {timeAgo(item.createdAt)}
                    </p>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};
export default UserVideo;
