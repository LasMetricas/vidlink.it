"use client";
import Image from "next/image";
import { useState } from "react";
import { CardType } from "../../../page";
import Link from "next/link";

interface Type {
  cards: CardType[];
}
const Cards: React.FC<Type> = ({ cards }) => {
  const [isOpen, setIsOpen] = useState<boolean>(true);

  return (
    <>
      <div
        className={`${
          isOpen
            ? "max-h-[413px] overflow-scroll"
            : "max-h-[63.8px] overflow-hidden"
        } font-semibold bg-[#191919] rounded-[8px] px-[11px] py-[16px] mt-[12px]  duration-500`}
      >
        <h1 className="font-semibold text-[10px] w-full text-center">
          MOST CLICKED CARDS
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
            <tr className="border-b-[0.5px] tracking-wider h-[31px]">
              <th>
                <div className="flex items-center justify-start gap-[35%]">
                  <i className="font-bold">(#CARD)</i>
                  <i className="font-normal">VIDEO</i>
                </div>
              </th>
              <th className="w-[14%]">
                <div className="flex gap-[5.23px] items-center justify-center">
                  <Image
                    width={7.77}
                    height={7.77}
                    src="/icon/dashboard/click.png"
                    alt=""
                    loading="eager"
                  />
                  <i>CLICKS</i>
                </div>
              </th>
              <th className="w-[14%]">
                <div className="flex gap-[5.23px] items-center justify-center">
                  <Image
                    width={7.77}
                    height={7.77}
                    src="/icon/dashboard/save.png"
                    alt=""
                    loading="eager"
                  />
                  <i>SAVED</i>
                </div>
              </th>
              <th className="w-[14%] ">
                <div className="flex gap-[5.23px] items-center justify-center">
                  <Image
                    width={7.77}
                    height={7.77}
                    src="/icon/dashboard/link.png"
                    alt=""
                    loading="eager"
                  />
                  <i>LINK</i>
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="text-[10px]">
            {cards?.map((item, index) => (
              <tr key={index} className="border-b-[0.5px] h-[19.8px]">
                <td className="font-normal tracking-wider">
                  <span className="font-bold">
                    (#{(item?.no > 9 ? item?.no : `0${item?.no}`) || 0}&nbsp;
                    {item?.name || ""})
                  </span>
                  &nbsp;{item.title.toUpperCase()}
                </td>
                <td className="w-[14%]">
                  <div className="flex gap-[5.23px] items-center justify-center">
                    <Image
                      width={7.77}
                      height={7.77}
                      src="/icon/dashboard/click.png"
                      alt=""
                      loading="eager"
                    />
                    {item?.clicks || 0}
                  </div>
                </td>
                <td className="w-[14%]">
                  <div className="flex gap-[5.23px] items-center justify-center">
                    <Image
                      width={7.77}
                      height={7.77}
                      src="/icon/dashboard/save.png"
                      alt=""
                      loading="eager"
                    />
                    {item?.saved || 0}
                  </div>
                </td>
                <td className="w-[14%]">
                  <Link
                    href={item?.link || ""}
                    target="_blank"
                    className="flex gap-[5.23px] items-center justify-center"
                  >
                    <Image
                      width={7.77}
                      height={7.77}
                      src="/icon/dashboard/link.png"
                      alt=""
                      loading="eager"
                    />
                    VISIT
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};
export default Cards;
