"use client";

import AmountItem from "../../../_components/mobile/userInfo/amountItem";
import useVideo from "@/hooks/useVideo";
import { errorModal } from "@/utils/confirm";

interface Type {
  setFollowStatus(value: boolean): void;
  isAuth: boolean;
  picture?: string | null;
  totalVideos?: number | null;
  totalCards?: number | null;
  followers?: number | null;
  userId?: string | null;
  followStatus: boolean;
}
const UserInfo: React.FC<Type> = ({
  setFollowStatus,
  isAuth,
  picture,
  totalVideos,
  totalCards,
  followers,
  userId,
  followStatus,
}) => {
  const { followUser, loading } = useVideo();
  const handleFollow = async () => {
    if (loading) return;
    if (isAuth && userId) {
      const res = await followUser(userId);
      if (res.status === 200 && "followStatus" in res) {
        setFollowStatus(res.followStatus);
      } else {
        errorModal(res.message || "Something went wrong");
      }
    } else {
      errorModal("You must log in before the following.");
    }
  };
  return (
    <>
      {picture && (
        <img
          className="size-[146px] rounded-full mx-auto"
          src={picture ? picture : "/icon/profile/avatar.png"}
          alt=""
        />
      )}
      <div className="h-[147.04.67px] mx-[91px] mt-[28px] mb-[28.33px]">
        <div className="flex justify-between mb-[21px]">
          <AmountItem number={followers || 0} label="FOLLOWING" />
          <AmountItem number={totalCards || 0} label="PROMPTS ADDED" />
          <AmountItem number={totalVideos || 0} label="VIDEOS" />
        </div>
        <div className="flex flex-col gap-[5.47px] ">
          <button
            onClick={handleFollow}
            className="h-[28.88px] bg-blue rounded-[4.97px] flex items-center justify-center text-[10.5px] font-semibold"
          >
            {followStatus ? "FOLLOWED" : "FOLLOW"}
          </button>
          {/* <button className="h-[28.88px] bg-[#002355] rounded-[4.97px] flex items-center justify-center text-[10.5px] font-semibold">
      SEND MESSAGE
    </button> */}
        </div>
      </div>
    </>
  );
};
export default UserInfo;
