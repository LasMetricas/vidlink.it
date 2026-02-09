"use client";

import { VideoType } from "@/app/(privte)/dashboard/page";
import { formatBigNum } from "@/utils/calculateBigNum";
import { Play, SquareArrowOutUpRight } from "lucide-react";
import { useState } from "react";

interface Type {
  videos: VideoType[];
}
const VideoTable: React.FC<Type> = ({ videos }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <>
      <div className="flex flex-col gap-[33px] uppercase flex-1">
        <div className="flex items-center gap-[31px]">
          <h1 className="flex items-center gap-[9px] text-[20px] font-semibold">
            <Play className=" fill-foreground" />
            VIDEO ANALYTICS
          </h1>
          <div className="border h-0 flex-1"></div>
        </div>
        <div
          className={`${
            isOpen ? " overflow-y-scroll overflow-x-hidden " : "overflow-hidden"
          } max-h-[360px] duration-500`}
        >
          <table className=" w-full ">
            <thead className="text-[16px] font-semibold">
              <tr className=" h-[31px]">
                <th className="text-left">VIDEO</th>
                <th className="w-[10%]">
                  <div className="flex gap-[5.23px] items-center justify-center">
                    VIEWS
                  </div>
                </th>
                <th className="w-[10%]">
                  <div className="flex gap-[5.23px] items-center justify-center">
                    LIKES
                  </div>
                </th>
                <th className="w-[10%] ">
                  <div className="flex gap-[5.23px] items-center justify-center">
                    CARDS
                  </div>
                </th>
                <th className="w-[10%] ">
                  <div className="flex gap-[5.23px] items-center justify-center">
                    WATCH&nbsp;TIME
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="font-bold text-[20px]">
              {videos?.map((item, index) => (
                <tr key={index} className="">
                  <td className="font-normal text-[16px]">
                    {item?.title.toUpperCase() || ""}
                  </td>
                  <td className="w-[13%]">
                    <div className="flex gap-[5.23px] items-center justify-center">
                      {formatBigNum(item?.views) || 0}
                    </div>
                  </td>
                  <td className="w-[13%] ">
                    <div className="flex gap-[5.23px] items-center justify-center">
                      {formatBigNum(item?.likes) || 0}
                    </div>
                  </td>
                  <td className="w-[13%]">
                    <div className="flex gap-[5.23px] items-center justify-center">
                      {item?.card || 0}
                    </div>
                  </td>
                  <td className="w-[13%]">
                    <div className="flex gap-[5.23px] items-center justify-center">
                      {item?.watchTime < 60
                        ? `${item?.watchTime < 10 ? 0 : ""}${Math.floor(
                            item?.watchTime
                          )}s`
                        : item?.watchTime < 3600
                        ? `${
                            Math.floor(item?.watchTime / 60) < 10 ? 0 : ""
                          }${Math.floor(item?.watchTime / 60)}m ${Math.floor(
                            item?.watchTime % 60
                          )}s`
                        : `${
                            Math.floor(item?.watchTime / 3600) < 10 ? 0 : ""
                          }${Math.floor(item?.watchTime / 3600)}h ${Math.floor(
                            (item?.watchTime % 3660) / 60
                          )}m` || 0}
                    </div>
                  </td>
                  <td className="w-[10%]">
                    <a
                      href={item.videoLink}
                      target="_blank"
                      className="flex gap-[5.23px] items-center justify-center"
                    >
                      <SquareArrowOutUpRight className="size-[19px]" />
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button
          onClick={() => setIsOpen(true)}
          className="border text-[16px] font-semibold rounded-[5px] flex items-center justify-center w-[109px] h-[32px]"
        >
          SHOW ALL
        </button>
      </div>
    </>
  );
};
export default VideoTable;
