"use client";

import { useLayoutEffect, useState } from "react";
import UserInfo from "./creator/userInfo";
import Download from "./download";
import Viewer from "./viewer";
import { CardType, UserInfoType, VideoType } from "../../page";
import useVideo from "@/hooks/useVideo";
import { errorModal } from "@/utils/confirm";
import FooterDesktop from "@/app/_components/layout/desktop/footer";
import TotalStats from "./creator/totalStats";
import Analytics from "./creator/analytics";
import LoadingMiddle from "@/app/_components/ui/loading";
import SiteAnalytics from "./admin/siteAnalytics";
import UserAnalytics from "./admin/userAnalytics";
import ErrorManagement from "./admin/errorManagement";

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
const DashboardMobile: React.FC<Type> = ({
  setUserInfo,
  setVideos,
  setCards,
  userInfo,
  videos,
  cards,
}) => {
  const { getDataCreator, getDataViewer, getDataAdmin, loading } = useVideo();
  const [user, setUser] = useState<string>("creator");
  const [period, setPeriod] = useState<string>("year");
  const [userInfoViewer, setUserInfoViewer] =
    useState<UserInfoViewer | null>(null);
  const [views, setViews] = useState<number>(0);
  const [likes, setLikes] = useState<number>(0);
  const [watchTime, setWatchTime] = useState<number>(0);
  const [users, setUsers] = useState<User[]>([]);
  const [totalInfo, setTotalInfo] = useState<TotalInfo | null>(null);
  const [videoViewsChartData, setVideoViewsChartData] = useState<{
    labels: string[];
    values: number[];
  } | null>(null);
  const [cardClicksChartData, setCardClicksChartData] = useState<{
    labels: string[];
    values: number[];
  } | null>(null);
  const [signupsChartData, setSignupsChartData] = useState<{
    labels: string[];
    values: number[];
  } | null>(null);
  const [visitorsChartData, setVisitorsChartData] = useState<{
    labels: string[];
    values: number[];
  } | null>(null);
  const [adminVideoViewsChartData, setAdminVideoViewsChartData] = useState<{
    labels: string[];
    values: number[];
  } | null>(null);
  const [adminCardClicksChartData, setAdminCardClicksChartData] = useState<{
    labels: string[];
    values: number[];
  } | null>(null);

  useLayoutEffect(() => {
    (async () => {
      if (user === "creator") {
        const res = await getDataCreator(period);
        if (
          res.status === 200 &&
          "userInfo" in res &&
          "videos" in res &&
          "cards" in res
        ) {
          setUserInfo(res.userInfo);
          setVideos(res.videos);
          setCards(res.cards);
          setVideoViewsChartData(res.videoViewsChartData || null);
          setCardClicksChartData(res.cardClicksChartData || null);
          // Calculate stats from the response data directly, not from state
          let likes = 0;
          let views = 0;
          let watchTime = 0;
          for (let i = 0; i < res.videos.length; i++) {
            likes += res.videos[i].likes;
            views += res.videos[i].views;
            watchTime += res.videos[i].watchTime;
          }
          setLikes(likes);
          setViews(views);
          setWatchTime(watchTime);
        } else {
          errorModal(res.message || "Something went wrong");
        }
      } else if (user === "admin") {
        const res = await getDataAdmin(period);
        if (res.status === 200 && "totalInfo" in res && "users" in res) {
          setTotalInfo(res.totalInfo);
          setUsers(res.users);
          setSignupsChartData(res.signupsChartData || null);
          setVisitorsChartData(res.visitorsChartData || null);
          setAdminVideoViewsChartData(res.videoViewsChartData || null);
          setAdminCardClicksChartData(res.cardClicksChartData || null);
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
  }, [period, user]);
  // Recalculate stats when videos change (backup in case of any timing issues)
  useLayoutEffect(() => {
    if (user === "creator" && videos.length > 0) {
      let likes = 0;
      let views = 0;
      let watchTime = 0;
      for (let i = 0; i < videos.length; i++) {
        likes += videos[i].likes;
        views += videos[i].views;
        watchTime += videos[i].watchTime;
      }
      setLikes(likes);
      setViews(views);
      setWatchTime(watchTime);
    }
  }, [videos, user]);

  if (loading) return <LoadingMiddle />;

  return (
    <>
      <div className="min-h-screen flex flex-col justify-between">
        <main className="mt-[125px] px-[47px]">
          <UserInfo
            setUser={setUser}
            setPeriod={setPeriod}
            user={user}
            period={period}
            picture={userInfo?.picture}
            userName={userInfo?.userName}
            isAdmin={userInfo?.isAdmin}
          />
          {user === "creator" ? (
            <>
              <TotalStats
                totalVideos={videos.length ?? 0}
                totalCards={cards.length ?? 0}
                videoViews={views ?? 0}
                videoLikes={likes ?? 0}
                cardClicks={userInfo?.cardsClicks ?? 0}
                newFollowers={userInfo?.gainedFollowers ?? 0}
                totalShares={0}
                profileViews={userInfo?.profileViews ?? 0}
                bestVideo={videos[0]}
                videoViewsChartData={videoViewsChartData}
                cardClicksChartData={cardClicksChartData}
                period={period}
              />
              <Analytics videos={videos} cards={cards} />
            </>
          ) : user === "admin" ? (
            <>
              <SiteAnalytics
                visitors={totalInfo?.visitors ?? 0}
                cardClicks={totalInfo?.cardClicks ?? 0}
                videoViews={totalInfo?.videoViews ?? 0}
                signups={totalInfo?.signups ?? 0}
                videos={totalInfo?.videos ?? 0}
                userAvgTime={totalInfo?.usersAvgTime ?? 0}
                cards={totalInfo?.cards ?? 0}
                visitorAvgTime={totalInfo?.visitorsAvgTime ?? 0}            
                signupsChartData={signupsChartData}
                visitorsChartData={visitorsChartData}
                videoViewsChartData={adminVideoViewsChartData}
                cardClicksChartData={adminCardClicksChartData}
                period={period}
              />
              <UserAnalytics users={users} />
              <ErrorManagement />
            </>
          ) : (
            <Viewer userInfo={userInfoViewer} bestVideo={videos[0]} />
          )}
          <Download
            name={period}
            user={user}
            userInfo={userInfo}
            userInfoViewer={userInfoViewer}
            videos={videos}
            cards={cards}
            views={views}
            likes={likes}
            watchTime={watchTime}
            totalInfo={totalInfo}
            users={users}
            signupsChartData={signupsChartData}
            visitorsChartData={visitorsChartData}
            videoViewsChartData={user === "creator" ? videoViewsChartData : adminVideoViewsChartData}
            cardClicksChartData={user === "creator" ? cardClicksChartData : adminCardClicksChartData}
          />
        </main>
        <FooterDesktop isFixed={false} />
      </div>
    </>
  );
};
export default DashboardMobile;
