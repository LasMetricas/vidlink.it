"use client";
import { isMobile } from "react-device-detect";
import MobileHeader from "../mobile/header";
import DesktopHeader from "../desktop/header";

const HeaderProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      {isMobile ? <MobileHeader/> : <DesktopHeader />}
      {children}
    </>
  );
};
export default HeaderProvider;
