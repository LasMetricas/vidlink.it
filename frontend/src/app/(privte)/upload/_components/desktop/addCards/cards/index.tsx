"use client";
import CardItem from "./card";
import { useAtom } from "jotai";
import { cardAtom, CardType } from "@/store";

interface Type {
  setEditSignal(value: boolean): void;

}
const Index: React.FC<Type> = ({  
  setEditSignal,
}) => {
  const [cards, setCards] = useAtom<CardType[]>(cardAtom);
  const handleIsSaved = (e: number) => {
    setCards((prevCards) => {
      const newCards = prevCards.map((card) =>
        card.no === e ? { ...card, isSaved: !card.isSaved } : card
      );
      return newCards;
    });   
    setEditSignal(true);
  };

  return (
    <>
      <div className="flex flex-col items-center gap-[20px] mt-[62.9px]">
        {cards.length > 0 && (
          <h1 className="text-[12px] font-semibold">LIST OF CARDS</h1>
        )}
        <ul className="flex flex-wrap gap-y-[6px] gap-x-[2%] justify-start w-full">
          {cards?.map((item, index) => (
            <CardItem
              handleIsSaved={handleIsSaved}
              setEditSignal={setEditSignal}
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
    </>
  );
};
export default Index;
