"use client";
import FooterMobile from "@/app/_components/layout/mobile/footer";
import Video from "../../../_components/mobile/videos";
import SocialLinks from "./socialLinks";
import useVerifyAuth from "@/hooks/useVerifyAuth";
import { VideoType } from "../../../page";
import { UserInfoType } from "../../../page";
import UserInfo from "./userInfo";

interface Type {
  setFollowStatus(value: boolean): void;
  userVideos: VideoType[];
  userInfo: UserInfoType | null;
  followStatus: boolean;
}
const ProfilesMobile: React.FC<Type> = ({
  setFollowStatus,
  userVideos,
  userInfo,
  followStatus,
}) => {
  const { isAuth } = useVerifyAuth();

  return (
    <>
      <div className="flex flex-col justify-between min-h-screen">
        <main className="mt-[109px] ">
          <UserInfo
            setFollowStatus={setFollowStatus}
            isAuth={isAuth}
            picture={userInfo?.picture}
            totalVideos={userInfo?.totalVideos}
            totalCards={userInfo?.totalCards}
            followers={userInfo?.followers}
            userId={userInfo?._id}
            followStatus={followStatus}
          />
          <SocialLinks
            isAuth={isAuth}
            instagram={userInfo?.instagram || ""}
            tiktok={userInfo?.tiktok || ""}
            email={userInfo?.email || ""}
          />
          <div className="mx-[10px] mt-[9px] mb-[76px]">
            <Video
              myVideos={userVideos?.slice()?.reverse()}
              totalVideos={userInfo?.totalVideos}
            />
          </div>
        </main>
        <FooterMobile isFixed={false} />
      </div>
    </>
  );
};
export default ProfilesMobile;
