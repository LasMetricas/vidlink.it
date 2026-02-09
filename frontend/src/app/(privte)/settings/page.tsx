"use client";
import { isMobile } from "react-device-detect";
import dynamic from "next/dynamic";
import { useLayoutEffect, useState } from "react";
import useVideo from "@/hooks/useVideo";
import Loading from "@/app/_components/ui/loading";
import { errorModal } from "@/utils/confirm";

const SettingsMobile = dynamic(() => import("./_components/mobile"));
const SettingsDesktop = dynamic(() => import("./_components/desktop"));

export interface UserInfoType {
  userName: string;
  picture: string;
  gender: string;
  bio: string;
  instagram: string;
  tiktok: string;
  youtube: string;
  linkedin: string;
}
const Page = () => {
  const { loading, getUserInfo } = useVideo();
  const [userInfo, setUserInfo] = useState<UserInfoType | null>(null);
  useLayoutEffect(() => {
    const fetchFunction = async () => {
      const res = await getUserInfo();
      if (res.status === 200 && "userInfo" in res) {
        setUserInfo(res.userInfo);
      } else {
        errorModal(res.message || "Something went wrong");
      }
    };
    fetchFunction();
  }, []);
  if (loading) return <Loading />;
  return (
    <>
      {isMobile ? (
        <SettingsMobile userInfo={userInfo} />
      ) : (
        <SettingsDesktop userInfo={userInfo} />
      )}
    </>
  );
};
export default Page;
