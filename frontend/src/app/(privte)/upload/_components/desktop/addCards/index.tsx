"use client";
import Customize from "./setCards";
import Cards from "./cards";
import Footer from "@/app/_components/layout/desktop/footer";
import { useState } from "react";
import { useAtom } from "jotai";
import { cardAtom, CardType } from "@/store";
import VideoInfo from "./videoInfo";
import { checkUrl } from "@/utils/checkUrl";
import { confirmModal, errorModal } from "@/utils/confirm";
import SaveProgress from "./saveProgress/indext";

interface Type {
  handlePublish(): void;
  handleSaveDrafts(): void;
  setEdit(value: string): void;
  setEditSignal(value: boolean): void;
  setTitle(value: string): void;
  setDescription(value: string): void;
  setInfo(value: string): void;
  loading: boolean;
  videoLink: string;
  title: string;
  description: string;
  info: string;
  editSignal: boolean;
}

const AddCards: React.FC<Type> = ({
  handlePublish,
  handleSaveDrafts,
  setEdit,
  setEditSignal,
  setTitle,
  setDescription,
  setInfo,
  loading,
  videoLink,
  title,
  description,
  info,
  editSignal,
}) => {
  const [cards, setCards] = useAtom<CardType[]>(cardAtom);
  const [link, setLink] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [start, setStart] = useState<number>(0);
  const [isSaved, setIsSaved] = useState<boolean>(false);

  const addCard = () => {
    if (!link || !name) {
      return errorModal(
        `Please enter the ${!link ? "Link " : " "}${!name ? "Name " : " "}.`
      );
    }
    if (!checkUrl(link))
      return errorModal("Invalid link. Please enter a valid link.");
    if (!isTimeDif(start))
      return errorModal("You must keep 3s difference between cards.");
    const newCard = {
      link,
      name,
      start,
      isSaved,
      no: cards.filter((key) => key.start < start).length + 1,
    };
    const alreadyOne = cards.some((item) => item.start === start);
    if (!alreadyOne) {
      addCards(newCard);
    } else {
      confirmModal(
        "A card with the same start time already exists. Do you want to replace the existing card with this one?",
        () => replaceCard(newCard)
      );
    }
  };

  const isTimeDif = (time: number) => {
    const bigItem = cards.find((item) => item.start > time);
    const lessItem = cards.findLast((item) => item.start < time);
    let dif1 = 4;
    let dif2 = 4;
    if (bigItem?.start) {
      dif1 = bigItem.start - time;
    }
    if (lessItem?.start) {
      dif2 = time - lessItem.start; // Flip to get positive diff
    }
    if (dif1 < 3 || dif2 < 3) {
      return false;
    } else {
      return true;
    }
  };

  // replace existing card with new card
  const replaceCard = (newCard: CardType) => {
    const alreadyOne = cards.findIndex((item) => item.start === start);
    const updatedCards = [...cards];
    updatedCards[alreadyOne] = newCard;
    setCards(updatedCards);
    setLink("");
    setName("");
    // setIcon("");
    setIsSaved(false);
    setEditSignal(true);
  };

  // add new card to existing cards.
  const addCards = (newCard: CardType) => {
    const newCards = [...cards, newCard]
      .sort(function (a, b) {
        return a.start - b.start;
      })
      .map((card) =>
        card.start > start ? { ...card, no: card.no + 1 } : card
      );
    setCards(newCards);
    setLink("");
    setName("");
    // setIcon("");
    setIsSaved(false);
    setEditSignal(true);
  };

  //Open the preview page
  const handlePreviewPage = () => {
    if (!title) return errorModal("Please enter a title.");
    if (!info) return errorModal("Please enter a extra info.");
    if (cards.length < 1) return errorModal("Please make the cards.");
    setEdit("preview");
  };

  return (
    <>
      <main className="mx-[90px] mb-[96px]">
        <VideoInfo
          setEditSignal={setEditSignal}
          setTitle={setTitle}
          setDescription={setDescription}
          setInfo={setInfo}
          title={title}
          description={description}
          info={info}
          videoLink={videoLink}
        />

        <Customize
          addCard={addCard}
          setName={setName}
          // setIcon={setIcon}
          setLink={setLink}
          setStart={setStart}
          setIsSaved={setIsSaved}
          isSaved={isSaved}
          // icon={icon}
          name={name}
          link={link}
          start={start}
          videoLink={videoLink}
        />

        <Cards setEditSignal={setEditSignal} />

        <SaveProgress
          handlePreviewPage={handlePreviewPage}
          handlePublish={handlePublish}
          handleSaveDrafts={handleSaveDrafts}
          loading={loading}
          editSignal={editSignal}
        />
      </main>
      <Footer isFixed={false} />
    </>
  );
};
export default AddCards;
