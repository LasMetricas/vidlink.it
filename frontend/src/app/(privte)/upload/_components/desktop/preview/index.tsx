"use client";
import Footer from "@/app/_components/layout/desktop/footer";
import { useAtom } from "jotai";
import { cardAtom, CardType } from "@/store";
import { Suspense, useEffect, useState } from "react";
import PreviewVideo from "./previewVideo";
import Loading from "@/app/_components/ui/loading";
import CardNextBlank from "./card/cardNextBlank";
import CardNext from "./card/cardNext";
import QuickCard from "./card/quickCard";
import ButtonItems from "./buttonItems";
import CardItem from "./card/cardItem";

interface Type {
  setEdit(value: string): void;
  handlePublish(): void;
  setEditSignal(value: boolean): void;
  videoLink: string;
  loading: boolean;
  editSignal: boolean;
  title: string;
  description: string;
  info: string;
}
const Preview: React.FC<Type> = ({
  setEdit,
  handlePublish,
  setEditSignal,
  videoLink,
  loading,
  editSignal,
  title,
  description,
  info,
}) => {
  const [cards] = useAtom<CardType[]>(cardAtom);
  const [fltCards, setFltCards] = useState<CardType[]>([]);
  const [nextCard, setNextCard] = useState<{ start: number; no: number }>({
    start: -1,
    no: -1,
  });
  const [isSelected, setIsSelected] = useState<number>(0);
  const [signal, setSignal] = useState<boolean>(false);
  // const nextCardIndex = useRef<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [currentCard, setCurrentCard] = useState<number>(0);

  // Initialize next cards on mount
  useEffect(() => {
    const filter = cards.slice(0, 1);
    setFltCards(filter);
    const nextCard = cards[1] ?? { start: -1, no: -1 };
    setNextCard({ start: nextCard.start, no: nextCard.no });
  }, []);

  //The ordred display of card's blue color
  useEffect(() => {
    const index = cards.findLastIndex((card) => card.start <= currentTime);
    setCurrentCard(index);
    const nextCard = cards[index + 1] ?? { start: -1, no: -1 };
    setNextCard({ start: nextCard.start, no: nextCard.no });
    if (fltCards.length < index + 1) {
      const filter = cards.slice(0, index + 1).reverse();
      setFltCards(filter);
    }
  }, [currentTime]);

  // const handleNext = () => {
  //   nextCardIndex.current += 1;
  //   const nextCard = cards[nextCardIndex.current + 1] ?? { start: -1, no: -1 };
  //   setNextCard({ start: nextCard.start, no: nextCard.no });
  //   setFltCards(cards.slice(0, nextCardIndex.current + 1).reverse());
  //   setCurrentCard((prev) => prev + 1);
  //   setIsSelected(cards[nextCardIndex.current].start);
  // };
  
  const handleNext = () => {
    // const next = cards[isSelected + 2] ?? { start: -1, no: -1 };
    const index = cards.findIndex((card) => card.start === nextCard.start);
    setFltCards(cards.slice(0, index + 1).reverse());
    setIsSelected(index);
  };

  return (
    <>
      <div className="flex flex-col justify-between min-h-screen px-[80px] mt-[77px] mb-[105px]">
        <div className="flex justify-between items-start pb-[45px] gap-[70px] w-full uppercase font-semibold">
          <h1 className="text-[31px] pl-1 uppercase">
            <span className="text-blue">{title}</span>
            {info ? <span className="text-foreground"> - {info}</span> : null}
          </h1>
          <h2 className="w-[361px] flex items-center gap-[9px] text-[16px]">
            <img
              className="size-[13.5px]"
              src="/icon/desktop/detail/vector.png"
              alt=""
            />
            list of cards
          </h2>
        </div>
        <div className="flex items-start justify-between flex-grow gap-[70px] h-[673px] w-full">
          {/* <div className="h-full flex flex-col justify-between"> */}
          <PreviewVideo
            setCurrentTime={setCurrentTime}
            cards={cards}
            videoLink={videoLink}
            isSelected={isSelected}
            signal={signal}
          />
          {/* <div className="h-[94%] overflow-y-auto overflow-x-hidden"> */}
          <ul className="grid grid-cols-2 gap-x-[9px] gap-y-[10px] w-full max-w-[380px] h-[94%] content-start overflow-y-auto overflow-x-hidden">
            {nextCard.start !== -1 && nextCard.no !== -1 ? (
              <Suspense fallback={<Loading />}>
                <CardNext handleNext={handleNext} start={nextCard.start} />
              </Suspense>
            ) : (
              <CardNextBlank />
            )}
            <QuickCard />
            {fltCards.map((item, index) => (
              <Suspense key={index} fallback={<Loading />}>
                <CardItem
                  setIsSelected={setIsSelected}
                  setSignal={setSignal}
                  setEditSignal={setEditSignal}
                  key={index}
                  name={item.name}
                  // icon={item.icon}
                  start={item.start}
                  isSaved={item.isSaved}
                  link={item.link}
                  signal={signal}
                  no={item.no}
                  index={index}
                  currentCard={currentCard}
                />
              </Suspense>
            ))}
          </ul>
          {/* </div> */}
        </div>
        <div className="w-[1021px] leading-6 tracking-wider mt-[30px] mb-[77px]">
          <span className="font-semibold">DESCRIPTION: </span>
          <i>{description}</i>
        </div>
        {/* Publish button at bottom */}
        <ButtonItems
          setEdit={setEdit}
          handlePublish={handlePublish}
          loading={loading}
          editSignal={editSignal}
        />
      </div>
      <Footer isFixed={false} />
    </>
  );
};
export default Preview;
