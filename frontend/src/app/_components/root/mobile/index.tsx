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
    const currentCard = cards
      .filter((card) => card.start <= currentTime)
      .sort((a, b) => b.start - a.start)[0];

    // Check if this card should still be visible (within 5 seconds of its start time)
    if (currentCard && currentTime - currentCard.start <= 5) {
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
      {/* Video Player - Always 9:16 full screen */}
      <div className="absolute inset-0 flex items-center justify-center">
        <ReactPlayer
          ref={videoRef}
          url={video.videoLink}
          width="100%"
          height="100%"
          playing={isActive}
          loop
          muted={!isActive}
          playsinline
          onProgress={handleProgress}
          progressInterval={500}
          config={{
            youtube: { playerVars: { rel: 0, modestbranding: 1, controls: 0 } },
            file: {
              attributes: {
                playsInline: true,
                style: { width: "100%", height: "100%", objectFit: "contain" },
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

      {/* Tap to view full */}
      <Link
        href={`/videos/${video._id}`}
        className="absolute inset-0 z-10"
        aria-label="View video details"
      />
    </div>
  );
}
