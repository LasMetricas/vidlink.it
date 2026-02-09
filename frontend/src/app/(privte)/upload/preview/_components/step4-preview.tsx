"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import type ReactPlayerClass from "react-player";
import { useAtom } from "jotai";
import Footer from "@/app/_components/layout/desktop/footer";
import { getUploadData, clearUploadData } from "@/utils/uploadStorage";
import { cardAtom, CardType } from "@/store";
import { errorModal, successModal } from "@/utils/confirm";
import useVerifyAuth from "@/hooks/useVerifyAuth";
import useVideo from "@/hooks/useVideo";

const ReactPlayer = dynamic(() => import("react-player/lazy"), {
  ssr: false,
}) as unknown as typeof ReactPlayerClass;

const Step4Preview = () => {
  const router = useRouter();
  const videoRef = useRef<ReactPlayerClass | null>(null);
  const [cards] = useAtom<CardType[]>(cardAtom);
  const { isAuth, loading: authLoading } = useVerifyAuth();
  const { publish, storeVideoFile, loading, uploadProgress } = useVideo();

  const [videoLink, setVideoLink] = useState("");
  const [duration, setDuration] = useState(0);
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [description, setDescription] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [activeCard, setActiveCard] = useState<CardType | null>(null);
  const [isPublishing, setIsPublishing] = useState(false);

  useEffect(() => {
    const data = getUploadData();
    if (!data.videoLink || !data.title || !data.cards || data.cards.length === 0) {
      router.push("/upload");
      return;
    }

    // Check if blob URL is still valid (for file uploads)
    if (data.videoLink.startsWith("blob:")) {
      fetch(data.videoLink)
        .then((res) => {
          if (!res.ok) {
            throw new Error("Blob URL invalid");
          }
          setVideoLink(data.videoLink);
          setDuration(data.duration || 0);
          setTitle(data.title);
          setDetails(data.info || "");
          setDescription(data.description || "");
          setIsLoaded(true);
        })
        .catch(() => {
          // Blob URL is invalid (page was refreshed), redirect to step 1
          errorModal("Your video session expired. Please re-upload your video.");
          router.push("/upload");
        });
    } else {
      setVideoLink(data.videoLink);
      setDuration(data.duration || 0);
      setTitle(data.title);
      setDetails(data.info || "");
      setDescription(data.description || "");
      setIsLoaded(true);
    }
  }, [router]);

  const onProgress = (state: { playedSeconds: number }) => {
    const time = Math.floor(state.playedSeconds);
    setCurrentTime(time);

    // Find active card based on current time
    const cardsData = getUploadData().cards || [];
    const currentCard = cardsData
      .filter((card) => card.start <= time)
      .sort((a, b) => b.start - a.start)[0];

    if (currentCard && (!activeCard || activeCard.start !== currentCard.start)) {
      setActiveCard(currentCard as CardType);
    } else if (!currentCard) {
      setActiveCard(null);
    }
  };

  const handlePublish = async () => {
    // Check if user is authenticated
    if (authLoading) return;

    if (!isAuth) {
      // Store current URL to return after login
      sessionStorage.setItem("vidlink_return_url", "/upload/preview");
      router.push("/login");
      return;
    }

    setIsPublishing(true);

    try {
      let finalVideoLink = videoLink;

      // If video is a blob URL, we need to upload to S3 first
      if (videoLink.startsWith("blob:")) {
        // Fetch the blob and convert to File
        const response = await fetch(videoLink);
        const blob = await response.blob();
        const file = new File([blob], "video.mp4", { type: blob.type || "video/mp4" });

        const formData = new FormData();
        formData.append("file", file);

        const uploadRes = await storeVideoFile(formData);
        if ("videoLink" in uploadRes && uploadRes.videoLink) {
          finalVideoLink = uploadRes.videoLink;
        } else {
          errorModal(uploadRes.message || "Failed to upload video");
          setIsPublishing(false);
          return;
        }
      }

      // Prepare cards data
      const cardsData = getUploadData().cards.map((card) => ({
        ...card,
        isSaved: false,
      }));

      // Create FormData for publish
      const formData = new FormData();
      formData.append("videoLink", finalVideoLink);
      formData.append("duration", String(duration));
      formData.append("title", title);
      formData.append("description", description);
      formData.append("info", details);
      formData.append("cards", JSON.stringify(cardsData));

      const res = await publish(formData, "new", "");

      if ("videoId" in res && res.videoId) {
        successModal("Video published successfully!");
        clearUploadData();
        router.push(`/video/${res.videoId}`);
      } else {
        errorModal(res.message || "Failed to publish video");
      }
    } catch (error) {
      console.error("Publish error:", error);
      errorModal("An error occurred while publishing");
    } finally {
      setIsPublishing(false);
    }
  };

  const handleBack = () => {
    router.push("/upload/cards");
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins < 10 ? `0${mins}` : mins}:${secs < 10 ? `0${secs}` : secs}`;
  };

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue"></div>
      </div>
    );
  }

  const uploadData = getUploadData();
  const cardsToShow = uploadData.cards || [];

  return (
    <main className="mx-[20px] md:mx-[50px] lg:mx-[90px] pt-[100px]">
      {/* Progress indicator */}
      <div className="flex items-center justify-center gap-4 mb-[60px]">
        <div className="flex items-center gap-2 opacity-60">
          <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white font-bold">✓</div>
          <span>Upload</span>
        </div>
        <div className="w-16 h-[2px] bg-green-500" />
        <div className="flex items-center gap-2 opacity-60">
          <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white font-bold">✓</div>
          <span>Info</span>
        </div>
        <div className="w-16 h-[2px] bg-green-500" />
        <div className="flex items-center gap-2 opacity-60">
          <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white font-bold">✓</div>
          <span>Cards</span>
        </div>
        <div className="w-16 h-[2px] bg-green-500" />
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-blue flex items-center justify-center text-white font-bold">4</div>
          <span className="font-semibold">Preview</span>
        </div>
      </div>

      <h1 className="text-[32px] font-bold mb-[40px] text-center">Preview Your Video</h1>

      <div className="flex flex-wrap gap-[40px]">
        {/* Video Player with Card Overlay */}
        <div className="w-full max-w-[600px] mx-auto lg:mx-0">
          <div className="relative aspect-video rounded-[15px] overflow-hidden bg-[#1E1E1E]">
            <ReactPlayer
              ref={videoRef}
              url={videoLink}
              width="100%"
              height="100%"
              controls
              playing={playing}
              onProgress={onProgress}
              onPlay={() => setPlaying(true)}
              onPause={() => setPlaying(false)}
            />
            {/* Active Card Overlay */}
            {activeCard && (
              <div className="absolute bottom-[60px] left-4 right-4">
                <div className="bg-black/80 backdrop-blur-sm rounded-[10px] p-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-blue flex items-center justify-center text-[12px] font-bold">
                      {activeCard.no}
                    </span>
                    <span className="font-semibold text-[14px]">{activeCard.name}</span>
                  </div>
                  <a
                    href={activeCard.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-blue px-4 py-1 rounded-[6px] text-[12px] font-semibold hover:bg-blue/80"
                  >
                    Visit
                  </a>
                </div>
              </div>
            )}
          </div>
          <p className="text-[#888] text-[14px] mt-2 text-center">
            Current time: <span className="text-white font-bold">{formatTime(currentTime)}</span>
          </p>
        </div>

        {/* Video Info & Cards Summary */}
        <div className="flex-1 min-w-[280px]">
          {/* Video Info */}
          <div className="bg-[#1E1E1E] rounded-[15px] p-6 mb-6">
            <h2 className="text-[24px] font-bold mb-2">{title}</h2>
            <p className="text-[#888] text-[14px] mb-4">{details}</p>
            {description && (
              <p className="text-[#aaa] text-[14px] whitespace-pre-wrap">{description}</p>
            )}
          </div>

          {/* Cards Summary */}
          <div className="bg-[#1E1E1E] rounded-[15px] p-6">
            <h3 className="font-semibold mb-4">Cards ({cardsToShow.length})</h3>
            <div className="grid grid-cols-3 gap-3 max-h-[320px] overflow-y-auto">
              {cardsToShow.map((card, index) => {
                const colors = [
                  "bg-gradient-to-br from-purple-500 to-purple-700",
                  "bg-gradient-to-br from-blue-500 to-blue-700",
                  "bg-gradient-to-br from-green-500 to-green-700",
                  "bg-gradient-to-br from-orange-500 to-orange-700",
                  "bg-gradient-to-br from-pink-500 to-pink-700",
                  "bg-gradient-to-br from-teal-500 to-teal-700",
                  "bg-gradient-to-br from-red-500 to-red-700",
                  "bg-gradient-to-br from-indigo-500 to-indigo-700",
                ];
                const cardColor = colors[index % colors.length];
                const isActive = activeCard?.start === card.start;

                return (
                  <div
                    key={index}
                    className={`aspect-square rounded-[12px] p-3 flex flex-col justify-between transition-all ${cardColor} ${
                      isActive ? "ring-2 ring-white ring-offset-2 ring-offset-[#1E1E1E] scale-105" : ""
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <span className="w-7 h-7 rounded-full bg-black/30 flex items-center justify-center text-[12px] font-bold">
                        {card.no}
                      </span>
                      <span className="text-[11px] bg-black/30 px-2 py-1 rounded-full">
                        {formatTime(card.start)}
                      </span>
                    </div>
                    <div>
                      <p className="text-[13px] font-semibold leading-tight line-clamp-2">{card.name}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Auth Status */}
          {!authLoading && !isAuth && (
            <div className="mt-4 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-[10px]">
              <p className="text-yellow-500 text-[14px]">
                You need to sign in to publish your video. Click &quot;Publish&quot; to continue.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Publishing Progress */}
      {isPublishing && (
        <div className="mt-6">
          <div className="bg-[#1E1E1E] rounded-[15px] p-6">
            <p className="text-center mb-4">
              {uploadProgress < 100 ? "Uploading video..." : "Publishing..."}
            </p>
            <div className="w-full h-2 bg-[#2a2a2a] rounded-full overflow-hidden">
              <div
                className="h-full bg-blue transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
            <p className="text-center text-[#888] text-[14px] mt-2">{uploadProgress}%</p>
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-[50px] mb-[100px]">
        <button
          onClick={handleBack}
          disabled={isPublishing}
          className="border-[2px] border-white px-[40px] py-[12px] rounded-[10px] text-[20px] font-semibold hover:bg-white hover:text-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Back
        </button>
        <button
          onClick={handlePublish}
          disabled={isPublishing || loading}
          className="bg-green-500 px-[40px] py-[12px] rounded-[10px] text-[20px] font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-green-600 transition-colors"
        >
          {isPublishing ? "Publishing..." : isAuth ? "Publish" : "Sign in & Publish"}
        </button>
      </div>

      <Footer isFixed={false} />
    </main>
  );
};

export default Step4Preview;
