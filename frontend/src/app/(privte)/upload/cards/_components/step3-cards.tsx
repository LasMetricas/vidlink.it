"use client";
import { useState, useEffect, useRef, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import type ReactPlayerClass from "react-player";
import { useAtom } from "jotai";
import { Link as LinkIcon, Trash2, Plus } from "lucide-react";
import Footer from "@/app/_components/layout/desktop/footer";
import { getUploadData, setUploadData } from "@/utils/uploadStorage";
import { cardAtom, CardType } from "@/store";
import { errorModal } from "@/utils/confirm";

const ReactPlayer = dynamic(() => import("react-player/lazy"), {
  ssr: false,
}) as unknown as typeof ReactPlayerClass;

const Step3Cards = () => {
  const router = useRouter();
  const videoRef = useRef<ReactPlayerClass | null>(null);
  const [cards, setCards] = useAtom<CardType[]>(cardAtom);

  const [videoLink, setVideoLink] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isVertical, setIsVertical] = useState(false);

  // New card form - default to 0:01 for first card engagement
  const [cardName, setCardName] = useState("");
  const [cardLink, setCardLink] = useState("");
  const [cardStart, setCardStart] = useState(1);
  const [startTxt, setStartTxt] = useState("00:01");

  const maxTime = Number(process.env.NEXT_PUBLIC_MAX_TIME || 240);

  useEffect(() => {
    const data = getUploadData();
    if (!data.videoLink || !data.title) {
      router.push("/upload");
      return;
    }
    setVideoLink(data.videoLink);
    if (data.cards && data.cards.length > 0) {
      setCards(data.cards);
    }
    setIsLoaded(true);
  }, [router, setCards]);

  // Update start time text when time changes
  useEffect(() => {
    const mins = Math.floor(cardStart / 60);
    const secs = cardStart % 60;
    setStartTxt(`${mins < 10 ? `0${mins}` : mins}:${secs < 10 ? `0${secs}` : secs}`);
  }, [cardStart]);

  const onProgress = (state: { playedSeconds: number }) => {
    const time = Math.floor(state.playedSeconds);
    setCurrentTime(time);
    if (time > maxTime) {
      setPlaying(false);
      errorModal("Maximum video time is 4 minutes.");
    }
  };

  const handleSetCurrentTime = () => {
    setCardStart(currentTime);
  };

  const handleStartTxtChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setStartTxt(value);

    const parts = value.split(":");
    if (parts.length === 2) {
      const mins = parseInt(parts[0]) || 0;
      const secs = parseInt(parts[1]) || 0;
      const total = mins * 60 + secs;
      if (total <= maxTime) {
        setCardStart(total);
      }
    }
  };

  const handleAutoPaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setCardLink(text);
    } catch (error) {
      console.error("Failed to read clipboard:", error);
    }
  };

  const addCard = () => {
    if (!cardName.trim()) {
      return errorModal("Please enter a name for the card.");
    }
    if (!cardLink.trim()) {
      return errorModal("Please enter a link for the card.");
    }

    const newCard: CardType = {
      name: cardName.trim(),
      link: cardLink.trim(),
      start: cardStart,
      no: cards.length + 1,
    };

    const updatedCards = [...cards, newCard].sort((a, b) => a.start - b.start);
    // Re-number cards after sorting
    const numberedCards = updatedCards.map((card, idx) => ({ ...card, no: idx + 1 }));
    setCards(numberedCards);

    // Clear form
    setCardName("");
    setCardLink("");
    setCardStart(currentTime);
  };

  const deleteCard = (index: number) => {
    const updatedCards = cards.filter((_, i) => i !== index);
    const numberedCards = updatedCards.map((card, idx) => ({ ...card, no: idx + 1 }));
    setCards(numberedCards);
  };

  const handleNext = () => {
    if (cards.length === 0) {
      return errorModal("Please add at least one card to your video.");
    }

    // Check that at least one card starts at 0:01 or earlier for immediate engagement
    const hasEarlyCard = cards.some((card) => card.start <= 1);
    if (!hasEarlyCard) {
      return errorModal("Your first card must appear at 0:01 or earlier to engage viewers immediately.");
    }

    setUploadData({ cards, step: 4 });
    router.push("/upload/preview");
  };

  const handleBack = () => {
    setUploadData({ cards });
    router.push("/upload/info");
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins < 10 ? `0${mins}` : mins}:${secs < 10 ? `0${secs}` : secs}`;
  };

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue"></div>
      </div>
    );
  }

  return (
    <main className="mx-[20px] md:mx-[50px] lg:mx-[90px] pt-[100px]">
      {/* Progress indicator */}
      <div className="flex items-center justify-center gap-4 mb-[60px]">
        <div className="flex items-center gap-2 opacity-60">
          <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white font-bold">✓</div>
          <span>Upload</span>
        </div>
        <div className="w-16 h-[2px] bg-green-500" />
        <div className="flex items-center gap-2 opacity-60">
          <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white font-bold">✓</div>
          <span>Info</span>
        </div>
        <div className="w-16 h-[2px] bg-green-500" />
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-blue flex items-center justify-center text-white font-bold">3</div>
          <span className="font-semibold">Cards</span>
        </div>
        <div className="w-16 h-[2px] bg-[#505050]" />
        <div className="flex items-center gap-2 opacity-40">
          <div className="w-8 h-8 rounded-full bg-[#505050] flex items-center justify-center">4</div>
          <span>Preview</span>
        </div>
      </div>

      <h1 className="text-[32px] font-bold mb-[40px] text-center">Add Interactive Cards</h1>

      <div className="flex flex-wrap gap-[40px]">
        {/* Video Player */}
        <div className={`mx-auto lg:mx-0 ${isVertical ? "w-[280px]" : "w-full max-w-[500px]"}`}>
          <div className={`rounded-[15px] overflow-hidden bg-[#1E1E1E] ${isVertical ? "aspect-[9/16]" : "aspect-video"}`}>
            <ReactPlayer
              ref={videoRef}
              url={videoLink}
              width="100%"
              height="100%"
              controls
              playing={playing}
              onProgress={onProgress}
              onPlay={() => setPlaying(true)}
              onPause={() => setPlaying(false)}
              onReady={() => {
                if (videoRef.current) {
                  const player = videoRef.current.getInternalPlayer();
                  if (player && player.videoWidth && player.videoHeight) {
                    setIsVertical(player.videoHeight > player.videoWidth);
                  }
                  setTimeout(() => {
                    if (player && player.videoWidth && player.videoHeight) {
                      setIsVertical(player.videoHeight > player.videoWidth);
                    }
                  }, 500);
                }
              }}
              config={{
                youtube: { playerVars: { rel: 0, modestbranding: 1 } },
                file: {
                  attributes: {
                    style: { width: "100%", height: "100%", objectFit: "contain" },
                  },
                },
              }}
            />
          </div>
          <p className="text-[#888] text-[14px] mt-2 text-center">
            Current time: <span className="text-white font-bold">{formatTime(currentTime)}</span>
          </p>

          {/* Add Card Form */}
          <div className="mt-6 p-5 bg-[#1E1E1E] rounded-[15px]">
            <h3 className="font-semibold text-[18px] mb-5">Add New Card</h3>

            <div className="space-y-5">
              {/* Card Name */}
              <div>
                <label className="text-[14px] text-[#888] mb-1 block">Card Name</label>
                <input
                  type="text"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  placeholder="e.g., Buy this product"
                  maxLength={35}
                  className="w-full h-[46px] bg-[#2a2a2a] border-[2px] border-[#505050] rounded-[8px] px-4 text-[16px] focus:border-[#888] focus:outline-none"
                />
              </div>

              {/* Card Link */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[14px] text-[#888]">Link URL</label>
                  <button onClick={handleAutoPaste} className="text-[13px] text-blue flex items-center gap-1 hover:underline">
                    <LinkIcon className="size-4" /> Paste
                  </button>
                </div>
                <input
                  type="url"
                  value={cardLink}
                  onChange={(e) => setCardLink(e.target.value)}
                  placeholder="https://..."
                  className="w-full h-[46px] bg-[#2a2a2a] border-[2px] border-[#505050] rounded-[8px] px-4 text-[16px] focus:border-[#888] focus:outline-none"
                />
              </div>

              {/* Start Time */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[14px] text-[#888]">Appears at</label>
                  <button onClick={handleSetCurrentTime} className="text-[14px] text-blue font-medium hover:underline">
                    Use current time
                  </button>
                </div>
                <input
                  type="text"
                  value={startTxt}
                  onChange={handleStartTxtChange}
                  placeholder="00:00"
                  className="w-full h-[46px] bg-[#2a2a2a] border-[2px] border-[#505050] rounded-[8px] px-4 text-[16px] focus:border-[#888] focus:outline-none"
                />
              </div>

              <button
                onClick={addCard}
                className="w-full bg-blue py-3 rounded-[8px] text-[16px] font-semibold flex items-center justify-center gap-2 mt-2"
              >
                <Plus className="size-5" /> Add Card
              </button>
            </div>
          </div>
        </div>

        {/* Cards List */}
        <div className="flex-1 min-w-[280px]">
          <h3 className="font-semibold mb-4">Cards ({cards.length})</h3>

          {/* Requirement hint */}
          <div className="bg-blue/10 border border-blue/30 rounded-[10px] p-3 mb-4">
            <p className="text-[13px] text-blue">
              <strong>Tip:</strong> Your first card must appear at <strong>0:01</strong> to engage viewers immediately.
            </p>
          </div>

          {cards.length === 0 ? (
            <div className="text-center text-[#888] py-10 bg-[#1E1E1E] rounded-[15px]">
              <p>No cards added yet.</p>
              <p className="text-[14px] mt-2">Add your first card at 0:01 to start!</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
              {cards.map((card, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-[#1E1E1E] rounded-[10px]"
                >
                  <div className="flex items-center gap-4">
                    <span className="w-8 h-8 rounded-full bg-blue flex items-center justify-center font-bold">
                      {card.no}
                    </span>
                    <div>
                      <p className="font-semibold">{card.name}</p>
                      <p className="text-[12px] text-[#888] truncate max-w-[250px]">{card.link}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-[14px] text-[#888]">{formatTime(card.start)}</span>
                    <button
                      onClick={() => deleteCard(index)}
                      className="text-red-500 hover:text-red-400"
                    >
                      <Trash2 className="size-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-[50px] mb-[100px]">
        <button
          onClick={handleBack}
          className="border-[2px] border-white px-[40px] py-[12px] rounded-[10px] text-[20px] font-semibold hover:bg-white hover:text-black transition-colors"
        >
          Back
        </button>
        <button
          onClick={handleNext}
          disabled={cards.length === 0}
          className="bg-blue px-[40px] py-[12px] rounded-[10px] text-[20px] font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          NEXT: Preview
        </button>
      </div>

      <Footer isFixed={false} />
    </main>
  );
};

export default Step3Cards;
