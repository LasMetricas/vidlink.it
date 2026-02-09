"use client";
import Footer from "@/app/_components/layout/mobile/footer";
import useAuth from "@/hooks/useAuth";
import { tokenAtom } from "@/store";
import { getItem, removeItem, setItem } from "@/utils/localstorage";
import { useAtom } from "jotai";
import { getSession, signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import Cookies from "js-cookie";
import { Video } from "@/app/_components/ui/video";
import Image from "next/image";
import { errorModal, successModal } from "@/utils/confirm";

const LoginMobile = () => {
  const [token, setToken] = useAtom<boolean>(tokenAtom);
  const { login, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  useEffect(() => {
    if (error) {
      errorModal("Your session has expired. Please sign in again.");
      router.replace(window.location.pathname);
    }
  }, [error]);

  //cutstomized sign in
  useEffect(() => {
    const fetchSession = async () => {
      const session = await getSession();
      const isLogin = getItem("isLogin");
      if (session && isLogin) {
        removeItem("isLogin");
        const res = await login(session.idToken);
        if ("token" in res) {
          if ("user" in res) {
            Cookies.set("user", JSON.stringify(res.user));
          }
          // Successfully authenticated and save token
          Cookies.set("token", res.token, { expires: 4 });
          setToken(!token);
          //check the there was request routing url
          const reqUrl = Cookies.get("reqUrl");
          Cookies.remove("reqUrl");
          successModal(res.message, () =>
            router.push(`${reqUrl ? `${reqUrl}` : "/"}`)
          );
        } else {
          // Authentication failed, handle error
          errorModal(res.message || "Something went wrong");
        }
      }
    };
    fetchSession();
  }, []);

  //google sign
  const handleSignin = async () => {
    // const isLogin = getItem("isLogin");
    if (loading) return;
    try {
      await signIn("google", { redirect: false });
      setItem("isLogin", true);
    } catch (error) {
      console.error("Failed google signup", error);
    }
  };
  return (
    <>
      <main className="h-screen flex items-center justify-center">
        <div className="h-full w-full fixed left-0 top-0 -z-10">
          {process.env.NEXT_PUBLIC_PRODUCTION === "production" ? (
            // <Video src="https://s3-figma-videos-production-sig.figma.com/video/1393144935889806437/TEAM/9fe5/9459/-c108-493f-88a8-fcd10d3d4970?Expires=1740355200&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=hHgGoRtCZGaKElyVbPFg0ik8pDoucX1nTEg1DK2kHG2zgLsDgMbqYJ8YQqFGiR5mtCCGnLCUK6BdgBtM6j6JV8jwdDN87vEYJMMAmC4T~OjfoRgCc7XhVUR4eCXdlfm6SNAd7vmoGoh~4CZRgM8zGUnbJ2oCXYCOWKGbmWUYFjJl0lL7UR7NqhFsWmZuNVLbtDeLYJOb2mCWSMzUGa2l5G8LoiGIoGJCOxtvrcZYVS8O9uDWHVG8TloBTxWDgt1EWhzV65EY46Wa8nAQzkob3Z6EjKIx8dccF~iyIF2Vf4tvAiCkBrn2tQkUGH3z-8JQiQwakRCg641y60S-bX5DuA__" />
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
              className="flex items-center justify-center gap-[12.81px] bg-blue rounded-[12.81px] w-[309px] h-[48px]"
            >
              <h1 className="text-[16px]  font-semibold pt-[3px]">
                LOG IN WITH GOOGLE
              </h1>
              <Image
                width={32}
                height={32}
                className="size-[32px]"
                src="/icon/register/google.png"
                alt=""
                loading="eager"
                priority
              />
            </button>
            {/* <div className="flex gap-[10px] text-[13px] tracking-wide">
              <h1 className="text-foreground">New to VIDLINK?</h1>
              <Link href={"/signup"} className="text-blue">
                Sign up
              </Link>
            </div> */}
          </div>
        </div>
      </main>
      <Footer isFixed={true} />
    </>
  );
};
export default LoginMobile;
