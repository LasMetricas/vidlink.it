import Footer from "@/app/_components/layout/desktop/footer";
import { UserInfoType, VideoType } from "../../../page";
import UserInfo from "./userInfo";
import Videos from "./videos";
import useVerifyAuth from "@/hooks/useVerifyAuth";
import { RelatedUser } from "../../page";
import RelatedUsers from "./relatedUsers";

interface Type {
  setFollowStatus(value: boolean): void;
  userVideos: VideoType[];
  userInfo: UserInfoType | null;
  followStatus: boolean;
  relatedUsers: RelatedUser[] | null;
}
const ProfilesDesktop: React.FC<Type> = ({
  setFollowStatus,
  userVideos,
  userInfo,
  followStatus,
  relatedUsers,
}) => {
  const { isAuth } = useVerifyAuth();
  return (
    <>
      <div className="flex flex-col justify-between min-h-screen ">
        <main className=" mt-[109px] mb-[175px] mx-[70px]">
          <div className="">
            <UserInfo
              setFollowStatus={setFollowStatus}
              isAuth={isAuth}
              picture={userInfo?.picture}
              followers={userInfo?.followers}
              following={userInfo?.following}
              bio={userInfo?.bio}
              userName={userInfo?.userName}
              instagram={userInfo?.instagram}
              tiktok={userInfo?.tiktok}
              email={userInfo?.email}
              userId={userInfo?._id}
              followStatus={followStatus}
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
          <Videos videos={userVideos?.slice()?.reverse()} />
          {/* </div> */}
          <RelatedUsers relatedUsers={relatedUsers} />
        </main>
        <Footer isFixed={false} />
      </div>
    </>
  );
};
export default ProfilesDesktop;
