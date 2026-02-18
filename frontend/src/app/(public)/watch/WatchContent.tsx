"use client";
import { useState, useEffect, useRef, useCallback } from "react";
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

interface VideoItem {
  videoInfo: VideoInfo;
  userInfo: UserInfo | null;
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
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const { getRandomVideo, loading } = useVideo();
  const { isAuth } = useVerifyAuth();

  // Single video state (for desktop)
  const [videoInfo, setVideoInfo] = useState<VideoInfo | null>(null);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  // Video feed state (for mobile)
  const [videoFeed, setVideoFeed] = useState<VideoItem[]>([]);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [loadingMore, setLoadingMore] = useState(false);

  const [mounted, setMounted] = useState(false);
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

  // Mount and detect mobile
  useEffect(() => {
    setMounted(true);
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Fetch initial videos
  useEffect(() => {
    const fetchInitialVideos = async () => {
      const res = await getRandomVideo();
      if (res.status === 200 && res.videoInfo) {
        // Set for desktop
        setVideoInfo(res.videoInfo);
        setUserInfo(res.userInfo);
        // Set for mobile feed
        setVideoFeed([{ videoInfo: res.videoInfo, userInfo: res.userInfo }]);

        // Preload more videos for mobile
        loadMoreVideos(3);
      } else {
        setNoVideos(true);
      }
    };
    fetchInitialVideos();
  }, []);

  // Load more videos for the feed
  const loadMoreVideos = async (count: number = 2) => {
    if (loadingMore) return;
    setLoadingMore(true);

    const newVideos: VideoItem[] = [];
    for (let i = 0; i < count; i++) {
      try {
        const res = await getRandomVideo();
        if (res.status === 200 && res.videoInfo) {
          newVideos.push({ videoInfo: res.videoInfo, userInfo: res.userInfo });
        }
      } catch {}
    }

    if (newVideos.length > 0) {
      setVideoFeed(prev => [...prev, ...newVideos]);
    }
    setLoadingMore(false);
  };

  // Handle scroll to detect current video
  const handleScroll = useCallback(() => {
    if (!scrollContainerRef.current) return;

    const container = scrollContainerRef.current;
    const scrollTop = container.scrollTop;
    const itemHeight = container.clientHeight;
    const newIndex = Math.round(scrollTop / itemHeight);

    if (newIndex !== currentVideoIndex && newIndex >= 0 && newIndex < videoFeed.length) {
      setCurrentVideoIndex(newIndex);
      setCurrentTime(0);
      setActiveCard(null);
      setShowCards(false);
      setPlaying(true);

      // Load more videos when near the end
      if (newIndex >= videoFeed.length - 2) {
        loadMoreVideos(2);
      }
    }
  }, [currentVideoIndex, videoFeed.length]);

  // Track current time and active card
  const onProgress = (state: { playedSeconds: number }, cards: CardT[]) => {
    const time = Math.floor(state.playedSeconds);
    setCurrentTime(time);

    if (cards) {
      const currentCard = cards
        .filter((card) => card.start <= time)
        .sort((a, b) => b.start - a.start)[0];

      if (currentCard && time - currentCard.start <= 4) {
        setActiveCard(currentCard);
      } else {
        setActiveCard(null);
      }
    }
  };

  // Load next random video (for desktop)
  const loadNextVideo = async () => {
    try {
      const res = await getRandomVideo();
      if (res.status === 200 && res.videoInfo) {
        setVideoInfo(res.videoInfo);
        setUserInfo(res.userInfo);
        setActiveCard(null);
        setShowCards(false);
        setCurrentTime(0);
        setPlaying(true);
      }
    } catch {}
  };

  // Wait for client-side mount
  if (!mounted) return <Loading />;

  if (loading && !videoInfo && videoFeed.length === 0) return <Loading />;

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

  if (!videoInfo && videoFeed.length === 0) return <Loading />;

  const isVertical = videoInfo?.isVertical;
  const reachedCards = videoInfo?.cards?.filter(card => card.start <= currentTime) || [];
  const displayCards = showCards ? reachedCards : reachedCards.slice(0, 4);

  // Get current video for mobile
  const currentVideo = videoFeed[currentVideoIndex];

  // Card component for reuse
  const CardItem = ({ card, index, isActive = false, size = "normal" }: { card: CardT; index: number; isActive?: boolean; size?: "normal" | "small" }) => {
    const colorClass = colors[index % colors.length];
    let favicon = "";
    try {
      const url = new URL(card.link);
      favicon = `https://www.google.com/s2/favicons?domain=${url.hostname}&sz=64`;
    } catch {}

    const sizeClasses = size === "small" ? "w-28 h-28 min-w-[112px] min-h-[112px]" : "w-[140px] h-[140px] min-w-[140px] min-h-[140px]";

    return (
      <a
        href={card.link}
        target="_blank"
        rel="noopener noreferrer"
        className={`relative block ${sizeClasses} flex-shrink-0 rounded-2xl bg-gradient-to-br ${colorClass} p-3 border-2 ${isActive ? "border-white shadow-xl" : "border-white/30"} hover:border-white transition-colors no-underline`}
      >
        <span className="absolute top-2 left-2 w-6 h-6 rounded-full bg-white/25 flex items-center justify-center text-xs font-bold">
          {card.no}
        </span>
        {isActive && (
          <span className="absolute top-2 right-2 text-[8px] bg-white text-black px-1.5 py-0.5 rounded-full font-bold">
            NOW
          </span>
        )}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-base font-bold text-white/90 bg-black/30 px-2 py-1 rounded-lg">
            {formatTime(card.start)}
          </span>
        </div>
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

  // Mobile Video Item Component
  const MobileVideoItem = ({ item, index, isActive }: { item: VideoItem; index: number; isActive: boolean }) => {
    const video = item.videoInfo;
    const user = item.userInfo;
    const videoIsVertical = video.isVertical;
    const mobileReachedCards = video.cards?.filter(card => card.start <= (isActive ? currentTime : 0)) || [];

    return (
      <div className="h-full w-full flex-shrink-0 snap-start snap-always relative bg-black">
        {/* Video Player */}
        <div className="absolute inset-0 flex items-center justify-center pb-16">
          <div className={`relative ${videoIsVertical ? "h-full w-auto max-w-full aspect-[9/16]" : "w-full h-auto max-h-full aspect-video"}`}>
            <ReactPlayer
              url={video.videoLink}
              width="100%"
              height="100%"
              playing={isActive && playing && !showCards}
              controls={false}
              playsinline
              onProgress={(state) => isActive && onProgress(state, video.cards)}
              onEnded={() => {
                // Auto-scroll to next video
                if (scrollContainerRef.current && index < videoFeed.length - 1) {
                  const nextScrollTop = (index + 1) * scrollContainerRef.current.clientHeight;
                  scrollContainerRef.current.scrollTo({ top: nextScrollTop, behavior: 'smooth' });
                }
              }}
              config={{
                youtube: { playerVars: { rel: 0, modestbranding: 1 } },
                file: {
                  attributes: {
                    playsInline: true,
                    "webkit-playsinline": "true",
                    style: { width: "100%", height: "100%", objectFit: "contain" },
                  },
                },
              }}
            />

            {/* Play/Pause Overlay */}
            {isActive && !playing && (
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

            {/* Tap to play/pause (when playing) */}
            {isActive && playing && (
              <div
                className="absolute inset-0"
                onClick={() => setPlaying(!playing)}
              />
            )}
          </div>
        </div>

        {/* Active Card Notification - Top Banner */}
        {isActive && activeCard && !showCards && (
          <div className="absolute top-14 left-3 right-3 z-40 animate-slide-down">
            <a
              href={activeCard.link}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r ${colors[(activeCard.no - 1) % colors.length]} border border-white/20 shadow-lg no-underline`}
            >
              {/* Card Number */}
              <div className="w-8 h-8 rounded-full bg-white/25 flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-bold">{activeCard.no}</span>
              </div>

              {/* Card Info */}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm truncate">{activeCard.name}</p>
                <p className="text-xs text-white/70 truncate">{activeCard.link}</p>
              </div>

              {/* Arrow */}
              <svg className="w-5 h-5 flex-shrink-0 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        )}

        {/* Right Side Actions */}
        <div className="absolute right-3 bottom-36 flex flex-col gap-6 z-30">
          {/* User (video creator) */}
          {user && (
            <button
              onClick={() => router.push(`/profile/${video.userId}`)}
              className="flex flex-col items-center"
            >
              <div className="w-14 h-14 rounded-full bg-[#333] overflow-hidden border-2 border-white">
                {user.picture ? (
                  <img src={user.picture} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xl">
                    {user.userName?.charAt(0)?.toUpperCase() || "?"}
                  </div>
                )}
              </div>
              <span className="text-[11px] mt-1.5 max-w-[60px] truncate">{user.userName || "User"}</span>
            </button>
          )}

          {/* Like */}
          <button className="flex flex-col items-center">
            <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <span className="text-[11px] mt-1.5">Like</span>
          </button>

          {/* Cards */}
          <button
            onClick={() => setShowCards(!showCards)}
            className="flex flex-col items-center"
          >
            <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <span className="text-[11px] mt-1.5">{video.cards?.length || 0}</span>
          </button>

          {/* Share */}
          <button className="flex flex-col items-center">
            <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
            </div>
            <span className="text-[11px] mt-1.5">Share</span>
          </button>

          {/* Report */}
          <button className="flex flex-col items-center">
            <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <span className="text-[11px] mt-1.5">Report</span>
          </button>
        </div>

        {/* Video Info - Bottom Left */}
        <div className="absolute bottom-20 left-4 right-20 z-20">
          <h2 className="font-bold text-base mb-1 line-clamp-1">{video.title}</h2>
          <p className="text-xs text-[#aaa] line-clamp-2">{video.info}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="h-screen w-screen bg-black overflow-hidden">
      {/* Desktop Layout */}
      {!isMobile ? (
        <>
          {/* Top Navigation Bar - Desktop */}
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
                  url={videoInfo!.videoLink}
                  width="100%"
                  height="100%"
                  playing={playing}
                  controls={false}
                  playsinline
                  onProgress={(state) => onProgress(state, videoInfo!.cards)}
                  onEnded={loadNextVideo}
                  onClick={() => setPlaying(!playing)}
                  config={{
                    youtube: { playerVars: { rel: 0, modestbranding: 1 } },
                    file: {
                      attributes: {
                        playsInline: true,
                        "webkit-playsinline": "true",
                        style: { width: "100%", height: "100%", objectFit: "contain" },
                      },
                    },
                  }}
                />

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

              <div className="mt-4 w-full max-w-2xl">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-bold text-xl">{videoInfo!.title}</h2>
                    <p className="text-sm text-[#888] mt-1">{videoInfo!.info}</p>
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
                <h3 className="font-bold text-lg">Cards ({reachedCards.length}/{videoInfo!.cards?.length || 0})</h3>
                {reachedCards.length > 4 && (
                  <button
                    onClick={() => setShowCards(!showCards)}
                    className="text-xs text-blue hover:underline"
                  >
                    {showCards ? "Show less" : "View all"}
                  </button>
                )}
              </div>
              <div className="flex-1 overflow-y-auto pr-2">
                {reachedCards.length === 0 ? (
                  <p className="text-[#666] text-sm">Cards will appear as you watch...</p>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    {displayCards.map((card, index) => (
                      <CardItem
                        key={card._id}
                        card={card}
                        index={index}
                        isActive={activeCard?._id === card._id}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      ) : (
        /* Mobile Layout - TikTok-style Vertical Scroll */
        <>
          {/* Top Tabs - FYP / Following */}
          <div className="absolute top-0 left-0 right-0 z-50 pt-safe">
            <div className="flex items-center justify-center gap-6 py-3">
              <button className="text-white font-semibold text-base border-b-2 border-white pb-1">
                For You
              </button>
              <button className="text-white/60 font-medium text-base pb-1">
                Following
              </button>
            </div>
          </div>

          {/* Scroll Container */}
          <div
            ref={scrollContainerRef}
            className="h-full w-full overflow-y-scroll snap-y snap-mandatory scrollbar-hide"
            onScroll={handleScroll}
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {videoFeed.map((item, index) => (
              <MobileVideoItem
                key={`${item.videoInfo._id}-${index}`}
                item={item}
                index={index}
                isActive={index === currentVideoIndex}
              />
            ))}

            {/* Loading indicator */}
            {loadingMore && (
              <div className="h-20 flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              </div>
            )}
          </div>

          {/* Bottom Navigation Footer - Mobile */}
          <div className="absolute bottom-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-sm border-t border-white/10">
            <div className="flex items-center justify-around py-2 px-4 safe-area-pb">
              {/* Home */}
              <Link
                href="/watch"
                className="flex flex-col items-center py-2 px-4"
              >
                <svg className="w-6 h-6 mb-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
                </svg>
                <span className="text-[10px] font-medium">Home</span>
              </Link>

              {/* Create */}
              <Link
                href="/upload"
                className="flex flex-col items-center py-2 px-4"
              >
                <div className="w-10 h-7 bg-gradient-to-r from-cyan-400 to-blue rounded-lg flex items-center justify-center mb-1">
                  <svg className="w-5 h-5" fill="white" viewBox="0 0 24 24">
                    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                  </svg>
                </div>
                <span className="text-[10px] font-medium">Create</span>
              </Link>

              {/* Profile */}
              {isAuth ? (
                <Link
                  href="/profile"
                  className="flex flex-col items-center py-2 px-4"
                >
                  <img
                    className="w-7 h-7 rounded-full border border-white/50 mb-1"
                    src={profilePic || "/icon/layout/avatar.png"}
                    alt="Profile"
                  />
                  <span className="text-[10px] font-medium">Profile</span>
                </Link>
              ) : (
                <Link
                  href="/login"
                  className="flex flex-col items-center py-2 px-4"
                >
                  <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span className="text-[10px] font-medium">Log in</span>
                </Link>
              )}
            </div>
          </div>

          {/* Cards Panel with Mini Player (mobile only) */}
          {showCards && currentVideo && (
            <div className="absolute inset-0 z-40 bg-black flex flex-col">
              {/* Top 1/3 - Mini Video Player */}
              <div
                className="h-1/3 w-full bg-black flex items-center justify-center relative cursor-pointer"
                onClick={() => setShowCards(false)}
              >
                <div className={`relative ${currentVideo.videoInfo.isVertical ? "h-full w-auto aspect-[9/16]" : "w-full h-full"}`}>
                  <ReactPlayer
                    url={currentVideo.videoInfo.videoLink}
                    width="100%"
                    height="100%"
                    playing={playing}
                    controls={false}
                    playsinline
                    muted={false}
                    onProgress={(state) => onProgress(state, currentVideo.videoInfo.cards)}
                    config={{
                      youtube: { playerVars: { rel: 0, modestbranding: 1 } },
                      file: {
                        attributes: {
                          playsInline: true,
                          "webkit-playsinline": "true",
                          style: { width: "100%", height: "100%", objectFit: "contain" },
                        },
                      },
                    }}
                  />
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/60 px-3 py-1 rounded-full">
                    <span className="text-xs text-white/80">Tap to expand</span>
                  </div>
                </div>
                <button
                  className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/50 flex items-center justify-center"
                  onClick={(e) => { e.stopPropagation(); setPlaying(!playing); }}
                >
                  {playing ? (
                    <svg className="w-4 h-4" fill="white" viewBox="0 0 24 24">
                      <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4 ml-0.5" fill="white" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  )}
                </button>
              </div>

              {/* Bottom 2/3 - Cards List */}
              <div className="h-2/3 flex flex-col bg-[#111]">
                <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
                  <h3 className="font-bold text-lg">Cards ({currentVideo.videoInfo.cards?.length || 0})</h3>
                  <button
                    onClick={() => setShowCards(false)}
                    className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto p-4 pb-20">
                  <div className="grid grid-cols-2 gap-3">
                    {currentVideo.videoInfo.cards?.map((card, index) => (
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
          )}
        </>
      )}
    </div>
  );
};

export default WatchPage;
