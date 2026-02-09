"use client";
import * as LucideIcons from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { CardT } from "../../page";

interface Type {
  setIsSelected(value: number): void;
  setCards(cards: CardT[]): void;
  setProgress(value: string): void;
  progress: string;
  isSelected: number;
  name: string;
  start: number;
  no: number;
  isSaved: boolean;
  link: string;
  cards: CardT[];
}

const QuickCardItem: React.FC<Type> = ({
  setIsSelected,
  setCards,
  setProgress,
  progress,
  isSelected,
  name,
  start,
  no,
  isSaved,
  link,
  cards,
}) => {
  const [saved, setSaved] = useState<boolean>(isSaved);

  const handlePreview = () => {
    setIsSelected(no);
    setProgress("quickCards");
  };

  const handleDelete = () => {
    const updatedCards = cards.filter((card) => card.start !== start);
    setCards(updatedCards);
  };

  const handleSaveQuickCard = () => {
    const updatedCards = cards.map((card) =>
      card.start === start ? { ...card, isSaved: !card.isSaved } : card
    );
    setSaved((prev) => !prev);
    setCards(updatedCards);
  };

  return (
    <li className="flex flex-col items-center gap-y-[8px] w-[174px]">
      <button
        onClick={handleDelete}
        className="border-[2px] rounded-full size-[37px] flex justify-center items-center hover:bg-gray-600"
      >
        <LucideIcons.Trash2 className="w-[18px] h-[18px]" />
      </button>

      <div className="text-black text-[20px] font-semibold w-[174px] h-[148px] flex flex-col justify-between z-30 relative">
        <button
          onClick={handlePreview}
          className={`${
            isSelected === no && progress === "quickCards" ? "hidden" : "block"
          } absolute top-0 left-0 w-full h-full opacity-[40%] bg-gray-900 rounded-[6px]`}
        ></button>

        <div className="bg-white rounded-[6px] h-[104px] p-[6px] overflow-hidden">
          <div className="flex justify-between w-full items-center">
            <span>{no < 10 ? `0${no}` : no}</span>
            <i className="font-normal">
              ({Math.floor(start / 60)}:
              {start % 60 < 10 ? `0${start % 60}` : start % 60})
            </i>
          </div>
          <div className="flex items-center h-[38.4px] w-full justify-center text-center mt-[19px]">
            <h1>{name.toUpperCase()}</h1>
          </div>
        </div>

        <div className="flex h-[40px] gap-1 justify-between">
          <div className="bg-white h-full rounded-[6px] w-[50%] flex justify-center items-center">
            <button onClick={handleSaveQuickCard} className="size-[25px]">
              <LucideIcons.Bookmark
                className={`${
                  saved ? "fill-blue text-blue" : "text-gray-700"
                } w-[25px]`}
              />
            </button>
          </div>
          <Link
            href={link}
            target="_blank"
            className="bg-blue h-full rounded-[6px] w-[50%] flex justify-center items-center"
          >
            <LucideIcons.Link className="size-[25px] text-foreground" />
          </Link>
        </div>
      </div>
    </li>
  );
};

export default QuickCardItem;
