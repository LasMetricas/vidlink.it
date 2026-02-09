"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import MobileHeader from "../mobile/header";
import DesktopHeader from "../desktop/header";

const HeaderProvider = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Mobile home page has its own header
  const isHomePage = pathname === "/";
  const showHeader = !(isMobile && isHomePage);

  return (
    <>
      {showHeader && (isMobile ? <MobileHeader /> : <DesktopHeader />)}
      {children}
    </>
  );
};
export default HeaderProvider;
