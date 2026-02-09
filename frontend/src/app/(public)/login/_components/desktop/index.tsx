"use client";
import Footer from "@/app/_components/layout/desktop/footer";
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
import { basicBold } from "@/style/fonts/fonts";
import { errorModal, successModal } from "@/utils/confirm";

const LoginDesktop = () => {
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
          <Video src="/video/main.mp4" />
        </div>
        <div className="mb-[34px] flex flex-col gap-[62px] items-center font-sans">
          <h1
            className={`${basicBold.className} text-[112px] w-full text-center max-[393px]:text-[82px] mb-[-28px] uppercase`}
          >
            welcome to
          </h1>
          <Image
            height={86}
            width={569}
            className=""
            src="/icon/desktop/register/logo.png"
            alt=""
            loading="eager"
            priority
          />
          <div className="flex flex-col items-center gap-[20px]">
            <button
              onClick={handleSignin}
              type="submit"
              className="bg-blue rounded-[12px] uppercase text-[29px] w-[531px] h-[79px] tracking-wider flex flex-wrap items-center gap-[12px] justify-center"
            >
              LOG IN WITH GOOGLE
              <Image
                width={30}
                height={30}
                className="size-[30px]"
                src="/icon/desktop/register/google.png"
                alt=""
                loading="eager"
                priority
              />
            </button>
          </div>
        </div>
      </main>
      <Footer isFixed={true} />
    </>
  );
};
export default LoginDesktop;
