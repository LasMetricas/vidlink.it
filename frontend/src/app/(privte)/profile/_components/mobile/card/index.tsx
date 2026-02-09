"use client";
import Card from "./card";
import { useLayoutEffect, useState } from "react";
import InfiniteScrolling from "@/app/_components/ui/infinitScrolling";
import useVideo from "@/hooks/useVideo";
import { LoadingTop } from "@/app/_components/ui/loading";
import { errorModal } from "@/utils/confirm";

interface Type {
  nav: string;
}
export interface CardType {
  title: string;
  userName: string;
  cards: {
    _id: string;
    name: string;
    // icon: string;
    start: number;
    link: string;
    no: number;
    isSaved: boolean;
  }[];
}
const Cards: React.FC<Type> = ({ nav }) => {
  const { getCards, loading } = useVideo();
  const [cards, setCards] = useState<CardType[] | null>(null);
  const [displayedCards, setDisplayedCards] = useState<CardType[] | null>(null);
  const [hasMore, setHasMore] = useState<boolean>(false);

  const loadMoreCards = () => {
    let nextCards: CardType[] = [];
    if (cards) {
      const displayedLength = displayedCards?.length || 0;
      nextCards = cards.slice(displayedLength, displayedLength + 10);
    }
    setDisplayedCards((prev) => [...(prev || []), ...nextCards]);
    setHasMore(
      (displayedCards?.length || 0) + nextCards.length < (cards?.length || 0)
    );
  };

  useLayoutEffect(() => {
    if (nav === "cards") {
      (async () => {
        const res = await getCards();
        if (res.status === 200 && "cards" in res) {
          setCards(res.cards);
          setDisplayedCards(res.cards.slice(0, 10));
          setHasMore(res.cards.length > 10);
        } else {
          errorModal(res.message || "Something went wrong");
        }
      })();
    }
  }, [nav]);

  return (
    <>
      <div className="flex justify-center">
        {loading ? (
          <LoadingTop />
        ) : (
          <div className="text-[14px] w-full font-normal flex flex-col gap-[15px] mt-[48px]">
            <InfiniteScrolling
              next={loadMoreCards}
              dataLength={displayedCards?.length || 0}
              hasMore={hasMore}
            >
              {displayedCards?.map((item, index) => (
                <div key={index}>
                  <h1>
                    <span className=" text-blue font-semibold ">
                      {item.title && item.title?.toUpperCase()}
                    </span>{" "}
                    - {item?.userName?.toUpperCase() || ""}
                  </h1>
                  <ul className="flex flex-wrap gap-x-[2%] gap-y-[7.24px] mt-[13px] mb-[15px] w-full">
                    {item.cards?.map((item) => (
                      <Card
                        name={item.name}
                        link={item.link}
                        // icon={item.icon}
                        isSaved={item.isSaved}
                        start={item.start}
                        no={item.no}
                        _id={item._id}
                        key={item._id}
                      />
                    ))}
                  </ul>
                </div>
              ))}
            </InfiniteScrolling>
          </div>
        )}
      </div>
    </>
  );
};
export default Cards;
