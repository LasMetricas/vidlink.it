"use client";
import AmountItem from "./amountItem";
import SocialLinks from "./socialLinks";
import useVideo from "@/hooks/useVideo";
import { errorModal } from "@/utils/confirm";

interface Type {
  setFollowStatus(value: boolean): void;
  isAuth: boolean;
  picture?: string | null;
  followers?: number | null;
  following?: number | null;
  bio?: string | null;
  userName?: string | null;
  instagram?: string | null;
  tiktok?: string | null;
  email?: string | null;
  userId?: string | null;
  followStatus: boolean;
}

const Profile: React.FC<Type> = ({
  setFollowStatus,
  isAuth,
  picture,
  followers,
  following,
  bio,
  userName,
  instagram,
  tiktok,
  email,
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
    <div className="w-full flex flex-col lg:flex-row items-center gap-[45px] font-semibold">
      {/* Profile Picture */}
      <img
        src={picture || "/image/profile/avatar.png"}
        alt="profile"
        width={294}
        height={294}
        className="rounded-full w-[294px] h-[294px] object-cover shrink-0"
        loading="eager"
        referrerPolicy="no-referrer"
      />

      {/* Info Section */}
      <div className="flex flex-col text-white flex-1">
        {/* Username and Stats */}
        <div className="flex items-center gap-[43px]">
          <h1 className="text-[33px] font-bold mb-2 uppercase">
            {userName ? `@${userName}` : "NO USERNAME"}
          </h1>
          <button
            onClick={handleFollow}
            className="w-[130px] h-[42px] py-[3px] text-[20px] font-semibold rounded-[4px] flex justify-center items-center tracking-wider transition duration-300 bg-blue hover:bg-[#0052cc]"
          >
            {followStatus ? "FOLLOWED" : "FOLLOW"}
          </button>
          <AmountItem amount={followers ?? 0} label="FOLLOWERS" />
          <AmountItem amount={following ?? 0} label="FOLLOWING" />
        </div>

        {/* Bio */}
        <p className="max-w-[680px] text-[16px] text-justify w-[700px] leading-relaxed my-[32px] font-normal">
          <span className="font-semibold">DESCRIPTION / BIO </span>
          {bio ?? "NO BIO"}
        </p>

        {/* Social Icons */}
        <SocialLinks
          instagram={instagram || ""}
          tiktok={tiktok || ""}
          email={email || ""}
        />
      </div>
    </div>
  );
};

export default Profile;
