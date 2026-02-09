"use client";
import Footer from "@/app/_components/layout/desktop/footer";
import { ChangeEvent, useRef, useState } from "react";
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
import { errorModal } from "@/utils/confirm";

interface Type {
  validateVideo(value: ChangeEvent<HTMLInputElement>): void;
  setVideoLink(value: string): void;
  setEdit(value: string): void;
  setUrl(value: string): void;
  cancelVideo(): void;
  setDuration(value: number): void;
  setFile(value: File): void;
  setTitle(value: string): void;
  setDescription(value: string): void;
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
  setFile,
  setTitle,
  setDescription,
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
  const [linkDuration, setLinkDuration] = useState<number | null>(null);
  const [isValidLink, setIsValidLink] = useState<boolean | null>(null);
  const [ytErr, setYtError] = useState<string>('')
  const router = useRouter();

  const handleNext = async () => {
    // Allow users to try the tool without login - auth check moved to publish step
    if (videoSrc && url) {
      return errorModal("Please input one of them.");
    } else if (videoSrc && uploadedFile) {
      // Use local preview for now - S3 upload happens at publish time
      setVideoLink(videoSrc);
      setDuration(fileDuration);
      setFile(uploadedFile);
    } else if (url) {
      if (isValidLink === null) {
        return errorModal("Please wait for the video to load.");
      }
      console.log(ytErr, 'yeterrro')
      if (ytErr == '101' || ytErr == '150') {
        return errorModal(
          "This YouTube video disables embedding\n" +
          "Please try to upload it as a file or provide another video URL."
        );
      }
      if (!isValidLink || !linkDuration || linkDuration <= 0) {
        return errorModal("Invalid video link.");
      }

      setDuration(linkDuration);
      setVideoLink(url);
    } else {
      return errorModal("Please enter a file or a link.");
    }
    setEdit("add");
    setCards([]);
    setTitle("");
    setDescription("");
    setInfo("");
  };

  return (
    <>
      <ReactPlayer
        ref={videoRef}
        url={url}
        style={{ display: "none" }}
        onDuration={(duration) => {
          setLinkDuration(duration);
          setIsValidLink(duration > 0);
        }}
        onError={(e) => {
          console.log(e, 'error')
          setYtError(e)
          setIsValidLink(false);
        }}
      />

      <main className="mx-[90px]">
        <LinkUpload setUrl={setUrl} url={url} />
        <FileUpload
          validateVideo={validateVideo}
          cancelVideo={cancelVideo}
          error={error}
          videoSrc={videoSrc}
          loading={loading}
        />
        <div className="flex items-center justify-between mt-[53px] mb-[111px]">
          <Description />
          <div className="w-[481px]">
            <ButtonItem
            handleNext={handleNext}
            error={error}
            videoSrc={videoSrc}
            url={url}
            loading={loading}
            />
            {loading && (
              <div className="mt-3 h-[8px] bg-[#1E1E1E] rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue transition-[width] duration-200 ease-linear"
                  style={{ width: `${Math.min(100, Math.max(0, uploadProgress))}%` }}
                />
              </div>
            )}
          </div>
        </div>
        <Footer isFixed={false} />
      </main>
    </>
  );
};
export default Upload;
