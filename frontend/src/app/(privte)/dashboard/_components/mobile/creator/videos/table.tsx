"use client";
import { VideoType } from "@/app/(privte)/dashboard/page";
import { Clock } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface Type {
  videos: VideoType[];
}
const Table: React.FC<Type> = ({ videos }) => {
  const [isOpen, setIsOpen] = useState<boolean>(true);

  return (
    <>
      <div
        className={`${
          isOpen
            ? "max-h-[413px] overflow-scroll"
            : "max-h-[63.8px] overflow-hidden"
        } font-semibold bg-[#191919] rounded-[8px] px-[11px] py-[16px]  duration-500`}
      >
        <h1 className="font-semibold text-[10px] w-full text-center">
          LIST OF VIDEOS
        </h1>
        <button onClick={() => setIsOpen(!isOpen)} className="w-full">
          <img
            src="/icon/dashboard/arrow.png"
            className={`${
              isOpen ? "rotate-0" : "rotate-180"
            } duration-300 size-[18.53px] mx-auto mt-[6px]`}
            alt=""
          />
        </button>
        <table className="font-semibold w-full">
          <thead className="text-[8px]">
            <tr className="border-b-[0.5px] h-[31px]">
              <th className="text-left">
                <i>VIDEO</i>
              </th>
              <th className="w-[14%]">
                <div className="flex gap-[5.23px] items-center justify-center">
                  <Image
                    width={7.77}
                    height={7.77}
                    src="/icon/dashboard/views.png"
                    alt=""
                    loading="eager"
                  />
                  <i>VIEWS</i>
                </div>
              </th>
              <th className="w-[14%]">
                <div className="flex gap-[5.23px] items-center justify-center">
                  <Image
                    width={7.77}
                    height={7.77}
                    src="/icon/dashboard/likes.png"
                    alt=""
                    loading="eager"
                  />
                  <i>LIKES</i>
                </div>
              </th>
              <th className="w-[14%] ">
                <div className="flex gap-[5.23px] items-center justify-center">
                  <Image
                    width={7.77}
                    height={7.77}
                    src="/icon/dashboard/cards.png"
                    alt=""
                    loading="eager"
                  />
                  <i>CARDS</i>
                </div>
              </th>
              <th className="w-[14%] ">
                <div className="flex gap-[5.23px] items-center justify-center">
                  <Clock className="size-[7.77px]" />
                  <i>WATCH&nbsp;TIME</i>
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="text-[10px]">
            {videos?.map((item, index) => (
              <tr key={index} className="border-b-[0.5px] h-[19.8px]">
                <td>{item?.title.toUpperCase() || ""}</td>
                <td className="w-[13%]">
                  <div className="flex gap-[5.23px] items-center justify-center">
                    <Image
                      width={7.77}
                      height={7.77}
                      src="/icon/dashboard/views.png"
                      alt=""
                      loading="eager"
                    />
                    {item?.views || 0}
                  </div>
                </td>
                <td className="w-[13%]">
                  <div className="flex gap-[5.23px] items-center justify-center">
                    <Image
                      width={7.77}
                      height={7.77}
                      src="/icon/dashboard/likes.png"
                      alt=""
                      loading="eager"
                    />
                    {item?.likes || 0}
                  </div>
                </td>
                <td className="w-[13%]">
                  <div className="flex gap-[5.23px] items-center justify-center">
                    <Image
                      width={7.77}
                      height={7.77}
                      src="/icon/dashboard/cards.png"
                      alt=""
                      loading="eager"
                    />
                    {item?.card || 0}
                  </div>
                </td>
                <td className="w-[13%]">
                  <div className="flex gap-[5.23px] items-center justify-center">
                    <Clock className="size-[7.77px]" />
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};
export default Table;
