"use client";
import FooterMobile from "@/app/_components/layout/mobile/footer";
import { useEffect, useState } from "react";
import UserInfo from "./creator/userInfo";
import Filter from "./creator/filter";
import Videos from "./creator/videos";
import Cards from "./creator/cards";
import Total from "./creator/total";
import BtnGroup from "./btnGroup";
import Viewer from "./viewer";
import { CardType, UserInfoType, VideoType } from "../../page";
import useVideo from "@/hooks/useVideo";
import { errorModal } from "@/utils/confirm";

interface Type {
  setUserInfo(value: UserInfoType | null): void;
  setVideos(value: VideoType[]): void;
  setCards(value: CardType[]): void;
  userInfo: UserInfoType | null;
  videos: VideoType[];
  cards: CardType[];
}
export interface UserInfoViewerType {
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
  const { getDataCreator, getDataViewer } = useVideo();
  const [user, setUser] = useState<string>("creator");
  const [period, setPeriod] = useState<string>("year");
  const [userInfoViewer, setUserInfoViewer] =
    useState<UserInfoViewerType | null>(null);
  const [views, setViews] = useState<number>(0);
  const [likes, setLikes] = useState<number>(0);
  const [watchTime, setWatchTime] = useState<number>(0);

  useEffect(() => {
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
  return (
    <>
      <div className="min-h-screen flex flex-col justify-between">
        <main className="mt-[109px] px-[20px]">
          <UserInfo picture={userInfo?.picture} />
          <Filter
            setUser={setUser}
            setPeriod={setPeriod}
            user={user}
            period={period}
          />
          {user === "creator" ? (
            <>
              <Videos
                setViews={setViews}
                setLikes={setLikes}
                setWatchTime={setWatchTime}
                views={views}
                likes={likes}
                watchTime={watchTime}
                videos={videos}
              />
              <Cards cards={cards} />
              <Total userInfo={userInfo} cards={cards} />
            </>
          ) : (
            <Viewer userInfo={userInfoViewer} />
          )}
          <BtnGroup
            name={period}
            user={user}
            userInfo={userInfo}
            userInfoViewer={userInfoViewer}
            videos={videos}
            cards={cards}
            views={views}
            likes={likes}
            watchTime={watchTime}
          />
        </main>
        <FooterMobile isFixed={false} />
      </div>
    </>
  );
};
export default DashboardMobile;
