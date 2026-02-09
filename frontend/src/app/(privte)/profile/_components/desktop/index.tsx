import Footer from "@/app/_components/layout/desktop/footer";
import { UserInfoType, VideoType } from "../../page";
import UserInfo from "./userInfo";
import Videos from "./videos";

interface Type {
  myVideos: VideoType[];
  userInfo: UserInfoType | null;
}
const ProfileDesktop: React.FC<Type> = ({ myVideos, userInfo }) => {
  return (
    <>
      <div className="flex flex-col justify-between min-h-screen  ">
        <main className=" mt-[109px] mb-[141px] mx-[70px]">
          <div className="">
            <UserInfo
              picture={userInfo?.picture}
              followers={userInfo?.followers}
              following={userInfo?.following}
              bio={userInfo?.bio}
              userName={userInfo?.userName}
              instagram={userInfo?.instagram}
              tiktok={userInfo?.tiktok}
              email={userInfo?.email}
            />
          </div>
          <div className="flex items-center gap-[25px] text-[34px] font-semibold mt-[126px] mb-[65px]">
            <div className="flex items-center gap-3">
              <img
                className="size-[32px]"
                src="/icon/desktop/profile/play.png"
                alt=""
              />
              {userInfo?.totalVideos ?? 0}
            </div>
            <div className="flex items-center gap-3">
              <img
                className="size-[32px]"
                src="/icon/desktop/profile/sticker.png"
                alt=""
              />
              {userInfo?.totalCards ?? 0}
            </div>
          </div>
          {/* <div className="mt-[65px] overflow-hidden mb-[120px] min-h-[75vh]"> */}
          <Videos videos={myVideos?.slice()?.reverse()} />
          {/* </div> */}
        </main>
        <Footer isFixed={false} />
      </div>
    </>
  );
};
export default ProfileDesktop;
