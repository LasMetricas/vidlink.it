"use client";
import Footer from "@/app/_components/layout/desktop/footer";
import MoreVideos from "./videos/moreVideos";
import SettingBar from "./settingBar/settingBar";
import { CardT, VideoInfo, VideoType } from "../page";
import { Suspense, useEffect, useState } from "react";
import PreviewVideo from "./previewVideo";
import Loading from "@/app/_components/ui/loading";
import CardItem from "./card/cardItem";
import CardNextBlank from "./card/cardNextBlank";
import CardNext from "./card/cardNext";
import QuickAddCard from "./card/quickAddCard";
import { Loader } from "lucide-react";
import QuickCardItem from "./card/quickCardItem";
import QuickCardModal from "./modal/quickCardModal";
import { useRouter } from "next/navigation";
import useVideo from "@/hooks/useVideo";
import { confirmModal, errorModal, successModal } from "@/utils/confirm";

interface Type {
  videoInfo: VideoInfo;
  moreVideos: VideoType[];
}
const MyVideoDesktop: React.FC<Type> = ({ videoInfo, moreVideos }) => {
  const [cards, setCards] = useState<CardT[]>(videoInfo.cards);
  const [quickCards, setQuickCards] = useState<CardT[]>(videoInfo.cards);
  const [fltCards, setFltCards] = useState<CardT[]>([]);
  const [nextCard, setNextCard] = useState<{ start: number; no: number }>({
    start: -1,
    no: -1,
  });
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [currentCard, setCurrentCard] = useState<number>(0);
  const [signal, setSignal] = useState<boolean>(false);
  const [isSelected, setIsSelected] = useState<number>(0);
  const [isQuickCardSelected, setIsQuickCardSelected] = useState<number>(0);
  const [progress, setProgress] = useState<string>("cards");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isPublishig, setIsPublishing] = useState<boolean>(false);
  const [editStatus, setEditStatus] = useState<string>("discarded");
  const router = useRouter();
  const { deleteVideo, publish, loading } = useVideo();

  // Initialize cards on mount
  useEffect(() => {
    const filter = cards.slice(0, 1);
    setFltCards(filter);
    const next = cards[1] ?? { start: -1, no: -1 };
    setNextCard({ start: next.start, no: next.no });
  }, []);

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

  const handleNext = () => {
    // const next = cards[isSelected + 2] ?? { start: -1, no: -1 };
    const index = cards.findIndex((card) => card.start === nextCard.start);
    setFltCards(cards.slice(0, index + 1).reverse());
    setIsSelected(index);
  };

  const handleEdit = () => {
    router.push(`/upload?status=edit&videoId=${videoInfo._id}`);
  };

  const handleDelete = async () => {
    const res = await deleteVideo(videoInfo._id);
    if (
      res.status === 200 &&
      res.message === "Video and related cards deleted."
    ) {
      successModal("Video deleted successfully", () => router.push("/profile"));
    } else {
      errorModal(res.message || "Something went wrong");
    }
  };

  const confirmDelete = () => {
    confirmModal("Are you sure you want to delete this video?", handleDelete);
  };

  const handleDiscard = () => {
    if (quickCards === cards) return;
    setQuickCards(videoInfo.cards);
    setProgress("cards");
    setEditStatus("discarded");
  };

  const handlePublish = async () => {
    const data = new FormData();
    if (quickCards.length < 1) {
      errorModal("Please create the cards.");
      return;
    }
    setIsPublishing(true);
    data.append("videoLink", videoInfo.videoLink);
    data.append("title", videoInfo.title);
    data.append("info", videoInfo.info || "");
    data.append("cards", JSON.stringify(quickCards));
    data.append("duration", String(videoInfo.duration || 0));
    const res = await publish(data, "edit", videoInfo._id);
    if (res.status === 201 && "newCards" in res) {
      const newCards = res.newCards!;
      setQuickCards(newCards);
      setCards(newCards);
      setIsSelected(0);
      setIsQuickCardSelected(0);
      setProgress("cards");
      setEditStatus("saved");
      const filter = newCards.slice(0, 1);
      setFltCards(filter);
      const next = newCards[1] ?? { start: -1, no: -1 };
      setNextCard({ start: next.start, no: next.no });
    } else {
      errorModal(res.message || "Something went wrong");
    }
    setIsPublishing(false);
  };
  return (
    <div className="flex flex-col justify-between min-h-screen">
      <main className="mx-[40px] mt-[149px] mb-[50px]">
        <p className="max-w-[1100px] tracking-wider text-[18px] fontsem mb-[47px] leading-relaxed">
          <span className="font-semibold">NOTE:</span> This is a quick edit page
          to add more cards faster without needing to edit any other
          information. If you want to edit additional information besides the
          cards, click the ‘edit’ button located just below the video.
        </p>
        <div className="flex justify-between items-start pb-[45px] w-full uppercase font-semibold">
          <h1 className="text-[31px] pl-1 text-blue">
            {videoInfo.title.toUpperCase()}
            {videoInfo.info ? (
              <span className="text-foreground"> - {videoInfo.info}</span>
            ) : null}
          </h1>
          <h2 className="w-[380px] flex items-center gap-[9px] text-[16px]">
            <img
              className="size-[13.5px]"
              src="/icon/desktop/detail/vector.png"
              alt=""
            />
            list of cards
          </h2>
        </div>

        <div className="flex items-start justify-between gap-[70px] h-[673px] w-full">
          <div className="h-full flex flex-col justify-between flex-grow">
            <PreviewVideo
              setCurrentTime={setCurrentTime}
              cards={cards}
              quickCards={quickCards}
              videoLink={videoInfo.videoLink}
              isSelected={isSelected}
              isQuickCardSelected={isQuickCardSelected}
              progress={progress}
              signal={signal}
            />
            <SettingBar
              handleEdit={handleEdit}
              confirmDelete={confirmDelete}
              cards={cards.length}
              likes={videoInfo.likes}
              views={videoInfo.views}
            />
          </div>

          <ul className="grid grid-cols-2 gap-x-[9px] gap-y-[10px] w-full max-w-[380px] h-[94%] content-start overflow-y-auto overflow-x-hidden relative">
            {nextCard.start !== -1 && nextCard.no !== -1 ? (
              <CardNext handleNext={handleNext} start={nextCard.start} />
            ) : (
              <CardNextBlank />
            )}
            <QuickAddCard setIsOpen={setIsOpen} />
            {isOpen && (
              <QuickCardModal
                setIsOpen={setIsOpen}
                setCards={setQuickCards}
                setIsSelected={setIsQuickCardSelected}
                setProgress={setProgress}
                setEditStatus={setEditStatus}
                cards={quickCards}
                duration={videoInfo.duration}
              />
            )}
            {fltCards.map((item, index) => (
              <Suspense
                key={`${item.name}-${item.start}-${item.no}`}
                fallback={<Loading />}
              >
                <CardItem
                  setIsSelected={setIsSelected}
                  setProgress={setProgress}
                  setSignal={setSignal}
                  progress={progress}
                  name={item.name}
                  start={item.start}
                  isSaved={item.isSaved}
                  link={item.link}
                  no={item.no}
                  index={index}
                  cardId={item._id ?? ""}
                  currentCard={currentCard}
                  signal={signal}
                />
              </Suspense>
            ))}
          </ul>
        </div>

        <div className="flex items-start gap-[70px] mt-[24px] w-full ">
          <MoreVideos
            moreVideos={moreVideos}
            description={videoInfo.description}
          />
          <div className="grid grid-cols-1 w-full max-w-[380px] gap-y-5">
            <h1 className="flex items-center uppercase text-[16px] font-semibold">
              <img
                className="size-[16px]"
                src="/icon/desktop/profile/sticker.png"
                alt=""
              />{" "}
              quick adds: {quickCards.filter((c) => !c._id).length}
            </h1>
            <ul className="grid grid-cols-2 gap-x-[9px] gap-y-[10px] w-full max-w-[380px] h-[200px] content-start overflow-y-auto overflow-x-hidden">
              {quickCards.map((item, index) =>
                !item._id ? (
                  <Suspense
                    key={`${item.name}-${item.start}-${item.no}`}
                    fallback={<Loading />}
                  >
                    <QuickCardItem
                      setIsSelected={setIsQuickCardSelected}
                      setCards={setQuickCards}
                      setProgress={setProgress}
                      progress={progress}
                      isSelected={isQuickCardSelected}
                      name={item.name}
                      start={item.start}
                      isSaved={item.isSaved}
                      link={item.link}
                      no={index}
                      cards={quickCards}
                    />
                  </Suspense>
                ) : null
              )}
            </ul>

            <button
              onClick={handleDiscard}
              disabled={loading}
              className="w-full h-[58px] mt-[16PX] bg-[#003480] rounded-[10px] font-semibold text-[24px] tracking-wide transition duration-300 hover:bg-[#0052cc]"
            >
              DISCARD
            </button>
            <button
              onClick={handlePublish}
              disabled={
                loading || editStatus === "saved" || editStatus === "discarded"
              }
              className="bg-blue hover:bg-[#0052cc] w-full h-[58px] flex items-center justify-center rounded-[10px] font-semibold text-[29px] tracking-wide transition duration-300 "
            >
              {isPublishig ? (
                <>
                  <span className="text-white">SAVING...</span>
                  <Loader className=" text-white animate-spin" />
                </>
              ) : (
                <>
                  {!(editStatus === "saved") ? (
                    <div className="flex items-center gap-[20px]">SAVE</div>
                  ) : (
                    <>
                      <img
                        className="size-[28px]"
                        src="/icon/upload/checked.png"
                        alt=""
                      />
                      SAVED
                    </>
                  )}
                </>
              )}
            </button>
          </div>
        </div>
      </main>
      <Footer isFixed={false} />
    </div>
  );
};

export default MyVideoDesktop;
