"use client";
import useVideo from "@/hooks/useVideo";
import { errorModal } from "@/utils/confirm";
import * as LucideIcons from "lucide-react";
import { useState } from "react";

interface Type {
  setIsSelected(value: number): void;
  setSignal(value: boolean): void;
  name: string;
  start: number;
  // icon: string;
  no: number;
  index: number;
  isSaved: boolean;
  link: string;
  signal: boolean;
  currentCard: number;
  cardId: string;
  isAuth: boolean;
}
const CardItem: React.FC<Type> = ({
  setIsSelected,
  setSignal,
  name,
  start,
  // icon,
  no,
  isSaved,
  link,
  signal,
  currentCard,
  cardId,
  isAuth,
}) => {
  const { saveCard, increaseClicks, loading } = useVideo();
  const [saved, setSaved] = useState<boolean>(isSaved);

  // const IconComponent = LucideIcons[
  //   icon as keyof typeof LucideIcons
  // ] as React.ComponentType<React.SVGProps<SVGSVGElement>>;

  const handlePreview = () => {
    setIsSelected(no-1);
    setSignal(!signal);
  };

  //save card
  const handleSavingCard = async () => {
    if (!isAuth) {
      errorModal("You must log in before the saving card.");
      return;
    } else {
      if (loading) return;
      const res = await saveCard(cardId);
      if (res.status === 200 && "saved" in res) {
        setSaved(res.saved);
      } else {
        errorModal(res.message || "Something went wrong");
      }
    }
  };
  // visite the Link
  const handleVisit = () => {
    window.open(link, "_blank", "noopener,noreferrer");
    increaseClicks(cardId);
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
            <button onClick={handleSavingCard} className="size-[25px]">
              <LucideIcons.Bookmark
                className={`${
                  saved ? "fill-blue text-blue" : "text-gray-700"
                } w-[25px]`}
              />
            </button>
          </div>
          <button
            onClick={handleVisit}
            className={`bg-blue h-full rounded-[6px] w-[50%] flex justify-center items-center`}
          >
            <LucideIcons.Link className="size-[25px] text-foreground" />
          </button>
        </div>
      </li>
    </>
  );
};
export default CardItem;
