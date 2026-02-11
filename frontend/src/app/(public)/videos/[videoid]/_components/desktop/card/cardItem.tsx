"use client";
import useVideo from "@/hooks/useVideo";
import { errorModal } from "@/utils/confirm";
import * as LucideIcons from "lucide-react";
import { useState } from "react";

interface Type {
  setIsSelected(value: number): void;
  setSignal(value: boolean): void;
  name: string;
  start: number;
  no: number;
  index: number;
  isSaved: boolean;
  link: string;
  signal: boolean;
  currentCard: number;
  cardId: string;
  isAuth: boolean;
}

const CardItem: React.FC<Type> = ({
  setIsSelected,
  setSignal,
  name,
  start,
  no,
  isSaved,
  link,
  signal,
  currentCard,
  cardId,
  isAuth,
  index,
}) => {
  const { saveCard, increaseClicks, loading } = useVideo();
  const [saved, setSaved] = useState<boolean>(isSaved);

  const colors = [
    "from-purple-500 to-purple-700",
    "from-blue-500 to-blue-700",
    "from-emerald-500 to-emerald-700",
    "from-orange-500 to-orange-700",
    "from-pink-500 to-pink-700",
    "from-cyan-500 to-cyan-700",
  ];
  const colorClass = colors[(no - 1) % colors.length];

  // Extract domain for favicon
  let favicon = "";
  let domain = "";
  try {
    const url = new URL(link);
    favicon = `https://www.google.com/s2/favicons?domain=${url.hostname}&sz=64`;
    domain = url.hostname.replace("www.", "");
  } catch {
    favicon = "";
    domain = "";
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins < 10 ? `0${mins}` : mins}:${secs < 10 ? `0${secs}` : secs}`;
  };

  const handlePreview = () => {
    setIsSelected(no - 1);
    setSignal(!signal);
  };

  const handleSavingCard = async () => {
    if (!isAuth) {
      errorModal("You must log in before saving a card.");
      return;
    }
    if (loading) return;
    const res = await saveCard(cardId);
    if (res.status === 200 && "saved" in res) {
      setSaved(res.saved);
    } else {
      errorModal(res.message || "Something went wrong");
    }
  };

  const handleVisit = () => {
    window.open(link, "_blank", "noopener,noreferrer");
    increaseClicks(cardId);
  };

  const isActive = currentCard + 1 === no;

  return (
    <li className="relative">
      <div
        onClick={handlePreview}
        className={`relative w-[174px] h-[174px] rounded-[16px] p-4 transition-all cursor-pointer bg-gradient-to-br ${colorClass} border-2 shadow-lg ${
          isActive
            ? "border-white scale-105"
            : "border-white/40 hover:scale-105 hover:border-white/70 hover:shadow-xl"
        }`}
      >
        {/* Dimmed overlay when not active */}
        {!isActive && (
          <div className="absolute inset-0 bg-black/40 rounded-[14px]" />
        )}

        {/* Card Number Badge */}
        <span className="absolute top-3 left-3 w-7 h-7 rounded-full bg-white/25 flex items-center justify-center text-[12px] font-bold z-10">
          {no}
        </span>

        {/* NOW Badge */}
        {isActive && (
          <span className="absolute top-3 right-3 text-[9px] bg-white text-black px-2 py-0.5 rounded-full font-bold z-10">
            NOW
          </span>
        )}

        {/* Timecode - Center */}
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <span className="text-[18px] font-bold text-white/90 bg-black/30 px-2 py-1 rounded-lg">
            {formatTime(start)}
          </span>
        </div>

        {/* Card Content - Bottom aligned */}
        <div className="absolute bottom-3 left-3 right-3 z-10">
          {/* Favicon + Domain */}
          <div className="flex items-center gap-1.5 mb-1">
            {favicon ? (
              <img
                src={favicon}
                alt=""
                className="w-4 h-4 rounded"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            ) : (
              <LucideIcons.Link className="w-4 h-4 text-white/60" />
            )}
            {domain && (
              <span className="text-[10px] text-white/70 truncate">
                {domain}
              </span>
            )}
          </div>

          {/* Card Name */}
          <p className="font-semibold text-[13px] leading-tight line-clamp-2 text-white">
            {name}
          </p>
        </div>
      </div>

      {/* Action buttons below card */}
      <div className="flex gap-2 mt-2 w-[174px]">
        <button
          onClick={handleSavingCard}
          className={`flex-1 h-[36px] rounded-[8px] flex items-center justify-center transition-colors ${
            saved
              ? "bg-blue text-white"
              : "bg-white/10 hover:bg-white/20 text-white"
          }`}
        >
          <LucideIcons.Bookmark
            className={`w-5 h-5 ${saved ? "fill-white" : ""}`}
          />
        </button>
        <button
          onClick={handleVisit}
          className="flex-1 h-[36px] rounded-[8px] bg-blue hover:bg-blue/80 flex items-center justify-center transition-colors"
        >
          <LucideIcons.ExternalLink className="w-5 h-5 text-white" />
        </button>
      </div>
    </li>
  );
};

export default CardItem;
