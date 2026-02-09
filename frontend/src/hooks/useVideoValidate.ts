import { useState } from "react";

export function useVideoValidate() {
  const [error, setError] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const [duration, setDuration] = useState<number>(0);

  function validateVideo(e: React.ChangeEvent<HTMLInputElement>) {
    setError(""); // Reset error at the beginning
    setFile(null);

    const file = e.target.files?.[0];
    if (!file) return;

    const allowedFormats = [
      "video/mp4",
      "video/mov",
      "video/wmv",
      "video/flv",
      "video/avi",
    ];
    const maxSize = 50 * 1024 * 1024; // 50MB

    if (!allowedFormats.includes(file.type)) {
      setError(
        "Invalid file format! Please upload MP4, MOV, WMV, FLV, or AVI."
      );
      return;
    }

    if (file.size > maxSize) {
      setError("File size exceeds 50MB limit.");
      return;
    }

    // Revoke the old URL before setting a new one
    if (videoSrc) {
      URL.revokeObjectURL(videoSrc);
    }

    const newSrc = URL.createObjectURL(file);
    setVideoSrc(newSrc);

    const video = document.createElement("video");
    video.preload = "metadata";
    video.src = newSrc;

    video.onloadedmetadata = () => {
      if (video.duration > 240) {
        setError("Video duration exceeds 4 minutes limit.");
        setVideoSrc(null);
        URL.revokeObjectURL(newSrc);
        return;
      }
      setDuration(video.duration);
      setFile(file);
    };
  }
  // Cancel local video
  const cancelVideo = () => {
    setFile(null);
    setVideoSrc("");
    setError("");
  };

  return {
    validateVideo,
    cancelVideo,
    error,
    uploadedFile: file,
    videoSrc,
    fileDuration: duration,
  };
}
