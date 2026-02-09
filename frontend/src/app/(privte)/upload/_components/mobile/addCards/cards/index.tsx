"use client";
import CardItem from "./card";
import PreviewCard from "./previewCard";
import { useAtom } from "jotai";
import { cardAtom, CardType } from "@/store";
import { setItem } from "@/utils/localstorage";

interface Type {
  addCard(): void;
  setIsSaved(value: boolean): void;
  setEditSignal(value: boolean): void;
  setName(value: string): void;
  // setIcon(value: string): void;
  setLink(value: string): void;
  setStart(value: number): void;
  name: string;
  start: number;
  // icon: string;
  isSaved: boolean;
  link: string;
}
const Index: React.FC<Type> = ({
  addCard,
  setIsSaved,
  setEditSignal,
  setName,
  // setIcon,
  setLink,
  setStart,
  name,
  start,
  // icon,
  isSaved,
  link,
}) => {
  const [cards, setCards] = useAtom<CardType[]>(cardAtom);
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
  };

  return (
    <>
      <div className="mx-[19.5] flex flex-col items-center gap-[25px] mt-[36px]">
        <h1 className="text-[12px] font-semibold">PREVIEW</h1>
        <div className="flex justify-center">
          <PreviewCard
            // icon={icon}
            name={name}
            start={start}
            no={cards.length + 1}
            isSaved={isSaved}
            link={link}
            setIsSaved={setIsSaved}
          />
        </div>
      </div>
      <div className="mx-[11px]">
        <button
          onClick={addCard}
          className={`${
            link && name ? "bg-blue border-none" : "bg-background border-[2px]"
          } tracking-wider text-[16px] pt-[2px]  rounded-[14.7px] w-[207.5px] h-[36.7px] flex justify-center items-center mx-auto mt-[31.55px]`}
        >
          CARD DONE
        </button>
        <div className="flex flex-col items-center gap-[20px] mt-[62.9px]">
          {cards.length > 0 && (
            <h1 className="text-[12px] font-semibold">LIST OF CARDS</h1>
          )}
          <ul className="flex flex-wrap gap-y-[6px] gap-x-[2%] w-full">
            {cards?.map((item, index) => (
              <CardItem
                handleIsSaved={handleIsSaved}
                setName={setName}
                // setIcon={setIcon}
                setLink={setLink}
                setStart={setStart}
                key={index}
                name={item.name}
                // icon={item.icon}
                start={item.start}
                link={item.link}
                isSaved={item.isSaved}
                no={item.no}
              />
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};
export default Index;
