"use client";
import Footer from "@/app/_components/layout/desktop/footer";
import UserVideo from "./videos/userVideo";
import OtherVideo from "./videos/relatedVideo";
import Link from "next/link";
import { useRouter } from "next/navigation";
import SettingBar from "./settingBar";
import useVerifyAuth from "@/hooks/useVerifyAuth";
import CardNext from "./card/cardNext";
import { CardT, UserInfo, VideoInfo, VideoType } from "../../page";
import { Suspense, useEffect, useState } from "react";
import PreviewVideo from "./previewVideo";
import Loading from "@/app/_components/ui/loading";
import CardItem from "./card/cardItem";
import useVideo from "@/hooks/useVideo";
import CardNextBlank from "./card/cardNextBlank";
import SuggestCard from "./card/suggestCard";
import { errorModal } from "@/utils/confirm";

interface Type {
  setFollowStatus(value: boolean): void;
  userInfo: UserInfo;
  videoInfo: VideoInfo;
  userVideos: VideoType[];
  relatedVideos: VideoType[];
  videoId: string | undefined;
  followStatus: boolean;
}
const VideoDesktop: React.FC<Type> = ({
  setFollowStatus,
  userInfo,
  videoInfo,
  userVideos,
  relatedVideos,
  videoId,
  followStatus,
}) => {
  const { addLike } = useVideo();
  const [like, setLike] = useState<boolean>(userInfo.like);
  const router = useRouter();
  const { isAuth } = useVerifyAuth();

  const [fltCards, setFltCards] = useState<CardT[]>([]);
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
    const filter = videoInfo.cards.slice(0, 1);
    setFltCards(filter);
    const nextCard = videoInfo.cards[1] ?? { start: -1, no: -1 };
    setNextCard({ start: nextCard.start, no: nextCard.no });
  }, []);

  //The ordred display of card's blue color
  useEffect(() => {
    const index = videoInfo.cards.findLastIndex(
      (card) => card.start <= currentTime
    );
    setCurrentCard(index);
    const nextCard = videoInfo.cards[index + 1] ?? { start: -1, no: -1 };
    setNextCard({ start: nextCard.start, no: nextCard.no });
    if (fltCards.length < index + 1) {
      const filter = videoInfo.cards.slice(0, index + 1).reverse();
      setFltCards(filter);
    }
  }, [currentTime]);

  // const handleNext = () => {
  //   nextCardIndex.current += 1;
  //   const nextCard = videoInfo.cards[nextCardIndex.current + 1] ?? {
  //     start: -1,
  //     no: -1,
  //   };
  //   setNextCard({ start: nextCard.start, no: nextCard.no });
  //   setFltCards(videoInfo.cards.slice(0, nextCardIndex.current + 1).reverse());
  //   setCurrentCard((prev) => prev + 1);
  //   setIsSelected(videoInfo.cards[nextCardIndex.current].start);
  // };

  const handleNext = () => {
    // const next = cards[isSelected + 2] ?? { start: -1, no: -1 };
    const index = videoInfo.cards.findIndex(
      (card) => card.start === nextCard.start
    );
    setFltCards(videoInfo.cards.slice(0, index + 1).reverse());
    setIsSelected(index);
  };
  const handleLike = async () => {
    if (userInfo.owner) {
      return errorModal("You can't do this because you are an owner.");
    }
    if (!isAuth) {
      errorModal("You must log in before the adding Likes.");
      return;
    } else {
      if (!videoId) return;
      const res = await addLike(videoId);
      if (res.status === 200 && "like" in res) {
        setLike(res.like);
        router.refresh();
      } else {
        errorModal(res.message || "Something went wrong");
      }
    }
  };

  return (
    <>
      <div className="flex flex-col justify-between min-h-screen ">
        <main className="px-[40px] mt-[210px]">
          <div className="flex justify-between items-start pb-[45px] gap-[70px] w-full uppercase font-semibold">
            <h1 className="text-[31px] pl-1">
              <span className="text-blue">{videoInfo.title}</span>
              {videoInfo.info ? (
                <span className="text-foreground"> - {videoInfo.info}</span>
              ) : null}
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
          <div className="flex items-start justify-between gap-[70px] h-[673px] w-full">
            {/* <div className="h-full flex flex-col justify-between"> */}
            <div className="h-full flex flex-col justify-between flex-grow ">
              <PreviewVideo
                setCurrentTime={setCurrentTime}
                cards={videoInfo.cards}
                videoLink={videoInfo.videoLink}
                isSelected={isSelected}
                signal={signal}
                videoId={videoId || ""}
              />
              <SettingBar
                handleLike={handleLike}
                setFollowStatus={setFollowStatus}
                isAuth={isAuth}
                userInfo={userInfo}
                cards={videoInfo.cards.length}
                like={like}
                userId={videoInfo.userId}
                followStatus={followStatus}
                videoId={videoId}
              />
            </div>
            {/* <div className="h-[94%] overflow-y-auto overflow-x-hidden"> */}
            <ul className="grid grid-cols-2 gap-x-[9px] gap-y-[10px] w-full max-w-[380px] h-[94%] content-start overflow-y-auto overflow-x-hidden">
              {nextCard.start !== -1 && nextCard.no !== -1 ? (
                <Suspense fallback={<Loading />}>
                  <CardNext handleNext={handleNext} start={nextCard.start} />
                </Suspense>
              ) : (
                <CardNextBlank />
              )}
              <SuggestCard />
              {fltCards.map((item, index) => (
                <Suspense key={item._id} fallback={<Loading />}>
                  <CardItem
                    setIsSelected={setIsSelected}
                    setSignal={setSignal}
                    name={item.name}
                    // icon={item.icon}
                    start={item.start}
                    isSaved={item.isSaved}
                    link={item.link}
                    signal={signal}
                    no={item.no}
                    index={index}
                    currentCard={currentCard}
                    cardId={item._id}
                    isAuth={isAuth}
                  />
                </Suspense>
              ))}
            </ul>
            {/* </div> */}
          </div>
          <div className="w-[1021px] leading-6 tracking-wider mt-[30px] mb-[153px]">
            <span className="font-semibold">DESCRIPTION: </span>
            <i>{videoInfo.description}</i>
          </div>
          <UserVideo userVideos={userVideos} userName={userInfo.userName} />
          <OtherVideo otherVideos={relatedVideos} />
          <div className="flex justify-center">
            <Link
              href={"/videos"}
              className="flex justify-center items-center border-[2px] border-white h-[40px] w-[180px] rounded-[7px] text-[20px] mb-[72px] mt-[109px] font-semibold tracking-wider"
            >
              ALL VIDEOS
            </Link>
          </div>
        </main>
        <Footer isFixed={false} />
      </div>
    </>
  );
};
export default VideoDesktop;
