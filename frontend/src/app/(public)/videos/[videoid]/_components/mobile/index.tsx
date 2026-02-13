"use client";
import { useRouter } from "next/navigation";
import useVerifyAuth from "@/hooks/useVerifyAuth";
import { CardT, UserInfo, VideoInfo, VideoType } from "../../page";
import { useEffect, useRef, useState } from "react";
import useVideo from "@/hooks/useVideo";
import { errorModal, successModal } from "@/utils/confirm";
import { useAtom } from "jotai";
import { watchTimeAtom } from "@/store";
import { useBeforeUnload } from "react-use";
import dynamic from "next/dynamic";
import type ReactPlayerClass from "react-player";
import * as LucideIcons from "lucide-react";
import Link from "next/link";

const ReactPlayer = dynamic(() => import("react-player/lazy"), {
  ssr: false,
}) as unknown as typeof ReactPlayerClass;

interface Type {
  setFollowStatus(value: boolean): void;
  userInfo: UserInfo;
  videoInfo: VideoInfo;
  userVideos: VideoType[];
  relatedVideos: VideoType[];
  videoId: string | undefined;
  followStatus: boolean;
}

const VideoMobile: React.FC<Type> = ({
  setFollowStatus,
  userInfo,
  videoInfo,
  userVideos,
  relatedVideos,
  videoId,
  followStatus,
}) => {
  const { addLike, watchTime, followUser, saveCard, increaseClicks, loading } = useVideo();
  const [like, setLike] = useState<boolean>(userInfo.like);
  const router = useRouter();
  const { isAuth } = useVerifyAuth();

  const videoRef = useRef<ReactPlayerClass | null>(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [activeCard, setActiveCard] = useState<CardT | null>(null);
  const [showCards, setShowCards] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [watchingTime, setWatchingTime] = useAtom<number>(watchTimeAtom);
  const [lastTime, setLastTime] = useState(0);
  const maxTime = Number(process.env.NEXT_PUBLIC_MAX_TIME || 240);

  // Track active card based on video time
  useEffect(() => {
    const currentCard = videoInfo.cards
      .filter((card) => card.start <= currentTime)
      .sort((a, b) => b.start - a.start)[0];

    // Card stays visible for 4 seconds after its start time
    if (currentCard && currentTime - currentCard.start <= 4) {
      setActiveCard(currentCard as CardT);
    } else {
      setActiveCard(null);
    }
  }, [currentTime, videoInfo.cards]);

  const onProgress = () => {
    if (!videoRef.current) return;
    const time = Math.floor(videoRef.current.getCurrentTime());
    if (time < maxTime) {
      if (time > lastTime) {
        setWatchingTime((prev) => prev + (time - lastTime));
      }
      setLastTime(time);
      setCurrentTime(time);
    } else {
      videoRef.current?.seekTo(0, "seconds");
      setPlaying(false);
      errorModal("Maximum preview time is 4 minutes.");
    }
  };

  const handleWatchTime = async () => {
    if (!videoId || !watchingTime) return;
    watchTime(watchingTime, videoId);
  };

  useBeforeUnload(() => {
    handleWatchTime();
    setWatchingTime(0);
    return true;
  });

  const handleLike = async () => {
    if (userInfo.owner) {
      errorModal("You can't like your own video.");
      return;
    }
    if (!isAuth) {
      errorModal("Sign in to like this video.");
      return;
    }
    if (!videoId) return;
    const res = await addLike(videoId);
    if (res.status === 200 && "like" in res) {
      setLike(res.like);
    } else {
      errorModal(res.message || "Something went wrong");
    }
  };

  const handleFollow = async () => {
    if (loading) return;
    if (userInfo.owner) {
      errorModal("You can't follow yourself.");
      return;
    }
    if (!isAuth) {
      errorModal("Sign in to follow.");
      return;
    }
    const res = await followUser(videoInfo.userId);
    if (res.status === 200 && "followStatus" in res) {
      setFollowStatus(res.followStatus);
    } else {
      errorModal(res.message || "Something went wrong");
    }
  };

  const handleShare = async () => {
    const url = videoId
      ? `${window.location.origin}/videos/${videoId}`
      : window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      successModal("Link copied!");
    } catch {
      errorModal("Unable to copy link.");
    }
  };

  const handleSaveCard = async (cardId: string) => {
    if (!isAuth) {
      errorModal("Sign in to save cards.");
      return;
    }
    const res = await saveCard(cardId);
    if (res.status === 200) {
      successModal("Card saved!");
    }
  };

  const handleVisitCard = (card: CardT) => {
    window.open(card.link, "_blank", "noopener,noreferrer");
    increaseClicks(card._id);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins < 10 ? `0${mins}` : mins}:${secs < 10 ? `0${secs}` : secs}`;
  };

  const colors = [
    "from-purple-500 to-purple-700",
    "from-blue-500 to-blue-700",
    "from-emerald-500 to-emerald-700",
    "from-orange-500 to-orange-700",
    "from-pink-500 to-pink-700",
    "from-cyan-500 to-cyan-700",
  ];

  return (
    <div className="fixed inset-0 bg-black">
      {/* Full Screen Video */}
      <div className="absolute inset-0">
        <ReactPlayer
          ref={videoRef}
          url={videoInfo.videoLink}
          width="100%"
          height="100%"
          playing={playing}
          controls={false}
          progressInterval={100}
          onProgress={onProgress}
          onReady={() => setIsReady(true)}
          playsinline
          config={{
            file: {
              attributes: {
                playsInline: true,
                style: { width: "100%", height: "100%", objectFit: "cover" },
              },
            },
          }}
        />

        {/* Play/Pause overlay */}
        <button
          onClick={() => setPlaying(!playing)}
          className="absolute inset-0 flex items-center justify-center"
        >
          {!playing && (
            <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <LucideIcons.Play className="w-10 h-10 text-white ml-1" fill="white" />
            </div>
          )}
        </button>
      </div>

      {/* Top Bar - Back & Title */}
      <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/60 to-transparent z-10">
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()} className="p-2">
            <LucideIcons.ArrowLeft className="w-6 h-6 text-white" />
          </button>
          <div className="flex-1">
            <h1 className="text-white font-bold text-[16px] truncate">{videoInfo.title}</h1>
            <p className="text-white/70 text-[13px]">@{userInfo.userName}</p>
          </div>
        </div>
      </div>

      {/* Right Side Actions */}
      <div className="absolute right-4 bottom-[200px] flex flex-col items-center gap-6 z-10">
        {/* Profile */}
        <div className="flex flex-col items-center">
          <Link href={`/profile/${userInfo.owner ? "" : videoInfo.userId}`}>
            {userInfo.picture ? (
              <img
                src={userInfo.picture}
                alt=""
                className="w-12 h-12 rounded-full border-2 border-white"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-gray-600 flex items-center justify-center">
                <LucideIcons.User className="w-6 h-6 text-white" />
              </div>
            )}
          </Link>
          {!userInfo.owner && (
            <button
              onClick={handleFollow}
              className={`-mt-3 w-6 h-6 rounded-full flex items-center justify-center ${
                followStatus ? "bg-gray-500" : "bg-red-500"
              }`}
            >
              {followStatus ? (
                <LucideIcons.Check className="w-4 h-4 text-white" />
              ) : (
                <LucideIcons.Plus className="w-4 h-4 text-white" />
              )}
            </button>
          )}
        </div>

        {/* Like */}
        <button onClick={handleLike} className="flex flex-col items-center">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${like ? "bg-red-500" : "bg-white/20"}`}>
            <LucideIcons.Heart className={`w-6 h-6 ${like ? "text-white fill-white" : "text-white"}`} />
          </div>
          <span className="text-white text-[12px] mt-1">{videoInfo.likes || 0}</span>
        </button>

        {/* Cards */}
        <button onClick={() => setShowCards(!showCards)} className="flex flex-col items-center">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${showCards ? "bg-blue" : "bg-white/20"}`}>
            <LucideIcons.Layers className="w-6 h-6 text-white" />
          </div>
          <span className="text-white text-[12px] mt-1">{videoInfo.cards.length}</span>
        </button>

        {/* Share */}
        <button onClick={handleShare} className="flex flex-col items-center">
          <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
            <LucideIcons.Share2 className="w-6 h-6 text-white" />
          </div>
          <span className="text-white text-[12px] mt-1">Share</span>
        </button>
      </div>

      {/* Active Card Overlay */}
      {activeCard && !showCards && (
        <div className="absolute bottom-[100px] left-4 right-20 z-10">
          <div
            onClick={() => handleVisitCard(activeCard)}
            className={`bg-gradient-to-r ${colors[(activeCard.no - 1) % colors.length]} rounded-[16px] p-4 shadow-lg border border-white/30`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-white/25 flex items-center justify-center text-[14px] font-bold">
                  {activeCard.no}
                </span>
                <div>
                  <p className="font-semibold text-white text-[15px]">{activeCard.name}</p>
                  <p className="text-white/70 text-[12px]">{formatTime(activeCard.start)}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSaveCard(activeCard._id);
                  }}
                  className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center"
                >
                  <LucideIcons.Bookmark className="w-5 h-5 text-white" />
                </button>
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
                  <LucideIcons.ExternalLink className="w-5 h-5 text-black" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Info */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent z-10">
        {/* Progress Bar */}
        <div className="h-1 bg-white/30 rounded-full mb-4 overflow-hidden">
          <div
            className="h-full bg-white transition-all"
            style={{ width: `${(currentTime / (videoInfo.duration || 1)) * 100}%` }}
          />
        </div>
        <div className="flex justify-between text-white/70 text-[12px] mb-2">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(videoInfo.duration || 0)}</span>
        </div>
        {videoInfo.description && (
          <p className="text-white/80 text-[13px] line-clamp-2">{videoInfo.description}</p>
        )}
      </div>

      {/* Cards Panel (slide up) */}
      {showCards && (
        <div className="absolute inset-0 bg-black/90 z-20 flex flex-col">
          <div className="p-4 flex items-center justify-between border-b border-white/10">
            <h2 className="text-white font-bold text-[18px]">Cards ({videoInfo.cards.length})</h2>
            <button onClick={() => setShowCards(false)} className="p-2">
              <LucideIcons.X className="w-6 h-6 text-white" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            <div className="grid grid-cols-2 gap-4">
              {videoInfo.cards.map((card, index) => {
                const colorClass = colors[index % colors.length];
                let favicon = "";
                let domain = "";
                try {
                  const url = new URL(card.link);
                  favicon = `https://www.google.com/s2/favicons?domain=${url.hostname}&sz=64`;
                  domain = url.hostname.replace("www.", "");
                } catch {
                  domain = "";
                }

                return (
                  <div
                    key={card._id}
                    onClick={() => handleVisitCard(card as CardT)}
                    className={`relative rounded-[16px] p-4 bg-gradient-to-br ${colorClass} border-2 border-white/40 aspect-square cursor-pointer`}
                  >
                    {/* Card Number */}
                    <span className="absolute top-3 left-3 w-7 h-7 rounded-full bg-white/25 flex items-center justify-center text-[12px] font-bold">
                      {card.no}
                    </span>

                    {/* Timecode */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-[16px] font-bold text-white/90 bg-black/30 px-2 py-1 rounded-lg">
                        {formatTime(card.start)}
                      </span>
                    </div>

                    {/* Bottom */}
                    <div className="absolute bottom-3 left-3 right-3">
                      <div className="flex items-center gap-1.5 mb-1">
                        {favicon && (
                          <img src={favicon} alt="" className="w-4 h-4 rounded" />
                        )}
                        <span className="text-[10px] text-white/70 truncate">{domain}</span>
                      </div>
                      <p className="font-semibold text-[12px] leading-tight line-clamp-2 text-white">
                        {card.name}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoMobile;
