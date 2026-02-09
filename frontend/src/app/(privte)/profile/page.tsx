"use client";

import Loading from "@/app/_components/ui/loading";
import useVideo from "@/hooks/useVideo";
import { errorModal } from "@/utils/confirm";
import dynamic from "next/dynamic";
import { Suspense, useLayoutEffect, useState } from "react";
import { isMobile } from "react-device-detect";
const ProfileMobile = dynamic(() => import("./_components/mobile"));
const ProfileDesktop = dynamic(() => import("./_components/desktop"));

export type UserInfoType = {
  _id: string;
  userName: string;
  picture: string;
  followers: number;
  following: number;
  totalVideos: number;
  totalCards: number;
  instagram: string;
  tiktok: string;
  youtube: string;
  linkedin: string;
  email?: string;
  bio: string;
};

export type VideoType = {
  _id: string;
  videoLink: string;
  title: string;
  info?: string;
  duration?: number;
  views?: number;
  card?: number;
  createdAt?: string;
};

const Page = () => {
  const { loading, getMyVideos } = useVideo();
  const [userInfo, setUserInfo] = useState<UserInfoType | null>(null);
  const [myVideos, setMyVideos] = useState<VideoType[]>([]);
  const [myLikesVideos, setMyLikesVideos] = useState<VideoType[]>([]);
  useLayoutEffect(() => {
    async function fetchMyVideos() {
      const res = await getMyVideos();
      if (
        res.status === 200 &&
        "userInfo" in res &&
        "myVideos" in res &&
        "myLikesVideos" in res
      ) {
        setMyVideos(res.myVideos);
        setMyLikesVideos(res.myLikesVideos);
        setUserInfo(res.userInfo);
      } else {
        errorModal(res.message || "Something went wrong");
      }
    }
    fetchMyVideos();
  }, []);
  if (loading) return <Loading />;
  return (
    <>
      {isMobile ? (
        <Suspense fallback={<Loading />}>
          <ProfileMobile
            myVideos={myVideos}
            myLikesVideos={myLikesVideos}
            userInfo={userInfo}
          />
        </Suspense>
      ) : (
        <Suspense fallback={<Loading />}>
          <ProfileDesktop myVideos={myVideos} userInfo={userInfo} />
        </Suspense>
      )}
    </>
  );
};
export default Page;
