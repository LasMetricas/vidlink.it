"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import type ReactPlayerClass from "react-player";
import { useAtom } from "jotai";
import Footer from "@/app/_components/layout/desktop/footer";
import { getUploadData, clearUploadData, setUploadData } from "@/utils/uploadStorage";
import { cardAtom, CardType } from "@/store";
import { errorModal, successModal } from "@/utils/confirm";
import useVerifyAuth from "@/hooks/useVerifyAuth";
import useVideo from "@/hooks/useVideo";
import Cookies from "js-cookie";
import { logError } from "@/utils/errorHandler";

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
  const [isVertical, setIsVertical] = useState(false);

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
          setIsVertical(data.isVertical || false);
          setIsLoaded(true);
        })
        .catch((err) => {
          // Blob URL is invalid (page was refreshed), redirect to step 1
          logError("session_expired", err, { reason: "blob_url_invalid" });
          errorModal("Your video session expired. Don't worry - just re-upload your video to continue.");
          router.push("/upload");
        });
    } else {
      setVideoLink(data.videoLink);
      setDuration(data.duration || 0);
      setTitle(data.title);
      setDetails(data.info || "");
      setDescription(data.description || "");
      setIsVertical(data.isVertical || false);
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

    // Card stays visible for 4 seconds after its start time
    if (currentCard && time - currentCard.start <= 4) {
      setActiveCard(currentCard as CardType);
    } else {
      setActiveCard(null);
    }
  };

  const handlePublish = async () => {
    // Check if user is authenticated
    if (authLoading) return;

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
          // Update storage with S3 URL so it persists through OAuth redirect
          setUploadData({ videoLink: finalVideoLink });
          setVideoLink(finalVideoLink);
        } else {
          const msg = logError("upload_video", uploadRes, { videoLink });
          errorModal(uploadRes.message || msg);
          setIsPublishing(false);
          return;
        }
      }

      // Now check authentication - video is already uploaded to S3 at this point
      if (!isAuth) {
        setIsPublishing(false);
        // Pass return URL directly in query string - most reliable
        router.push("/login?returnTo=/upload/preview");
        return;
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
      formData.append("isVertical", String(isVertical));

      const res = await publish(formData, "new", "");

      if ("videoId" in res && res.videoId) {
        successModal("Your video is live!");
        clearUploadData();
        router.push(`/videos`);
      } else {
        const msg = logError("publish_video", res, { title, cardsCount: cardsData.length });
        errorModal(res.message || msg);
      }
    } catch (error) {
      const msg = logError("publish_video", error, { title });
      errorModal(msg);
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
        <div className={`mx-auto lg:mx-0 ${isVertical ? "w-[320px]" : "w-full max-w-[600px]"}`}>
          <div className={`relative rounded-[15px] overflow-hidden bg-[#1E1E1E] ${isVertical ? "aspect-[9/16]" : "aspect-video"}`}>
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
              onReady={() => {
                if (videoRef.current) {
                  const player = videoRef.current.getInternalPlayer();
                  if (player && player.videoWidth && player.videoHeight) {
                    const vertical = player.videoHeight > player.videoWidth;
                    setIsVertical(vertical);
                    setUploadData({ isVertical: vertical });
                  }
                  setTimeout(() => {
                    if (player && player.videoWidth && player.videoHeight) {
                      const vertical = player.videoHeight > player.videoWidth;
                      setIsVertical(vertical);
                      setUploadData({ isVertical: vertical });
                    }
                  }, 500);
                }
              }}
              config={{
                youtube: { playerVars: { rel: 0, modestbranding: 1 } },
                file: {
                  attributes: {
                    style: { width: "100%", height: "100%", objectFit: "contain" },
                  },
                },
              }}
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

          {/* Cards - Only visible after their timecode */}
          <div className="bg-[#1E1E1E] rounded-[15px] p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-[15px]">Cards</h3>
              <span className="text-[13px] text-[#666]">
                {cardsToShow.filter(c => c.start <= currentTime).length} of {cardsToShow.length} revealed
              </span>
            </div>

            {cardsToShow.filter(c => c.start <= currentTime).length === 0 ? (
              <div className="text-center py-8 text-[#555]">
                <p className="text-[14px]">Play the video to reveal cards</p>
                <p className="text-[12px] mt-1">Cards appear at their timecode</p>
              </div>
            ) : (
              <div className="flex flex-wrap gap-6 max-h-[450px] overflow-y-auto p-2">
                {cardsToShow.filter(card => card.start <= currentTime).map((card, index) => {
                  const isActive = activeCard?.start === card.start;
                  const colors = [
                    "from-purple-500 to-purple-700",
                    "from-blue-500 to-blue-700",
                    "from-emerald-500 to-emerald-700",
                    "from-orange-500 to-orange-700",
                    "from-pink-500 to-pink-700",
                    "from-cyan-500 to-cyan-700",
                  ];
                  const colorClass = colors[index % colors.length];

                  // Extract domain for favicon
                  let favicon = "";
                  let domain = "";
                  try {
                    const url = new URL(card.link);
                    favicon = `https://www.google.com/s2/favicons?domain=${url.hostname}&sz=64`;
                    domain = url.hostname.replace('www.', '');
                  } catch {
                    favicon = "";
                    domain = "";
                  }

                  return (
                    <a
                      key={card.no}
                      href={card.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`relative block w-[140px] h-[140px] rounded-[16px] p-4 transition-all cursor-pointer bg-gradient-to-br ${colorClass} border-2 border-white/40 shadow-lg ${
                        isActive ? "border-white scale-105" : "hover:scale-105 hover:border-white/70 hover:shadow-xl"
                      }`}
                    >
                      {/* Card Number Badge */}
                      <span className="absolute top-3 left-3 w-7 h-7 rounded-full bg-white/25 flex items-center justify-center text-[12px] font-bold">
                        {card.no}
                      </span>

                      {/* NOW Badge */}
                      {isActive && (
                        <span className="absolute top-3 right-3 text-[9px] bg-white text-black px-2 py-0.5 rounded-full font-bold">
                          NOW
                        </span>
                      )}

                      {/* Timecode - Center */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-[18px] font-bold text-white/90 bg-black/30 px-2 py-1 rounded-lg">
                          {formatTime(card.start)}
                        </span>
                      </div>

                      {/* Card Content - Bottom aligned */}
                      <div className="absolute bottom-3 left-3 right-3">
                        {/* Favicon + Domain */}
                        <div className="flex items-center gap-1.5 mb-1">
                          {favicon ? (
                            <img
                              src={favicon}
                              alt=""
                              className="w-4 h-4 rounded"
                              onError={(e) => { e.currentTarget.style.display = 'none' }}
                            />
                          ) : (
                            <svg className="w-4 h-4 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                            </svg>
                          )}
                          {domain && (
                            <span className="text-[10px] text-white/70 truncate">{domain}</span>
                          )}
                        </div>

                        {/* Card Name */}
                        <p className="font-semibold text-[13px] leading-tight line-clamp-2">{card.name}</p>
                      </div>
                    </a>
                  );
                })}
              </div>
            )}
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

      {/* Publishing Progress - Centered Modal Overlay */}
      {isPublishing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="bg-[#1E1E1E] rounded-[20px] p-10 max-w-[400px] w-[90%] text-center">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-blue/20 flex items-center justify-center">
              <div className="w-10 h-10 border-4 border-blue border-t-transparent rounded-full animate-spin" />
            </div>
            <h3 className="text-[24px] font-bold mb-2">Be kind, we are uploading</h3>
            <p className="text-[#888] text-[16px] mb-6">
              {uploadProgress < 100 ? "Uploading your video..." : "Almost there, publishing..."}
            </p>
            <div className="w-full h-3 bg-[#2a2a2a] rounded-full overflow-hidden mb-3">
              <div
                className="h-full bg-gradient-to-r from-blue to-purple-500 transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
            <p className="text-[#888] text-[14px]">{uploadProgress}%</p>
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
