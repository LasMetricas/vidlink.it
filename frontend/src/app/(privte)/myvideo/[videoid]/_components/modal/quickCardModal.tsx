"use client";

import useClickOutside from "@/hooks/useClickOutside";
import { CardType } from "@/store";
import { checkUrl } from "@/utils/checkUrl";
import { confirmModal, errorModal } from "@/utils/confirm";
import { Bookmark, Link, X } from "lucide-react";
import { ChangeEvent, useRef, useState } from "react";
import { CardT } from "../../page";

interface Type {
  setIsOpen(value: boolean): void;
  setCards(value: CardT[]): void;
  setIsSelected: React.Dispatch<React.SetStateAction<number>>;
  setProgress(value: string): void;
  setEditStatus(value: string): void;
  cards: CardT[];
  duration: number;
}

const QuickCardModal: React.FC<Type> = ({
  setIsOpen,
  setCards,
  setIsSelected,
  setProgress,
  setEditStatus,
  cards,
  duration,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [link, setLink] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [start, setStart] = useState<number>(0);
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [caution, setCaution] = useState<string>("");
  const [startTxt, setStartTxt] = useState<string>("00:00");

  const handleAutoPaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setLink(text);
    } catch (error) {
      console.error("Failed to read clipboard:", error);
    }
  };

  const handleName = (e: ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    if (name.length > 35) {
      errorModal("You can't add more. Maximum letter is 35.");
    } else {
      setName(name);
    }
  };

  const isTimeDif = (time: number) => {
    const bigItem = cards.find((item) => item.start > time);
    const lessItem = cards.findLast((item) => item.start < time);
    let dif1 = 4;
    let dif2 = 4;
    if (bigItem?.start !== undefined) {
      dif1 = bigItem.start - time;
    }
    if (lessItem?.start !== undefined) {
      dif2 = time - lessItem.start;
    }
    return dif1 >= 3 && dif2 >= 3;
  };

  const addCards = (newCard: CardT) => {
    const newCards = [...cards, newCard]
      .sort(function (a, b) {
        return a.start - b.start;
      })
      .map((card) =>
        card.start > start ? { ...card, no: card.no + 1 } : card
      );
    const no =
      newCards
        .filter((item) => !item._id)
        .findIndex((item) => item.start === newCard.start) + 1;
    setIsSelected(no);
    setCards(newCards);
    resetFields();
  };

  const replaceCard = (newCard: CardT) => {
    const alreadyOne = cards.findIndex((item) => item.start === start);
    const updatedCards = [...cards];
    updatedCards[alreadyOne] = newCard;
    const no =
      updatedCards
        .filter((item) => !item._id)
        .findIndex((item) => item.start === newCard.start) + 1;
    setIsSelected(no);
    setCards(updatedCards);
    resetFields();
  };

  const resetFields = () => {
    setLink("");
    setName("");
    setStartTxt("00:00");
    setIsSaved(false);
    setProgress("quickCards");
    setEditStatus("save");
  };

  const addCard = () => {
    if (!link || !name) {
      errorModal(
        `Please enter the ${!link ? "Link " : ""}${!name ? "Name " : ""}`.trim()
      );
      return;
    }
    if (!checkUrl(link)) {
      errorModal("Invalid link. Please enter a valid link.");
      return;
    }
    if (!isTimeDif(start)) {
      errorModal("ou must keep 3s difference between cards.");
      return;
    }
    const no = cards.filter((key) => key.start < start).length + 1;
    const newCard: CardType = {
      link,
      name,
      start,
      isSaved,
      no,
    };
    const alreadyOne = cards.some((item) => item.start === start);
    if (!alreadyOne) {
      addCards(newCard);
    } else {
      confirmModal(
        "A card with the same start time already exists. Do you want to replace it?",
        () => replaceCard(newCard)
      );
    }
  };

  const handleStartTxt = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim();
    const parts = value.split(":");

    if (parts.length !== 2 || !parts[0] || !parts[1]) {
      setCaution(
        'You must enter the start time in the correct format like "00:00".'
      );
    } else {
      const minute = Number(parts[0].trim());
      const seconds = Number(parts[1].trim());

      if (isNaN(minute) || isNaN(seconds) || minute > 59 || seconds > 59) {
        setCaution("You must enter valid numbers for minutes and seconds.");
      } else {
        const totalSeconds = minute * 60 + seconds;
        if (totalSeconds > 240) {
          setCaution(
            "You can't select any further. The maximum time is 4 minutes."
          );
        } else if (totalSeconds > duration) {
          setCaution(
            `Video length is limited to ${Math.floor(duration)} seconds.`
          );
        } else {
          setCaution("");
          setStart(totalSeconds);
        }
      }
    }
    setStartTxt(value);
  };

  useClickOutside(ref as React.RefObject<HTMLElement>, () => setIsOpen(false));

  return (
    <div
      ref={ref}
      className="w-[370px] bg-foreground rounded-t-[10px] rounded-b-[20px] text-[18px] text-background font-semibold shadow-lg overflow-hidden absolute top-[50px] left-0 z-10"
    >
      <div className="bg-blue h-[53px] flex items-center justify-end px-4 text-foreground">
        <div className="text-center flex-grow">CARD QUICK ADD</div>
        <button onClick={() => setIsOpen(false)}>
          <X />
        </button>
      </div>
      <div className="flex items-center gap-2 w-[343px] mx-auto mt-[20px]">
        <button onClick={handleAutoPaste}>
          <Link className="text-background size-[20px]" />
        </button>
        <input
          type="text"
          placeholder="PASTE LINK"
          className="flex-1 border border-background bg-foreground rounded-[7px] h-[27px] px-3 placeholder:uppercase"
          value={link}
          onChange={(e) => setLink(e.target.value)}
        />
      </div>
      <div className="flex flex-col justify-between w-[174px] h-[148px] mx-auto mt-[20px]">
        <div className="rounded-[9px] h-[104px] p-[4px] flex flex-col gap-[29px] items-end border border-background">
          <div className="relative group inline-block">
            <input
              placeholder="00:00"
              className="w-[69px] italic border h-[24px] border-background bg-foreground rounded-[6px] px-1 text-center uppercase"
              value={startTxt}
              onChange={handleStartTxt}
            />
            {caution && (
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 w-[200px] max-w-[250px] px-2 py-1 bg-red-500 text-foreground text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                {caution}
              </div>
            )}
          </div>
          <input
            type="text"
            placeholder="TEXT HERE"
            className="w-full border h-[24px] border-background bg-foreground rounded-[6px] px-3 text-center uppercase"
            value={name}
            onChange={handleName}
          />
        </div>

        <div className="flex h-[40px] gap-1 justify-between">
          <div className="h-full rounded-[9px] border border-background w-[50%] flex justify-center items-center">
            <button
              onClick={() => setIsSaved(!isSaved)}
              className="size-[30px]"
            >
              <Bookmark
                className={`${
                  isSaved ? "fill-blue text-blue" : "text-gray-700"
                } w-[25px]`}
              />
            </button>
          </div>
          <a
            href={link}
            target="_blank"
            className="bg-blue h-full rounded-[9px] border border-background w-[50%] flex justify-center items-center"
          >
            <Link className="size-[25px] text-foreground" />
          </a>
        </div>
      </div>

      <div className="px-4 pb-4 mt-[20px]">
        <button
          onClick={addCard}
          className="bg-blue w-full h-[48px] text-white rounded-[10px] uppercase text-[16px]"
        >
          ADD
        </button>
      </div>
    </div>
  );
};

export default QuickCardModal;
