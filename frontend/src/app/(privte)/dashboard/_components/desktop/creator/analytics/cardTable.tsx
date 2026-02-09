"use client";

import { useState } from "react";
import { CardType } from "../../../../page";
import { Link, SquareArrowOutUpRight } from "lucide-react";
import { formatBigNum } from "@/utils/calculateBigNum";

interface Type {
  cards: CardType[];
}
const CardTable: React.FC<Type> = ({ cards }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <>
      <div className="flex flex-col gap-[33px] uppercase flex-1">
        <div className="flex items-center gap-[31px] ">
          <h1 className="flex items-center gap-[9px] text-[20px] font-semibold">
            <img src="/icon/desktop/dashboard/sticker.png" alt="sticker" />
            CARD ANALYTICS
          </h1>
          <div className="border h-0 flex-1"></div>
        </div>
        <div
          className={`${
            isOpen ? " overflow-y-scroll overflow-x-hidden " : "overflow-hidden"
          } max-h-[360px] duration-500`}
        >
          <table className="font-semibold w-full">
            <thead className="text-[16px] font-semibold">
              <tr className=" tracking-wider h-[31px]">
                <th>
                  <div className="flex items-center justify-start gap-[35%]">
                    #CARD NAME
                  </div>
                </th>
                <th>
                  <div className="flex items-center justify-start gap-[35%]">
                    VIDEO
                  </div>
                </th>
                <th className="w-[10%]">
                  <div className="flex gap-[5.23px] items-center justify-center">
                    CLICKS
                  </div>
                </th>
                <th className="w-[10%]">
                  <div className="flex gap-[5.23px] items-center justify-center">
                    SAVED
                  </div>
                </th>
                <th className="w-[10%] ">
                  <div className="flex gap-[5.23px] items-center justify-center">
                    LINK
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="text-[20px] font-bold">
              {cards?.map((item, index) => (
                <tr key={index} className=" h-[19.8px]">
                  <td className="font-normal text-[16px] tracking-wider">
                    (#{(item?.no > 9 ? item?.no : `0${item?.no}`) || 0}&nbsp;
                    {item?.name || ""})
                  </td>
                  <td className="font-normal text-[10px] tracking-wider">
                    {item.title.toUpperCase()}
                  </td>
                  <td className="w-[10%]">
                    <div className="flex gap-[5.23px] items-center justify-center">
                      {formatBigNum(item?.clicks) || 0}
                    </div>
                  </td>
                  <td className="w-[10%]">
                    <div className="flex gap-[5.23px] items-center justify-center">
                      {formatBigNum(item?.saved) || 0}
                    </div>
                  </td>
                  <td className="w-[10%]">
                    <a
                      href={item?.link || ""}
                      target="_blank"
                      className="flex gap-[5.23px] items-center justify-center"
                    >
                      <Link className="size-[19px]" />
                    </a>
                  </td>
                  <td className="w-[10%]">
                    <a
                      href={item?.link || ""}
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
export default CardTable;
