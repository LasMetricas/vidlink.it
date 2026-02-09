"use client";
import { isMobile } from "react-device-detect";
import dynamic from "next/dynamic";
import { useParams } from "next/navigation";
import { Suspense, useLayoutEffect, useState } from "react";
import useVideo from "@/hooks/useVideo";
import { UserInfoType, VideoType } from "../page";
import Loading from "@/app/_components/ui/loading";
import { errorModal } from "@/utils/confirm";
const ProfilesMobile = dynamic(() => import("./_components/mobile"));
const ProfilesDesktop = dynamic(() => import("./_components/desktop"));

export type RelatedUser = {
  _id: string;
  userName: string;
  picture: string;
  totalVideos: number;
  followers: number;
  totalCards: number;
};

const Page = () => {
  const { getUserVideos, loading } = useVideo();
  const params = useParams();
  const userId: string | undefined = Array.isArray(params.userId)
    ? params.userId[0]
    : params.userId;
  const [userVideos, setUserVideos] = useState<VideoType[]>([]);
  const [userInfo, setUserInfo] = useState<UserInfoType | null>(null);
  const [relatedUsers, setRelatedUsers] = useState<RelatedUser[] | null>(null);
  const [followStatus, setFollowStatus] = useState<boolean>(false);

  useLayoutEffect(() => {
    if (!userId) return;
    const fetchVideos = async () => {
      const res = await getUserVideos(userId);
      if (
        res.status === 200 &&
        "userVideos" in res &&
        "userInfo" in res &&
        "relatedUsers" in res
      ) {
        setUserVideos(res.userVideos);
        setUserInfo(res.userInfo);
        setFollowStatus(res.followStatus);
        setRelatedUsers(res.relatedUsers);
      } else {
        errorModal(res.message || "Something went wrong");
      }
    };
    fetchVideos();
  }, []);
  if (loading) return <Loading />;
  return (
    <>
      {isMobile ? (
        <Suspense fallback={<Loading />}>
          <ProfilesMobile
            setFollowStatus={setFollowStatus}
            userVideos={userVideos}
            userInfo={userInfo}
            followStatus={followStatus}
          />
        </Suspense>
      ) : (
        <Suspense fallback={<Loading />}>
          <ProfilesDesktop
            setFollowStatus={setFollowStatus}
            userVideos={userVideos}
            userInfo={userInfo}
            followStatus={followStatus}
            relatedUsers={relatedUsers}
          />
        </Suspense>
      )}
    </>
  );
};
export default Page;
