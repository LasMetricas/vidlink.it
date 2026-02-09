"use client";
import { cardAtom, CardType } from "@/store";
import { useAtom } from "jotai";
import * as LucideIcons from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface Type {
  setIsSelected(value: number): void;
  setSignal(value: boolean): void;
  setEditSignal(value: boolean): void;
  name: string;
  start: number;
  // icon: string;
  no: number;
  index: number;
  isSaved: boolean;
  link: string;
  signal: boolean;
  currentCard: number;
}
const CardItem: React.FC<Type> = ({
  setIsSelected,
  setSignal,
  setEditSignal,
  name,
  start,
  // icon,
  no,
  isSaved,
  link,
  signal,
  currentCard,
}) => {
  const [, setCards] = useAtom<CardType[]>(cardAtom);
  const [saved, setSaved] = useState<boolean>(isSaved);

  const handlePreview = () => {
    setIsSelected(no-1);
    setSignal(!signal);
  };

  const handleIsSaved = (e: number) => {
    setCards((prevCards) => {
      const newCards = prevCards.map((card) =>
        card.no === e ? { ...card, isSaved: !card.isSaved } : card
      );
      return newCards;
    });
    setEditSignal(true);
    setSaved(!saved);
  };

  return (
    <>
      <li
        className={`text-black text-[20px] font-semibold w-[174px] h-[148px] flex flex-col justify-between z-30 relative`}
      >
        <button
          onClick={handlePreview}
          className={`${
            currentCard + 1 === no ? "hidden" : "block"
          } absolute top-0 left-0 w-full h-full opacity-[40%] bg-gray-900 rounded-[6px]`}
        ></button>
        <div className="bg-white rounded-[6px] h-[104px] p-[6px] overflow-hidden">
          <div className="flex justify-between w-full items-center">
            <span className="">{no < 10 ? `0${no}` : no}</span>{" "}
            <i className="font-normal">
              ({Math.floor(start / 60)}:
              {start % 60 < 10 ? `0${start % 60}` : start % 60})
            </i>
          </div>
          <div
            className={`flex items-center h-[38.4px] w-full justify-center text-center mt-[19px]`}
          >
            <h1 className={``}>{name.toUpperCase()}</h1>
            {/* <IconComponent className="size-[18.29px]" /> */}
          </div>
        </div>
        <div className="flex h-[40px] gap-1 justify-between">
          <div
            className={`bg-white h-full rounded-[6px] w-[50%] flex justify-center items-center`}
          >
            <button onClick={() => handleIsSaved(no)} className="size-[25px]">
              <LucideIcons.Bookmark
                className={`${
                  saved ? "fill-blue text-blue" : "text-gray-700"
                } w-[25px]`}
              />
            </button>
          </div>
          <Link
            href={link}
            className={`bg-blue h-full rounded-[6px] w-[50%] flex justify-center items-center`}
          >
            <LucideIcons.Link className="size-[25px] text-foreground" />
          </Link>
        </div>
      </li>
    </>
  );
};
export default CardItem;
