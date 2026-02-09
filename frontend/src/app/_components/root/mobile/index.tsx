"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import type ReactPlayerClass from "react-player";
import useVideo from "@/hooks/useVideo";
import useVerifyAuth from "@/hooks/useVerifyAuth";

const ReactPlayer = dynamic(() => import("react-player/lazy"), {
  ssr: false,
}) as unknown as typeof ReactPlayerClass;

interface CardData {
  _id: string;
  link: string;
  name: string;
  start: number;
  no: number;
  isSaved: boolean;
}

interface VideoData {
  _id: string;
  videoLink: string;
  title: string;
  info: string;
  duration: number;
  views: number;
  card: number;
  user: {
    _id: string;
    userName: string;
    picture: string;
  };
}

export default function HomeMobile() {
  const { getHomeVideos } = useVideo();
  const { isAuth } = useVerifyAuth();
  const [videos, setVideos] = useState<VideoData[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchVideos = async () => {
      const res = await getHomeVideos();
      if ("homeVideos" in res && res.homeVideos) {
        setVideos(res.homeVideos as VideoData[]);
      }
      setLoading(false);
    };
    fetchVideos();
  }, []);

  const handleScroll = () => {
    if (containerRef.current) {
      const scrollTop = containerRef.current.scrollTop;
      const height = window.innerHeight;
      const newIndex = Math.round(scrollTop / height);
      if (newIndex !== currentIndex && newIndex < videos.length) {
        setCurrentIndex(newIndex);
      }
    }
  };

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-black">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue"></div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full bg-black overflow-hidden">
      {/* Sticky Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-black/80 to-transparent pt-2 pb-6 px-4">
        <div className="flex justify-between items-center">
          <img src="/icon/layout/title.svg" alt="VidLink" className="h-[20px]" />
          <div className="flex gap-3">
            <Link
              href="/upload"
              className="bg-blue text-white text-[12px] font-bold px-4 py-2 rounded-full"
            >
              CREATE
            </Link>
            <Link
              href="/videos"
              className="bg-white/20 text-white text-[12px] font-bold px-4 py-2 rounded-full backdrop-blur-sm"
            >
              WATCH
            </Link>
            {!isAuth && (
              <Link
                href="/login"
                className="bg-white text-black text-[12px] font-bold px-4 py-2 rounded-full"
              >
                LOGIN
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Video Feed */}
      {videos.length > 0 ? (
        <div
          ref={containerRef}
          className="h-full overflow-y-scroll snap-y snap-mandatory"
          onScroll={handleScroll}
        >
          {videos.map((video, index) => (
            <VideoCard
              key={video._id}
              video={video}
              isActive={index === currentIndex}
            />
          ))}
        </div>
      ) : (
        <div className="h-full flex flex-col items-center justify-center text-white">
          <p className="text-[18px] mb-4">No videos yet</p>
          <Link
            href="/upload"
            className="bg-blue px-6 py-3 rounded-full font-bold"
          >
            Create the first video
          </Link>
        </div>
      )}

      {/* Bottom gradient */}
      <div className="fixed bottom-0 left-0 right-0 h-[100px] bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
    </div>
  );
}

interface VideoCardProps {
  video: VideoData;
  isActive: boolean;
}

