"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import type ReactPlayerClass from "react-player";
import Footer from "@/app/_components/layout/desktop/footer";
import { getUploadData, setUploadData } from "@/utils/uploadStorage";
import { errorModal } from "@/utils/confirm";

const ReactPlayer = dynamic(() => import("react-player/lazy"), {
  ssr: false,
}) as unknown as typeof ReactPlayerClass;

const Step2Info = () => {
  const router = useRouter();
  const videoRef = useRef<ReactPlayerClass | null>(null);
  const [videoLink, setVideoLink] = useState("");
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [description, setDescription] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);
  const [isVertical, setIsVertical] = useState(false);

  useEffect(() => {
    const data = getUploadData();
    if (!data.videoLink) {
      // No video uploaded, redirect back to step 1
      router.push("/upload");
      return;
    }
    setVideoLink(data.videoLink);
    setTitle(data.title || "");
    setDetails(data.info || "");
    setDescription(data.description || "");
    setIsLoaded(true);
  }, [router]);

  const handleNext = () => {
    if (!title.trim()) {
      return errorModal("Please enter a title for your video.");
    }
    if (!details.trim()) {
      return errorModal("Please enter some details about your video.");
    }

    setUploadData({
      title: title.trim(),
      info: details.trim(),
      description: description.trim(),
      step: 3,
    });
    router.push("/upload/cards");
  };

  const handleBack = () => {
    // Save current progress before going back
    setUploadData({
      title: title.trim(),
      info: details.trim(),
      description: description.trim(),
    });
    router.push("/upload");
  };

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue"></div>
      </div>
    );
  }

  return (
    <main className="mx-[20px] md:mx-[50px] lg:mx-[90px] pt-[100px]">
      {/* Progress indicator */}
      <div className="flex items-center justify-center gap-4 mb-[60px]">
        <div className="flex items-center gap-2 opacity-60">
          <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white font-bold">✓</div>
          <span>Upload</span>
        </div>
        <div className="w-16 h-[2px] bg-green-500" />
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-blue flex items-center justify-center text-white font-bold">2</div>
          <span className="font-semibold">Info</span>
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

      <h1 className="text-[32px] font-bold mb-[40px] text-center">Add Video Information</h1>

      <div className="flex flex-wrap gap-[40px]">
        {/* Video Preview */}
        <div className={`mx-auto lg:mx-0 ${isVertical ? "w-[225px]" : "w-full max-w-[400px]"}`}>
          <div className={`rounded-[15px] overflow-hidden bg-[#1E1E1E] ${isVertical ? "aspect-[9/16]" : "aspect-video"}`}>
            <ReactPlayer
              ref={videoRef}
              url={videoLink}
              width="100%"
              height="100%"
              controls
              onReady={() => {
                if (videoRef.current) {
                  const player = videoRef.current.getInternalPlayer();
                  if (player && player.videoWidth && player.videoHeight) {
                    setIsVertical(player.videoHeight > player.videoWidth);
                  }
                  setTimeout(() => {
                    if (player && player.videoWidth && player.videoHeight) {
                      setIsVertical(player.videoHeight > player.videoWidth);
                    }
                  }, 500);
                }
              }}
              config={{
                youtube: {
                  playerVars: {
                    rel: 0,
                    modestbranding: 1,
                  },
                },
                file: {
                  attributes: {
                    style: {
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                    },
                  },
                },
              }}
            />
          </div>
          <p className="text-[#888] text-[12px] mt-2 text-center">Video Preview</p>
        </div>

        {/* Form */}
        <div className="flex-1 min-w-[300px] space-y-[30px]">
          {/* Title */}
          <div>
            <label className="block text-[16px] font-semibold mb-2">
              TITLE <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter a catchy title for your video"
              maxLength={100}
              className="w-full h-[50px] bg-[#1E1E1E] border-[3px] border-[#505050] rounded-[10px] px-4 text-[18px] focus:border-[#888] focus:outline-none placeholder:text-[#505050]"
            />
            <p className="text-[#888] text-[12px] mt-1 text-right">{title.length}/100</p>
          </div>

          {/* Details */}
          <div>
            <label className="block text-[16px] font-semibold mb-2">
              DETAILS <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Brief details about your video (shown in cards)"
              maxLength={150}
              className="w-full h-[50px] bg-[#1E1E1E] border-[3px] border-[#505050] rounded-[10px] px-4 text-[18px] focus:border-[#888] focus:outline-none placeholder:text-[#505050]"
            />
            <p className="text-[#888] text-[12px] mt-1 text-right">{details.length}/150</p>
          </div>

          {/* Description */}
          <div>
            <label className="block text-[16px] font-semibold mb-2">
              DESCRIPTION <span className="text-[#888]">(optional)</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add a longer description for your video..."
              maxLength={500}
              rows={4}
              className="w-full bg-[#1E1E1E] border-[3px] border-[#505050] rounded-[10px] px-4 py-3 text-[16px] focus:border-[#888] focus:outline-none placeholder:text-[#505050] resize-none"
            />
            <p className="text-[#888] text-[12px] mt-1 text-right">{description.length}/500</p>
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-[50px] mb-[100px]">
        <button
          onClick={handleBack}
          className="border-[2px] border-white px-[40px] py-[12px] rounded-[10px] text-[20px] font-semibold hover:bg-white hover:text-black transition-colors"
        >
          Back
        </button>
        <button
          onClick={handleNext}
          disabled={!title.trim() || !details.trim()}
          className="bg-blue px-[40px] py-[12px] rounded-[10px] text-[20px] font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          NEXT: Add Cards
        </button>
      </div>

      <Footer isFixed={false} />
    </main>
  );
};

export default Step2Info;
