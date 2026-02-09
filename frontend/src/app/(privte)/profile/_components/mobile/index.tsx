"use client";
import FooterMobile from "@/app/_components/layout/mobile/footer";
import NavItem from "./navItem";
import { Suspense, useState } from "react";
import SocialLinks from "./socialLinks";
import Link from "next/link";
import dynamic from "next/dynamic";
import Loading from "@/app/_components/ui/loading";
import { UserInfoType, VideoType } from "../../page";
import Videos from "./videos";
import UserInfo from "./userInfo";
import { CirclePlus } from "lucide-react";
const Card = dynamic(() => import("./card"));
const Likes = dynamic(() => import("./likes"));

interface Type {
  myVideos: VideoType[];
  myLikesVideos: VideoType[];
  userInfo: UserInfoType | null;
}
const ProfileMobile: React.FC<Type> = ({
  myVideos,
  myLikesVideos,
  userInfo,
}) => {
  const [nav, setNav] = useState<string>("videos");
  return (
    <>
      <div className="flex flex-col justify-between min-h-screen">
        <main className=" mt-[109px]">
          <div className="">
            <UserInfo
              picture={userInfo?.picture}
              totalVideos={userInfo?.totalVideos}
              totalCards={userInfo?.totalCards}
              followers={userInfo?.followers}
              bio={userInfo?.bio}
            />
            <SocialLinks
              instagram={userInfo?.instagram}
              tiktok={userInfo?.tiktok}
            />
            <Link
              href={"/upload"}
              className="flex flex-col items-center gap-[7px] text-[10.5px] font-semibold mt-[97px]"
            >
              <div className="size-[48px]">
                {/* <Image
                  width={48}
                  height={48}
                  src="/icon/profile/plus.png"
                  alt=""
                  loading="eager"
                /> */}
                <CirclePlus className="size-[44px]"/>
              </div>
              <span>NEW VIDEO</span>
            </Link>
          </div>
          <div className="mx-[11px] mt-[45px] overflow-hidden mb-[120px] min-h-[75vh]">
            <nav className="flex justify-between relative">
              <NavItem name="videos" nav={nav} setNav={setNav} />
              <NavItem name="cards" nav={nav} setNav={setNav} />
              <NavItem name="likes" nav={nav} setNav={setNav} />
              <div className="border-[0.5px] absolute bottom-[1px] left-0 w-full -z-10"></div>
            </nav>
            {nav === "videos" ? (
              <Videos
                myVideos={myVideos?.slice()?.reverse()}
                totalVideos={userInfo?.totalVideos}
              />
            ) : nav === "cards" ? (
              <Suspense fallback={<Loading />}>
                <Card nav={nav} />
              </Suspense>
            ) : (
              <Suspense fallback={<Loading />}>
                <Likes myLikesVideos={myLikesVideos} />
              </Suspense>
            )}
          </div>
        </main>
        <FooterMobile isFixed={false} />
      </div>
    </>
  );
};
export default ProfileMobile;
