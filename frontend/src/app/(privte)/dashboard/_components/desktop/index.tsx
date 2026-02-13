"use client";

import { useLayoutEffect, useState } from "react";
import { CardType, UserInfoType, VideoType } from "../../page";
import useVideo from "@/hooks/useVideo";
import { errorModal } from "@/utils/confirm";
import LoadingMiddle from "@/app/_components/ui/loading";
import { Play, CreditCard, Eye, Heart, Users, MousePointer, Clock, TrendingUp } from "lucide-react";
import Link from "next/link";

interface Type {
  setUserInfo(value: UserInfoType | null): void;
  setVideos(value: VideoType[]): void;
  setCards(value: CardType[]): void;
  userInfo: UserInfoType | null;
  videos: VideoType[];
  cards: CardType[];
}

export interface User {
  _id: string;
  email: string;
  status: string;
  signupAt: string;
  lastLoginAt: string;
  videos: number;
  cards: number;
}

export interface TotalInfo {
  visitors: number;
  videos: number;
  cards: number;
  videoViews: number;
  cardClicks: number;
  signups: number;
  usersAvgTime: number;
  visitorsAvgTime: number;
}

export interface UserInfoViewer {
  likeVideos: number;
  cardsClicks: number;
  savedCards: number;
}

const formatNum = (num: number) => {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
};

