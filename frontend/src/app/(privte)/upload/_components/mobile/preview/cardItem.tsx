import { cardAtom, CardType } from "@/store";
import { setItem } from "@/utils/localstorage";
import { useAtom } from "jotai";
import * as LucideIcons from "lucide-react";
import { useState } from "react";

interface Type {
  setIsSelected(value: number): void;
  setSignal(value: boolean): void;
  setEditSignal(value: boolean): void;
  name: string;
  start: number;
  // icon: string;
  no: number;
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
  // const IconComponent = LucideIcons[
  //   icon as keyof typeof LucideIcons
  // ] as React.ComponentType<React.SVGProps<SVGSVGElement>>;
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
      setItem("cards", newCards);
      return newCards;
    });
    setItem("editSignal", true);
    setEditSignal(true);
    setSaved(!saved);
  };
  return (
    <>
      <li
        className={`text-black w-[32%] h-[104.5px] flex flex-col justify-between z-50 relative`}
      >
        <button
          onClick={handlePreview}
          className={`${
            currentCard + 1 === no ? "hidden" : "block"
          } absolute top-0 left-0 w-full h-full opacity-[40%] bg-gray-900 rounded-[6px]`}
        ></button>
        <div className="bg-white rounded-[6px] h-[73.5px] p-[6px] overflow-hidden">
          <div className="text-[13.86px] font-semibold flex justify-between w-full items-center">
            <span className="">{no < 10 ? `0${no}` : no}</span>{" "}
            <i className="font-normal">
              ({Math.floor(start / 60)}:
              {start % 60 < 10 ? `0${start % 60}` : start % 60})
            </i>
          </div>
          <div
            className={`flex items-center justify-center mt-[3px] h-[50px] w-full text-center`}
          >
            <h1 className={`text-[13.86px] font-semibold`}>
              {name.toUpperCase()}
            </h1>
            {/* <IconComponent className="size-[18.29px]" /> */}
          </div>
        </div>
        <div className="flex h-[29px] gap-1 justify-between">
          <div
            className={`bg-white h-full rounded-[6px] w-[50%] flex justify-center items-center`}
          >
            <button
              onClick={() => handleIsSaved(no)}
              className="size-[22.51px]"
            >
              {saved ? (
                <img src="/icon/detail/card/left2Blue.png" alt="" />
              ) : (
                <img src="/icon/detail/card/left2.svg" alt="" />
              )}
            </button>
          </div>
          <a
            href={link}
            target="_blank"
            className={`bg-blue h-full rounded-[6px] w-[50%] flex justify-center items-center`}
          >
            <LucideIcons.Link className="size-[19px]" />
          </a>
        </div>
      </li>
    </>
  );
};
export default CardItem;
