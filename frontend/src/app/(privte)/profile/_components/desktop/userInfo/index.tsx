"use client";
import AmountItem from "./amountItem";
import Cookies from "js-cookie";
import { signOut } from "next-auth/react";
import NavBtn from "./navBtn";
import SocialLinks from "./socialLinks";

interface Type {
  picture?: string | null;
  followers?: number | null;
  following?: number | null;
  bio?: string | null;
  userName?: string | null;
  instagram?: string | null;
  tiktok?: string | null;
  email?: string | null;
}

const Profile: React.FC<Type> = ({
  picture,
  followers,
  following,
  bio,
  userName,
  instagram,
  tiktok,
  email,
}) => {
  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/login" });
    Cookies.remove("token");
    Cookies.remove("reqUrl");
    Cookies.remove("user");
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
          <AmountItem amount={followers ?? 0} label="FOLLOWERS" />
          <AmountItem amount={following ?? 0} label="FOLLOWING" />
        </div>

        {/* Bio */}
        <p className="max-w-[680px] text-[16px] text-justify w-[700px] leading-relaxed my-[32px] font-normal">
          <span className="font-semibold">DESCRIPTION / BIO </span>
          {bio ?? "NO BIO"}
        </p>

        {/* Buttons */}
        <div className="flex flex-wrap gap-[15px] mb-[32px]">
          <NavBtn
            name="SETTINGS"
            link="settings"
            className="hover:bg-[#9ea6b1] bg-[#B1B9C6]"
          />
          <NavBtn
            name="DASHBOARD"
            link="dashboard"
            className="hover:bg-[#0052cc] bg-blue"
          />
          <NavBtn
            name="DRAFTS"
            link="upload"
            className="hover:bg-[#0052cc] bg-blue"
          />
          <button
            onClick={handleSignOut}
            className="bg-[#002355] hover:bg-[#2d4363] transition duration-300 h-[42px] w-[150px] rounded-[4px] flex items-center py-[2px] justify-center text-[20px] uppercase"
          >
            LOGOUT
          </button>
        </div>

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