const formatTime = (seconds: number) => {
  if (seconds < 60) return `${Math.floor(seconds)}s`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ${Math.floor(seconds % 60)}s`;
  return `${Math.floor(seconds / 3600)}h ${Math.floor((seconds % 3600) / 60)}m`;
};

const DashboardDesktop: React.FC<Type> = ({
  setUserInfo,
  setVideos,
  setCards,
  userInfo,
  videos,
  cards,
}) => {
  const { getDataCreator, getDataViewer, getDataAdmin, loading } = useVideo();
  const [tab, setTab] = useState<"creator" | "viewer" | "admin">("creator");
  const [period, setPeriod] = useState<string>("year");
  const [userInfoViewer, setUserInfoViewer] = useState<UserInfoViewer | null>(null);
  const [views, setViews] = useState<number>(0);
  const [likes, setLikes] = useState<number>(0);
  const [watchTime, setWatchTime] = useState<number>(0);
  const [users, setUsers] = useState<User[]>([]);
  const [totalInfo, setTotalInfo] = useState<TotalInfo | null>(null);

  useLayoutEffect(() => {
    (async () => {
      if (tab === "creator") {
        const res = await getDataCreator(period);
        if (res.status === 200 && "userInfo" in res && "videos" in res && "cards" in res) {
          setUserInfo(res.userInfo);
          setVideos(res.videos);
          setCards(res.cards);
          let totalLikes = 0, totalViews = 0, totalWatchTime = 0;
          for (const v of res.videos) {
            totalLikes += v.likes;
            totalViews += v.views;
            totalWatchTime += v.watchTime;
          }
          setLikes(totalLikes);
          setViews(totalViews);
          setWatchTime(totalWatchTime);
        } else {
          errorModal(res.message || "Something went wrong");
        }
      } else if (tab === "admin") {
        const res = await getDataAdmin(period);
        if (res.status === 200 && "totalInfo" in res && "users" in res) {
          setTotalInfo(res.totalInfo);
          setUsers(res.users);
        } else {
          errorModal(res.message || "Something went wrong");
        }
      } else {
        const res = await getDataViewer(period);
        if (res.status === 200 && "userInfo" in res) {
          setUserInfoViewer(res.userInfo);
        } else {
          errorModal(res.message || "Something went wrong");
        }
      }
    })();
  }, [period, tab]);

  if (loading) return <LoadingMiddle />;

  const colorMap: Record<string, { bg: string; text: string }> = {
    purple: { bg: "bg-purple-500/20", text: "text-purple-400" },
    blue: { bg: "bg-blue-500/20", text: "text-blue-400" },
    pink: { bg: "bg-pink-500/20", text: "text-pink-400" },
    emerald: { bg: "bg-emerald-500/20", text: "text-emerald-400" },
    orange: { bg: "bg-orange-500/20", text: "text-orange-400" },
    cyan: { bg: "bg-cyan-500/20", text: "text-cyan-400" },
    violet: { bg: "bg-violet-500/20", text: "text-violet-400" },
    amber: { bg: "bg-amber-500/20", text: "text-amber-400" },
  };

  const StatCard = ({ icon: Icon, label, value, color = "blue" }: { icon: any; label: string; value: string | number; color?: string }) => (
    <div className="bg-[#1a1a1a] rounded-2xl p-5 flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl ${colorMap[color]?.bg || "bg-blue-500/20"} flex items-center justify-center`}>
        <Icon className={`w-6 h-6 ${colorMap[color]?.text || "text-blue-400"}`} />
      </div>
      <div>
        <p className="text-2xl font-bold">{value}</p>
        <p className="text-sm text-[#888]">{label}</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-black pt-20 px-8 pb-12">
      {/* Header */}
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            {userInfo?.picture && (
              <img src={userInfo.picture} alt="" className="w-14 h-14 rounded-full" />
            )}
            <div>
              <h1 className="text-2xl font-bold">Dashboard</h1>
              <p className="text-[#888]">@{userInfo?.userName || "user"}</p>
            </div>
          </div>

          {/* Period Filter */}
          <div className="flex items-center gap-2 bg-[#1a1a1a] rounded-full p-1">
            {["week", "month", "year"].map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  period === p ? "bg-white text-black" : "text-[#888] hover:text-white"
                }`}
              >
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8">
          {(["creator", "viewer", ...(userInfo?.isAdmin ? ["admin"] : [])] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t as any)}
              className={`px-6 py-2 rounded-full text-sm font-semibold transition-colors ${
                tab === t ? "bg-blue text-white" : "bg-[#1a1a1a] text-[#888] hover:text-white"
              }`}
            >
              {t.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Creator View */}
        {tab === "creator" && (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-4 gap-4 mb-8">
              <StatCard icon={Play} label="Videos" value={videos.length} color="purple" />
              <StatCard icon={Eye} label="Total Views" value={formatNum(views)} color="blue" />
              <StatCard icon={Heart} label="Likes" value={formatNum(likes)} color="pink" />
              <StatCard icon={CreditCard} label="Cards" value={cards.length} color="emerald" />
            </div>

            <div className="grid grid-cols-4 gap-4 mb-8">
              <StatCard icon={MousePointer} label="Card Clicks" value={formatNum(userInfo?.cardsClicks || 0)} color="orange" />
              <StatCard icon={Users} label="New Followers" value={formatNum(userInfo?.gainedFollowers || 0)} color="cyan" />
              <StatCard icon={Eye} label="Profile Views" value={formatNum(userInfo?.profileViews || 0)} color="violet" />
              <StatCard icon={Clock} label="Watch Time" value={formatTime(watchTime)} color="amber" />
            </div>

            {/* My Videos */}
            <div className="bg-[#1a1a1a] rounded-2xl p-6">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Play className="w-5 h-5" />
                My Videos
              </h2>
              <div className="space-y-1">
                {videos.length === 0 ? (
                  <p className="text-[#666] py-4">No videos yet. <Link href="/upload" className="text-blue hover:underline">Create your first video</Link></p>
                ) : (
                  videos.map((video, i) => (
                    <Link
                      key={i}
                      href={`/myvideo/${video._id}`}
                      className="flex items-center justify-between py-3 px-4 rounded-xl hover:bg-white/5 transition-colors group"
                    >
                      <span className="font-medium group-hover:text-blue transition-colors">{video.title}</span>
                      <div className="flex items-center gap-6 text-sm text-[#888]">
                        <span className="flex items-center gap-1">
                          <Eye className="w-4 h-4" /> {formatNum(video.views)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Heart className="w-4 h-4" /> {formatNum(video.likes)}
                        </span>
                        <span className="flex items-center gap-1">
                          <CreditCard className="w-4 h-4" /> {video.card}
                        </span>
                      </div>
                    </Link>
                  ))
                )}
              </div>
            </div>

            {/* My Cards */}
            {cards.length > 0 && (
              <div className="bg-[#1a1a1a] rounded-2xl p-6 mt-6">
                <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  My Cards
                </h2>
                <div className="space-y-1">
                  {cards.slice(0, 10).map((card, i) => (
                    <a
                      key={i}
                      href={card.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between py-3 px-4 rounded-xl hover:bg-white/5 transition-colors group"
                    >
                      <div>
                        <span className="font-medium group-hover:text-blue transition-colors">{card.name}</span>
                        <span className="text-[#666] text-sm ml-2">in {card.title}</span>
                      </div>
                      <div className="flex items-center gap-6 text-sm text-[#888]">
                        <span className="flex items-center gap-1">
                          <MousePointer className="w-4 h-4" /> {formatNum(card.clicks)} clicks
                        </span>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* Viewer View */}
        {tab === "viewer" && (
          <div className="grid grid-cols-3 gap-4">
            <StatCard icon={Heart} label="Liked Videos" value={userInfoViewer?.likeVideos || 0} color="pink" />
            <StatCard icon={MousePointer} label="Card Clicks" value={formatNum(userInfoViewer?.cardsClicks || 0)} color="orange" />
            <StatCard icon={CreditCard} label="Saved Cards" value={userInfoViewer?.savedCards || 0} color="emerald" />
          </div>
        )}

        {/* Admin View */}
        {tab === "admin" && (
          <>
            <div className="grid grid-cols-4 gap-4 mb-8">
              <StatCard icon={Users} label="Visitors" value={formatNum(totalInfo?.visitors || 0)} color="blue" />
              <StatCard icon={TrendingUp} label="Signups" value={formatNum(totalInfo?.signups || 0)} color="emerald" />
              <StatCard icon={Play} label="Videos" value={formatNum(totalInfo?.videos || 0)} color="purple" />
              <StatCard icon={CreditCard} label="Cards" value={formatNum(totalInfo?.cards || 0)} color="orange" />
            </div>

            <div className="grid grid-cols-4 gap-4 mb-8">
              <StatCard icon={Eye} label="Video Views" value={formatNum(totalInfo?.videoViews || 0)} color="pink" />
              <StatCard icon={MousePointer} label="Card Clicks" value={formatNum(totalInfo?.cardClicks || 0)} color="cyan" />
              <StatCard icon={Clock} label="User Avg Time" value={formatTime(totalInfo?.usersAvgTime || 0)} color="amber" />
              <StatCard icon={Clock} label="Visitor Avg Time" value={formatTime(totalInfo?.visitorsAvgTime || 0)} color="violet" />
            </div>

            {/* Users Table */}
            <div className="bg-[#1a1a1a] rounded-2xl p-6">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Users className="w-5 h-5" />
                Users
              </h2>
              <div className="space-y-1">
                {users.map((user, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between py-3 px-4 rounded-xl hover:bg-white/5 transition-colors"
                  >
                    <div>
                      <span className="font-medium">{user.email}</span>
                      <span className={`ml-3 text-xs px-2 py-0.5 rounded-full ${
                        user.status === "active" ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400"
                      }`}>
                        {user.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-6 text-sm text-[#888]">
                      <span>{user.videos} videos</span>
                      <span>{user.cards} cards</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DashboardDesktop;