function VideoCard({ video, isActive }: VideoCardProps) {
  const videoRef = useRef<ReactPlayerClass | null>(null);
  const { getVideo } = useVideo();
  const [cards, setCards] = useState<CardData[]>([]);
  const [currentTime, setCurrentTime] = useState(0);
  const [activeCard, setActiveCard] = useState<CardData | null>(null);
  const [cardsFetched, setCardsFetched] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  // Fetch cards when video becomes active
  useEffect(() => {
    if (isActive && !cardsFetched && video.card > 0) {
      const fetchCards = async () => {
        const res = await getVideo(video._id);
        if ("videoInfo" in res && res.videoInfo?.cards) {
          setCards(res.videoInfo.cards);
        }
        setCardsFetched(true);
      };
      fetchCards();
    }
  }, [isActive, cardsFetched, video._id, video.card]);

  // Update active card based on current time
  useEffect(() => {
    if (cards.length === 0) {
      setActiveCard(null);
      return;
    }

    // Find the most recent card that should be showing
    // Cards with start <= 1 show immediately (first card requirement)
    const effectiveTime = Math.max(currentTime, 1);
    const currentCard = cards
      .filter((card) => card.start <= effectiveTime)
      .sort((a, b) => b.start - a.start)[0];

    // Check if this card should still be visible (within 5 seconds of its start time)
    if (currentCard && effectiveTime - currentCard.start <= 5) {
      setActiveCard(currentCard);
    } else {
      setActiveCard(null);
    }
  }, [currentTime, cards]);

  const handleProgress = useCallback((state: { playedSeconds: number }) => {
    setCurrentTime(Math.floor(state.playedSeconds));
  }, []);

  return (
    <div className="h-screen w-full snap-start relative flex items-center justify-center bg-black">
      {/* Video Player - Always 9:16 full screen, plays inline */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <ReactPlayer
          ref={videoRef}
          url={video.videoLink}
          width="100%"
          height="100%"
          playing={isActive}
          loop
          muted={isMuted}
          playsinline
          onProgress={handleProgress}
          progressInterval={500}
          config={{
            youtube: {
              playerVars: {
                rel: 0,
                modestbranding: 1,
                controls: 0,
                playsinline: 1,
                fs: 0,
                disablekb: 1,
              }
            },
            file: {
              attributes: {
                playsInline: true,
                "webkit-playsinline": "true",
                autoPlay: true,
                muted: true,
                disablePictureInPicture: true,
                controlsList: "nodownload nofullscreen noremoteplayback",
                style: {
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  pointerEvents: "none",
                },
              },
            },
          }}
        />
      </div>

      {/* Floating Card Overlay */}
      {activeCard && (
        <a
          href={activeCard.link}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute bottom-[180px] left-4 right-4 z-30 animate-in fade-in slide-in-from-bottom-4 duration-300"
        >
          <div className="bg-black/80 backdrop-blur-md rounded-[14px] p-4 flex items-center justify-between border border-white/10">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <span className="w-8 h-8 rounded-full bg-blue flex-shrink-0 flex items-center justify-center text-[14px] font-bold">
                {activeCard.no}
              </span>
              <span className="font-semibold text-[15px] truncate">{activeCard.name}</span>
            </div>
            <div className="bg-blue px-4 py-2 rounded-[8px] text-[13px] font-semibold flex-shrink-0 ml-3">
              Visit
            </div>
          </div>
        </a>
      )}

      {/* Video Info Overlay */}
      <div className="absolute bottom-[100px] left-4 right-16 z-20">
        <Link href={`/profile/${video.user._id}`} className="flex items-center gap-2 mb-2">
          {video.user.picture ? (
            <img
              src={video.user.picture}
              alt=""
              className="w-10 h-10 rounded-full object-cover"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-600" />
          )}
          <span className="font-semibold text-[14px]">{video.user.userName}</span>
        </Link>
        <Link href={`/videos/${video._id}`}>
          <h3 className="text-[16px] font-bold text-blue">{video.title}</h3>
          {video.info && <p className="text-[13px] text-white/80">{video.info}</p>}
        </Link>
      </div>

      {/* Side Actions */}
      <div className="absolute right-3 bottom-[180px] flex flex-col gap-5 z-20">
        {/* Mute/Unmute Button */}
        <button
          onClick={() => setIsMuted(!isMuted)}
          className="flex flex-col items-center"
        >
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
            {isMuted ? (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
              </svg>
            )}
          </div>
          <span className="text-[10px] mt-1">{isMuted ? "Unmute" : "Mute"}</span>
        </button>
        <Link
          href={`/videos/${video._id}`}
          className="flex flex-col items-center"
        >
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
            <span className="text-[12px] font-bold">{video.card}</span>
          </div>
          <span className="text-[10px] mt-1">Cards</span>
        </Link>
        <div className="flex flex-col items-center">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
            <span className="text-[12px] font-bold">{video.views}</span>
          </div>
          <span className="text-[10px] mt-1">Views</span>
        </div>
      </div>

      {/* Card count indicator - shows when no active card is displayed */}
      {video.card > 0 && !activeCard && (
        <div className="absolute bottom-[40px] left-4 right-4 flex justify-center z-20">
          <div className="bg-white/10 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-2">
            <span className="text-[12px] text-white/70">{video.card} cards in this video</span>
          </div>
        </div>
      )}
    </div>
  );
}
