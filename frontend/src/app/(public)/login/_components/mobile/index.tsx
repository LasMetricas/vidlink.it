"use client";
import Footer from "@/app/_components/layout/mobile/footer";
import useAuth from "@/hooks/useAuth";
import { tokenAtom } from "@/store";
import { getItem, removeItem, setItem } from "@/utils/localstorage";
import { useAtom } from "jotai";
import { useSession, signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Cookies from "js-cookie";
import { Video } from "@/app/_components/ui/video";
import Image from "next/image";
import { errorModal, successModal } from "@/utils/confirm";
import { logError } from "@/utils/errorHandler";

const LoginMobile = () => {
  const [token, setToken] = useAtom<boolean>(tokenAtom);
  const { login, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const returnTo = searchParams.get("returnTo");
  const { data: session, status } = useSession();
  const [isProcessing, setIsProcessing] = useState(false);
  const hasProcessedLogin = useRef(false);

  // Save returnTo param to localStorage when page loads (before OAuth redirect)
  useEffect(() => {
    if (returnTo) {
      localStorage.setItem("vidlink_return_url", returnTo);
    }
  }, [returnTo]);

  useEffect(() => {
    if (error) {
      errorModal("Your session has expired. Please sign in again.");
      router.replace(window.location.pathname);
    }
  }, [error]);

  // Handle post-OAuth login using useSession hook
  useEffect(() => {
    const processLogin = async () => {
      const isLogin = getItem("isLogin");

      console.log("[Login Debug]", {
        status,
        hasSession: !!session,
        hasIsLogin: !!isLogin,
        idToken: session?.idToken ? "exists" : "missing",
        hasProcessedLogin: hasProcessedLogin.current
      });

      // Wait for session to be authenticated and have the isLogin flag
      if (status === "authenticated" && session && isLogin && !hasProcessedLogin.current) {
        hasProcessedLogin.current = true;
        setIsProcessing(true);
        removeItem("isLogin");

        // Check if idToken exists
        if (!session.idToken) {
          console.warn("[Login] No idToken in session");
          errorModal("Login failed - please try again");
          setIsProcessing(false);
          return;
        }

        const res = await login(session.idToken);
        console.log("[Login] Backend response:", res);

        if ("token" in res) {
          if ("user" in res) {
            Cookies.set("user", JSON.stringify(res.user));
          }
          Cookies.set("token", res.token, { expires: 4 });
          setToken(!token);
          const returnUrl = localStorage.getItem("vidlink_return_url") || "/";
          localStorage.removeItem("vidlink_return_url");
          console.log("[Login] Redirecting to:", returnUrl);
          successModal(res.message, () => router.push(returnUrl));
        } else {
          const msg = logError("login", res);
          errorModal(res.message || msg);
        }
        setIsProcessing(false);
      }
    };

    processLogin();
  }, [session, status]);

  const handleSignin = async () => {
    if (loading || isProcessing || status === "loading") return;
    try {
      setItem("isLogin", true);
      // Redirect back to login after OAuth to complete the flow
      await signIn("google", { callbackUrl: "/login" });
    } catch (error) {
      const msg = logError("login", error, { provider: "google" });
      errorModal(msg);
    }
  };

  // Show loading state while session is being checked or login is processing
  const isLoading = status === "loading" || isProcessing;

  return (
    <>
      <main className="h-screen flex items-center justify-center">
        <div className="h-full w-full fixed left-0 top-0 -z-10">
          {process.env.NEXT_PUBLIC_PRODUCTION === "production" ? (
            <Video src="/video/sign.mp4" />
          ) : (
            <Video src="/video/home2.mp4" />
          )}
        </div>
        <div className="mb-[34px] flex flex-col gap-[40px] items-center font-sans">
          <Image
            height={55.4}
            width={356.54}
            className="h-[55.4px]"
            src="/icon/home/title.png"
            alt=""
            loading="eager"
            priority
          />
          <div className="flex flex-col items-center gap-[20px]">
            <button
              onClick={handleSignin}
              type="submit"
              disabled={isLoading}
              className={`flex items-center justify-center gap-[12.81px] bg-blue rounded-[12.81px] w-[309px] h-[48px] ${isLoading ? "opacity-70 cursor-not-allowed" : ""}`}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <h1 className="text-[16px] font-semibold pt-[3px]">SIGNING IN...</h1>
                </>
              ) : (
                <>
                  <h1 className="text-[16px] font-semibold pt-[3px]">LOG IN WITH GOOGLE</h1>
                  <Image
                    width={32}
                    height={32}
                    className="size-[32px]"
                    src="/icon/register/google.png"
                    alt=""
                    loading="eager"
                    priority
                  />
                </>
              )}
            </button>
          </div>
        </div>
      </main>
      <Footer isFixed={true} />
    </>
  );
};
export default LoginMobile;
