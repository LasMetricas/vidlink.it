"use client";
import FooterMobile from "@/app/_components/layout/mobile/footer";
import { ChangeEvent, useRef } from "react";
import ReactPlayer from "react-player";
import Description from "./description";
import FileUpload from "./fileUpload";
import ButtonItem from "./buttonItem";
import LinkUpload from "./linkUpload";
import { useAtom } from "jotai";
import { cardAtom, CardType } from "@/store";
import useVideo from "@/hooks/useVideo";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { removeItem, setItem } from "@/utils/localstorage";
import { errorModal, successModal } from "@/utils/confirm";

interface Type {
  validateVideo(value: ChangeEvent<HTMLInputElement>): void;
  setVideoLink(value: string): void;
  setEdit(value: string): void;
  setUrl(value: string): void;
  cancelVideo(): void;
  setDuration(value: number): void;
  setFile(value: File): void;
  setTitle(value: string): void;
  // setUserName(value: string): void;
  setEditSignal(value: boolean): void;
  setInfo(valud: string): void;
  videoSrc: string | null;
  error: string;
  url: string;
  fileDuration: number;
  uploadedFile: File | null;
}
const Upload: React.FC<Type> = ({
  validateVideo,
  setVideoLink,
  setEdit,
  setUrl,
  cancelVideo,
  setDuration,
  // setFile,
  setTitle,
  // setUserName,
  // setEditSignal,
  setInfo,
  videoSrc,
  error,
  url,
  fileDuration,
  uploadedFile,
}) => {
  const videoRef = useRef<ReactPlayer>(null);
  const [, setCards] = useAtom<CardType[]>(cardAtom);
  const { getUserName, storeVideoFile, loading, uploadProgress } = useVideo();
  const router = useRouter();

  const handleNext = async () => {
    const res = await getUserName();
    if (res.status === 200 && "userName" in res) {
      if (res.userName.trim() === "") {
        errorModal("You must set a username before creating your first video.");
        Cookies.set("isUploadUrl", JSON.stringify(true), { expires: 1 });
        return router.push("/settings");
      }
      // else {
      //   setUserName(res.userName);
      // }
    } else {
      errorModal(res.message || "Something went wrong");
      return;
    }
    if (videoSrc && url) {
      return errorModal("Please input one of them.");
    } else if (videoSrc && uploadedFile) {
      // setVideoLink(videoSrc);
      // setDuration(fileDuration);
      // setFile(uploadedFile);
      const file = new FormData();
      file.append("file", uploadedFile);
      const res = await storeVideoFile(file);
      if (res.status === 200 && "videoLink" in res) {
        setVideoLink(res.videoLink);
        setDuration(fileDuration);
        setItem("onlineVideo", res.videoLink);
        setItem("duration", fileDuration);
      } else {
        errorModal(res.message || "Something went wrong");
        return;
      }
    } else if (url) {
      const linkDuration = videoRef.current?.getDuration();
      if (linkDuration === null || linkDuration === undefined) {
        return successModal(
          "Validating video... please wait a moment."
        );
      } else {
        setDuration(linkDuration);
        setVideoLink(url);
        setItem("onlineVideo", url);
        setItem("duration", linkDuration);
      }
    } else {
      return errorModal("Please enter a file or a link.");
    }
    setEdit("add");
    setCards([]);
    setTitle("");
    setInfo("");
    removeItem("cards");
    removeItem("title");
    setItem("editStatus", "add");
  };

  return (
    <>
      <ReactPlayer
        ref={videoRef}
        preload="metadata"
        url={url}
        style={{ display: "none" }}
      />
      <main className="">
        <LinkUpload setUrl={setUrl} url={url} />
        <FileUpload
          validateVideo={validateVideo}
          cancelVideo={cancelVideo}
          error={error}
          videoSrc={videoSrc}
        />
        <Description />
        <div className="w-[282.81px] mt-[88px] mb-[60px] mx-auto">
          <ButtonItem
            handleNext={handleNext}
            error={error}
            videoSrc={videoSrc}
            url={url}
            loading={loading}
          />
          {loading && (
            <div className="mt-3 h-[6px] bg-[#1E1E1E] rounded-full overflow-hidden">
              <div
                className="h-full bg-blue transition-[width] duration-200 ease-linear"
                style={{ width: `${Math.min(100, Math.max(0, uploadProgress))}%` }}
              />
            </div>
          )}
        </div>
        <FooterMobile isFixed={true} />
      </main>
    </>
  );
};
export default Upload;
