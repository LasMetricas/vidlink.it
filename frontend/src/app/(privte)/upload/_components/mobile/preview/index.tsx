"use client";
import Footer from "@/app/_components/layout/mobile/footer";
import { useAtom } from "jotai";
import { cardAtom, CardType } from "@/store";
import CardItem from "./cardItem";
import { Suspense, useEffect, useState } from "react";
import CardNext from "@/app/_components/ui/cardNext";
import PreviewVideo from "./previewVideo";
import ButtonItem from "./buttonItem";
import Loading from "@/app/_components/ui/loading";

interface Type {
  setEdit(value: string): void;
  handlePublish(): void;
  setEditSignal(value: boolean): void;
  videoLink: string;
  loading: boolean;
  editSignal: boolean;
  title: string;
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
      <div className="flex flex-col justify-between min-h-screen">
        <main className="mt-[37px] flex flex-col items-center">
          <PreviewVideo
            setCurrentTime={setCurrentTime}
            setEdit={setEdit}
            cards={cards}
            videoLink={videoLink}
            isSelected={isSelected}
            signal={signal}
            info={info}
            title={title}
          />
          <ul className="flex flex-wrap gap-x-[2%]  gap-y-[6px] max-h-[391.7px] w-full px-[11px]">
            {nextCard.start !== -1 && nextCard.no !== -1 ? (
              <Suspense fallback={<Loading />}>
                <CardNext
                  handleNext={handleNext}
                  no={nextCard.no}
                  start={nextCard.start}
                />
              </Suspense>
            ) : (
              <></>
            )}
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
                  currentCard={currentCard}
                />
              </Suspense>
            ))}
          </ul>
          <ButtonItem
            setEdit={setEdit}
            handlePublish={handlePublish}
            loading={loading}
            editSignal={editSignal}
          />
        </main>
        <Footer isFixed={false} />
      </div>
    </>
  );
};
export default Preview;
