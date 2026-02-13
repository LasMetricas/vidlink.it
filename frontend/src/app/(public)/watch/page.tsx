"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import type ReactPlayerClass from "react-player";
import useVideo from "@/hooks/useVideo";
import useVerifyAuth from "@/hooks/useVerifyAuth";
import Loading from "@/app/_components/ui/loading";
import Cookies from "js-cookie";
import Link from "next/link";

const ReactPlayer = dynamic(() => import("react-player/lazy"), {
  ssr: false,
}) as unknown as typeof ReactPlayerClass;

interface CardT {
  _id: string;
  link: string;
  name: string;
  start: number;
  no: number;
  isSaved: boolean;
}

interface VideoInfo {
  _id: string;
  videoLink: string;
  title: string;
  description: string;
  info: string;
  duration: number;
  isVertical?: boolean;
  cards: CardT[];
  userId?: string;
  user?: { userName: string; picture: string };
}

interface UserInfo {
  userName: string;
  picture: string;
  totalVideos: number;
}

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${String(secs).padStart(2, "0")}`;
};

const colors = [
  "from-purple-500 to-purple-700",
  "from-blue-500 to-blue-700",
  "from-emerald-500 to-emerald-700",
  "from-orange-500 to-orange-700",
  "from-pink-500 to-pink-700",
  "from-cyan-500 to-cyan-700",
];

const WatchPage = () => {
  const router = useRouter();
  const videoRef = useRef<ReactPlayerClass | null>(null);
  const { getRandomVideo, loading } = useVideo();
  const { isAuth } = useVerifyAuth();

  const [videoInfo, setVideoInfo] = useState<VideoInfo | null>(null);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [activeCard, setActiveCard] = useState<CardT | null>(null);
  const [showCards, setShowCards] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [noVideos, setNoVideos] = useState(false);
  const [profilePic, setProfilePic] = useState<string>("");

  // Get profile picture
  useEffect(() => {
    const user = Cookies.get("user");
    if (user) {
      try {
        const parsedUser = JSON.parse(user);
        setProfilePic(parsedUser.picture || "");
      } catch {}
    }
  }, [isAuth]);

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Fetch random video
  useEffect(() => {
    const fetchVideo = async () => {
      const res = await getRandomVideo();
      if (res.status === 200 && res.videoInfo) {
        setVideoInfo(res.videoInfo);
        setUserInfo(res.userInfo);
      } else {
        setNoVideos(true);
      }
    };
    fetchVideo();
  }, []);

  // Track current time and active card
  const onProgress = (state: { playedSeconds: number }) => {
    const time = Math.floor(state.playedSeconds);
    setCurrentTime(time);

    if (videoInfo?.cards) {
      const currentCard = videoInfo.cards
        .filter((card) => card.start <= time)
        .sort((a, b) => b.start - a.start)[0];

      if (currentCard && time - currentCard.start <= 4) {
        setActiveCard(currentCard);
      } else {
        setActiveCard(null);
      }
    }
  };

  // Load next random video
  const loadNextVideo = async () => {
    setVideoInfo(null);
    setActiveCard(null);
    setShowCards(false);
    const res = await getRandomVideo();
    if (res.status === 200 && res.videoInfo) {
      setVideoInfo(res.videoInfo);
      setUserInfo(res.userInfo);
      setPlaying(true);
    }
  };

  if (loading && !videoInfo) return <Loading />;

  if (noVideos) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-black">
        <h1 className="text-2xl font-bold mb-4">No videos yet</h1>
        <p className="text-[#888] mb-8">Be the first to create one!</p>
        <button
          onClick={() => router.push("/upload")}
          className="bg-blue px-8 py-3 rounded-full text-lg font-semibold"
        >
          CREATE
        </button>
      </div>
    );
  }

  if (!videoInfo) return <Loading />;

  const isVertical = videoInfo.isVertical;
  const displayCards = videoInfo.cards?.slice(0, 4) || [];

  // Card component for reuse
  const CardItem = ({ card, index, isActive = false, size = "normal" }: { card: CardT; index: number; isActive?: boolean; size?: "normal" | "small" }) => {
    const colorClass = colors[index % colors.length];
    let favicon = "";
    try {
      const url = new URL(card.link);
      favicon = `https://www.google.com/s2/favicons?domain=${url.hostname}&sz=64`;
    } catch {}

    const sizeClasses = size === "small" ? "w-28 h-28" : "w-[140px] h-[140px]";

    return (
      <a
        href={card.link}
        target="_blank"
        rel="noopener noreferrer"
        className={`relative block ${sizeClasses} rounded-2xl bg-gradient-to-br ${colorClass} p-3 border-2 ${isActive ? "border-white shadow-2xl scale-105" : "border-white/30"} hover:scale-105 transition-transform`}
      >
        {/* Card Number */}
        <span className="absolute top-2 left-2 w-6 h-6 rounded-full bg-white/25 flex items-center justify-center text-xs font-bold">
          {card.no}
        </span>

        {/* NOW badge */}
        {isActive && (
          <span className="absolute top-2 right-2 text-[8px] bg-white text-black px-1.5 py-0.5 rounded-full font-bold">
            NOW
          </span>
        )}

        {/* Timecode - Center */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-base font-bold text-white/90 bg-black/30 px-2 py-1 rounded-lg">
            {formatTime(card.start)}
          </span>
        </div>

        {/* Bottom content */}
        <div className="absolute bottom-2 left-2 right-2">
          <div className="flex items-center gap-1 mb-0.5">
            {favicon && (
              <img src={favicon} alt="" className="w-3 h-3 rounded" onError={(e) => { e.currentTarget.style.display = 'none' }} />
            )}
          </div>
          <p className="font-semibold text-[10px] line-clamp-2 leading-tight">{card.name}</p>
        </div>
      </a>
    );
  };

  return (
    <div className="h-screen w-screen bg-black overflow-hidden">
      {/* Top Navigation Bar */}
      <div className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-4 md:px-8 py-3 bg-gradient-to-b from-black/80 to-transparent">
        <Link href="/" className="text-xl font-bold">vidlink</Link>
        <div className="flex items-center gap-3">
          <Link
            href="/upload"
            className="bg-blue px-6 py-2 rounded-full text-sm font-semibold hover:bg-blue/80 transition-colors"
          >
            CREATE
          </Link>
          <Link
            href="/videos"
            className="bg-white/20 px-6 py-2 rounded-full text-sm font-semibold hover:bg-white/30 transition-colors"
          >
            WATCH
          </Link>
          {isAuth ? (
            <Link href="/profile" className="ml-1">
              <img
                className="w-10 h-10 rounded-full border-2 border-white/50 hover:border-white transition-colors"
                src={profilePic || "/icon/layout/avatar.png"}
                alt="Profile"
              />
            </Link>
          ) : (
            <Link
              href="/login"
              className="bg-white/10 px-6 py-2 rounded-full text-sm font-semibold hover:bg-white/20 transition-colors"
            >
              LOG IN
            </Link>
          )}
        </div>
      </div>

      {/* Desktop Layout */}
      {!isMobile ? (
        <div className="h-full w-full flex items-center justify-center gap-8 px-8 pt-16">
          {/* Video Section */}
          <div className="flex-1 h-full flex flex-col items-center justify-center max-w-4xl">
            <div
              className={`relative ${
                isVertical
                  ? "h-[80vh] w-auto aspect-[9/16]"
                  : "w-full aspect-video"
              } rounded-xl overflow-hidden`}
            >
              <ReactPlayer
                ref={videoRef}
                url={videoInfo.videoLink}
                width="100%"
                height="100%"
                playing={playing}
                controls={false}
                onProgress={onProgress}
                onEnded={loadNextVideo}
                onClick={() => setPlaying(!playing)}
                config={{
                  youtube: { playerVars: { rel: 0, modestbranding: 1 } },
                  file: {
                    attributes: {
                      style: { width: "100%", height: "100%", objectFit: "contain" },
                    },
                  },
                }}
              />

              {/* Play/Pause Overlay */}
              {!playing && (
                <div
                  className="absolute inset-0 flex items-center justify-center cursor-pointer bg-black/30"
                  onClick={() => setPlaying(true)}
                >
                  <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <svg className="w-10 h-10 ml-1" fill="white" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
              )}
            </div>

            {/* Video Info */}
            <div className="mt-4 w-full max-w-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-bold text-xl">{videoInfo.title}</h2>
                  <p className="text-sm text-[#888] mt-1">{videoInfo.info}</p>
                </div>
                <button
                  onClick={loadNextVideo}
                  className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full hover:bg-white/20 transition-colors"
                >
                  <span className="text-sm font-medium">Next</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Cards Sidebar - Desktop */}
          <div className="w-[320px] h-full flex flex-col pt-16 pb-8 overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg">Cards</h3>
              {videoInfo.cards && videoInfo.cards.length > 4 && (
                <button
                  onClick={() => setShowCards(!showCards)}
                  className="text-xs text-blue hover:underline"
                >
                  {showCards ? "Show less" : `View all ${videoInfo.cards.length}`}
                </button>
              )}
            </div>
            <div className="flex-1 overflow-y-auto pr-2">
              <div className="grid grid-cols-2 gap-3">
                {(showCards ? videoInfo.cards : displayCards)?.map((card, index) => (
                  <CardItem
                    key={card._id}
                    card={card}
                    index={index}
                    isActive={activeCard?._id === card._id}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Mobile Layout - Fullscreen */
        <>
          <div className="h-full w-full flex items-center justify-center">
            <div
              className={`relative ${
                isVertical
                  ? "h-full w-auto max-w-full aspect-[9/16]"
                  : "w-full h-auto max-h-full aspect-video"
              }`}
            >
              <ReactPlayer
                ref={videoRef}
                url={videoInfo.videoLink}
                width="100%"
                height="100%"
                playing={playing}
                controls={false}
                onProgress={onProgress}
                onEnded={loadNextVideo}
                onClick={() => setPlaying(!playing)}
                config={{
                  youtube: { playerVars: { rel: 0, modestbranding: 1 } },
                  file: {
                    attributes: {
                      style: { width: "100%", height: "100%", objectFit: "contain" },
                    },
                  },
                }}
              />

              {/* Play/Pause Overlay */}
              {!playing && (
                <div
                  className="absolute inset-0 flex items-center justify-center cursor-pointer"
                  onClick={() => setPlaying(true)}
                >
                  <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <svg className="w-10 h-10 ml-1" fill="white" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
              )}

              {/* Active Card Overlay - Mobile */}
              {activeCard && (
                <div className="absolute bottom-20 left-4 z-20">
                  <CardItem card={activeCard} index={activeCard.no - 1} isActive size="small" />
                </div>
              )}
            </div>
          </div>

          {/* Right Side Actions - Mobile */}
          <div className="absolute right-4 bottom-1/3 flex flex-col gap-6 z-30">
            {userInfo && (
              <button
                onClick={() => router.push(`/profile/${videoInfo.userId}`)}
                className="flex flex-col items-center"
              >
                <div className="w-12 h-12 rounded-full bg-[#333] overflow-hidden border-2 border-white">
                  {userInfo.picture ? (
                    <img src={userInfo.picture} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-lg">
                      {userInfo.userName?.charAt(0)?.toUpperCase() || "?"}
                    </div>
                  )}
                </div>
                <span className="text-[10px] mt-1">{userInfo.userName || "User"}</span>
              </button>
            )}

            <button
              onClick={() => setShowCards(!showCards)}
              className="flex flex-col items-center"
            >
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <span className="text-[10px] mt-1">{videoInfo.cards?.length || 0}</span>
            </button>

            <button
              onClick={loadNextVideo}
              className="flex flex-col items-center"
            >
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                </svg>
              </div>
              <span className="text-[10px] mt-1">Next</span>
            </button>
          </div>

          {/* Video Info - Mobile Bottom */}
          <div className="absolute bottom-4 left-4 right-20 z-20">
            <h2 className="font-bold text-lg mb-1 line-clamp-1">{videoInfo.title}</h2>
            <p className="text-sm text-[#aaa] line-clamp-2">{videoInfo.info}</p>
          </div>
        </>
      )}

      {/* Cards Panel - Full Screen (mobile only) */}
      {showCards && isMobile && (
        <div className="absolute inset-0 z-40 bg-black/95 flex flex-col">
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <h3 className="font-bold text-lg">Cards ({videoInfo.cards?.length || 0})</h3>
            <button onClick={() => setShowCards(false)} className="p-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-3xl mx-auto">
              {videoInfo.cards?.map((card, index) => (
                <CardItem
                  key={card._id}
                  card={card}
                  index={index}
                  isActive={activeCard?._id === card._id}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WatchPage;
