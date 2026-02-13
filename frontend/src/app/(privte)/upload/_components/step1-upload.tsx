"use client";
import { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ReactPlayer from "react-player";
import { Link, CheckCircle, XCircle, Trash2 } from "lucide-react";
import Footer from "@/app/_components/layout/desktop/footer";
import { Video } from "@/app/_components/ui/video";
import { useVideoValidate } from "@/hooks/useVideoValidate";
import { setUploadData, getUploadData, clearUploadData } from "@/utils/uploadStorage";
import { errorModal } from "@/utils/confirm";

const supportedPlatforms = [
  { name: "YouTube", supported: true },
  { name: "Vimeo", supported: true },
  { name: "Dailymotion", supported: true },
];

const unsupportedPlatforms = [
  { name: "TikTok", supported: false },
  { name: "Instagram", supported: false },
];

const Step1Upload = () => {
  const router = useRouter();
  const videoRef = useRef<ReactPlayer>(null);
  const { validateVideo, cancelVideo, error, videoSrc, uploadedFile, fileDuration, isVertical: fileIsVertical } = useVideoValidate();

  const [url, setUrl] = useState("");
  const [linkDuration, setLinkDuration] = useState<number | null>(null);
  const [isValidLink, setIsValidLink] = useState<boolean | null>(null);
  const [ytErr, setYtError] = useState<string>("");
  const [isVertical, setIsVertical] = useState<boolean>(false);

  // Load existing data on mount
  useEffect(() => {
    const data = getUploadData();
    if (data.videoLink && !data.videoLink.startsWith("blob:")) {
      setUrl(data.videoLink);
    }
    if (data.isVertical !== undefined) {
      setIsVertical(data.isVertical);
    }
  }, []);

  const isUnsupportedUrl = url && (url.includes("tiktok.com") || url.includes("instagram.com"));

  const handleAutoPaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setUrl(text);
    } catch (error) {
      console.error("Failed to read clipboard:", error);
    }
  };

  const handleNext = () => {
    if (videoSrc && url) {
      return errorModal("Please choose either a link OR a file, not both.");
    }

    if (videoSrc && uploadedFile) {
      // File upload - clear old data and start fresh
      clearUploadData();
      setUploadData({
        videoLink: videoSrc,
        duration: fileDuration,
        step: 2,
        isVertical: fileIsVertical,
        // Reset other fields to ensure clean state
        title: "",
        description: "",
        info: "",
        cards: [],
      });
      // Store file reference in sessionStorage for this session
      sessionStorage.setItem("vidlink_upload_file", "true");
      router.push("/upload/info");
    } else if (url) {
      if (isValidLink === null) {
        return errorModal("Please wait for the video to load.");
      }
      if (ytErr === "101" || ytErr === "150") {
        return errorModal(
          "This YouTube video disables embedding. Please try uploading it as a file or use another video URL."
        );
      }
      if (!isValidLink || !linkDuration || linkDuration <= 0) {
        return errorModal("Invalid video link.");
      }
      // Check if this is a different video URL than before
      const existingData = getUploadData();
      if (existingData.videoLink !== url) {
        // New video - clear old data and start fresh
        clearUploadData();
        setUploadData({
          videoLink: url,
          duration: linkDuration,
          step: 2,
          isVertical: isVertical,
          title: "",
          description: "",
          info: "",
          cards: [],
        });
      } else {
        // Same video - keep existing data
        setUploadData({
          videoLink: url,
          duration: linkDuration,
          step: 2,
          isVertical: isVertical,
        });
      }
      router.push("/upload/info");
    } else {
      return errorModal("Please enter a video link or upload a file.");
    }
  };

  const handleClear = () => {
    cancelVideo();
    setUrl("");
    clearUploadData();
  };

  return (
    <>
      {/* Background Video */}
      <div className="h-full w-full fixed left-0 top-0 -z-10">
        <Video src="/video/main.mp4" />
        <div className="absolute inset-0 bg-black/60" />
      </div>

      {/* Hidden player to validate link */}
      <ReactPlayer
        ref={videoRef}
        url={url}
        style={{ display: "none" }}
        onDuration={(duration) => {
          setLinkDuration(duration);
          setIsValidLink(duration > 0);
        }}
        onReady={() => {
          // Try to detect vertical video from ReactPlayer internal player
          const player = videoRef.current?.getInternalPlayer();
          if (player) {
            // For HTML5 video element
            if (player.videoWidth && player.videoHeight) {
              setIsVertical(player.videoHeight > player.videoWidth);
            }
            // For YouTube iframe - check aspect ratio from iframe dimensions
            else if (player.getVideoData) {
              // YouTube API - we can't directly get dimensions, assume horizontal by default
              setIsVertical(false);
            }
          }
        }}
        onError={(e) => {
          setYtError(e);
          setIsValidLink(false);
        }}
      />

      <main className="mx-[20px] md:mx-[50px] lg:mx-[90px] pt-[100px]">
        {/* Hero Headline */}
        <h1 className="text-[28px] md:text-[36px] lg:text-[42px] font-bold text-center mb-[50px] max-w-[800px] mx-auto leading-tight">
          Your video + smart cards = a richer experience for viewers, more value for you.
        </h1>

        {/* Progress indicator */}
        <div className="flex items-center justify-center gap-4 mb-[60px]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-blue flex items-center justify-center text-white font-bold">1</div>
            <span className="font-semibold">Upload</span>
          </div>
          <div className="w-16 h-[2px] bg-[#505050]" />
          <div className="flex items-center gap-2 opacity-40">
            <div className="w-8 h-8 rounded-full bg-[#505050] flex items-center justify-center">2</div>
            <span>Info</span>
          </div>
          <div className="w-16 h-[2px] bg-[#505050]" />
          <div className="flex items-center gap-2 opacity-40">
            <div className="w-8 h-8 rounded-full bg-[#505050] flex items-center justify-center">3</div>
            <span>Cards</span>
          </div>
          <div className="w-16 h-[2px] bg-[#505050]" />
          <div className="flex items-center gap-2 opacity-40">
            <div className="w-8 h-8 rounded-full bg-[#505050] flex items-center justify-center">4</div>
            <span>Preview</span>
          </div>
        </div>

        <h1 className="text-[32px] font-bold mb-[40px] text-center">Upload Your Video</h1>

        {/* Link Upload */}
        <div className="h-[200px] flex flex-col justify-center gap-4 relative bg-[#1E1E1E] rounded-[23px] px-[30px]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-[7px] pl-1">
              <div className="text-[19px] font-semibold mb-[1.8px]">LINK</div>
              <button onClick={handleAutoPaste}>
                <Link className="size-[17px]" />
              </button>
            </div>
            <div className="flex gap-4 text-[12px]">
              {supportedPlatforms.map((p) => (
                <span key={p.name} className="flex items-center gap-1 text-[#888]">
                  <CheckCircle className="size-[12px] text-green-500" />
                  {p.name}
                </span>
              ))}
              {unsupportedPlatforms.map((p) => (
                <span key={p.name} className="flex items-center gap-1 text-[#888]">
                  <XCircle className="size-[12px] text-red-500" />
                  {p.name}
                </span>
              ))}
            </div>
          </div>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value.trim())}
            placeholder="Paste YouTube, Vimeo, or other supported link"
            disabled={!!videoSrc}
            className={`h-[73px] text-[25px] flex items-center w-full bg-[#1E1E1E] border-[6px] focus:border-[#888] focus:outline-none rounded-[20px] placeholder:text-[20px] placeholder:text-[#505050] placeholder:font-semibold px-[19px] disabled:opacity-50 ${
              isUnsupportedUrl ? "border-red-500" : "border-[#505050]"
            }`}
          />
          {isUnsupportedUrl && (
            <p className="text-red-400 text-[13px] -mt-2">
              TikTok & Instagram links don't support embedding. Please download the video and upload the file below.
            </p>
          )}
          <span className="text-[19px] font-semibold absolute -bottom-[40px] left-[50%] -translate-x-[50%]">
            OR
          </span>
        </div>

        {/* File Upload */}
        <div className="h-[200px] flex justify-center items-center rounded-[23px] bg-[#1E1E1E] mt-[70px] relative">
          {!error ? (
            <>
              <label htmlFor="upload" className="cursor-pointer">
                <div
                  className={`${
                    videoSrc ? "opacity-0" : "opacity-100"
                  } gap-[8px] duration-500 flex flex-col items-center`}
                >
                  <img
                    className="size-[50px]"
                    src="/icon/desktop/upload/file.png"
                    loading="eager"
                    alt=""
                  />
                  <div className="border-[2px] border-white rounded-[5px] text-[20px] font-semibold px-[5px]">
                    BROWSE FILE
                  </div>
                  <p className="text-[12px] text-[#888] mt-1 text-center">
                    For TikTok or Instagram, download the video first and upload here
                  </p>
                </div>
                <img
                  className={`${
                    videoSrc ? "opacity-100" : "opacity-0"
                  } size-[100px] duration-1000 absolute top-1/2 -translate-y-1/2 right-1/2 translate-x-1/2`}
                  src="/icon/desktop/upload/checked.png"
                  alt=""
                />
              </label>
            </>
          ) : (
            <div className="flex flex-col items-center gap-[14px]">
              <img className="size-[50px]" src="/icon/desktop/upload/error.png" alt="" />
              <div className="flex flex-col items-center text-[#EA003B] font-semibold">
                <span className="text-[20px]">ERROR</span>
                <p className="text-center text-[14px] max-w-[300px]">{error}</p>
              </div>
            </div>
          )}
          <input
            className="hidden"
            id="upload"
            type="file"
            accept="video/mp4, video/mov, video/wmv, video/flv, video/avi"
            disabled={!!url}
            onChange={(e) => {
              validateVideo(e);
              e.target.value = "";
            }}
          />
          {(videoSrc || error) && (
            <button onClick={handleClear} className="absolute right-7 top-7">
              <Trash2 />
            </button>
          )}
        </div>

        {/* Next Button */}
        <div className="flex justify-end mt-[50px]">
          <button
            onClick={handleNext}
            disabled={!videoSrc && !url}
            className="bg-blue px-[40px] py-[12px] rounded-[10px] text-[20px] font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            NEXT: Add Info
          </button>
        </div>

        {/* Demo Video Section */}
        <div className="mt-[80px] mb-[100px]">
          <h2 className="text-[24px] font-bold text-center mb-[30px]">See How It Works</h2>
          <div className="w-full max-w-[800px] mx-auto rounded-[20px] overflow-hidden bg-[#1E1E1E]">
            <video
              className="w-full aspect-video object-contain"
              src="/video/demo.mp4"
              controls
              poster="/icon/desktop/upload/demo-poster.png"
            >
              Your browser does not support the video tag.
            </video>
          </div>
          <p className="text-[#888] text-[14px] text-center mt-4">
            Add interactive cards to your videos and share them with the world
          </p>
        </div>

        <Footer isFixed={false} />
      </main>
    </>
  );
};

export default Step1Upload;
