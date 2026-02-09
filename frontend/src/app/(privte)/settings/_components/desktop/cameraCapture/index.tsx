"use client";
import { useEffect, useRef, useState } from "react";
import { CircleDot, LogOut, SwitchCamera } from "lucide-react";

interface Type {
  setEdit(value: string): void;
  setImgBase64(value: string): void;
}

const CameraCapture: React.FC<Type> = ({
  setEdit,
  setImgBase64,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [isFrontCamera, setIsFrontCamera] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Ensure component runs only in the browser
  useEffect(() => {
    setIsClient(typeof window !== "undefined" && !!navigator?.mediaDevices);
  }, []);

  const startCamera = async (facingMode: "user" | "environment") => {
    if (!isClient || !navigator?.mediaDevices) {
      console.error("Camera API is not supported.");
      return;
    }

    try {
      // Stop previous stream if it exists
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }

      const newStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = newStream;
      }

      streamRef.current = newStream;
    } catch (error) {
      console.error("Error accessing camera:", error);
    }
  };

  const capturePhoto = async () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    if (context) {
      // Match canvas size to video resolution
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Convert to Base64
      const base64Image = canvas.toDataURL("image/png");
      setImgBase64(base64Image);
      setEdit("process");
    }
  };

  const toggleCamera = () => {
    const newFacingMode = isFrontCamera ? "environment" : "user";
    setIsFrontCamera(!isFrontCamera);
    startCamera(newFacingMode);
  };

  // Start camera when the component mounts
  useEffect(() => {
    if (isClient) {
      startCamera("environment");
    }
    return () => {
      // Cleanup: Stop camera when the component unmounts
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isClient]);

  return (
    <div className="h-screen relative w-screen ">
      {isClient ? (
        <>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="h-[100vh] w-full object-cover"
          ></video>
          <div className="flex items-center  rounded-full px-5 py-1 gap-5 absolute bottom-[70px] left-1/2 -translate-x-1/2">
            <button onClick={toggleCamera}>
              <SwitchCamera className="size-7" />
            </button>
            <button onClick={capturePhoto}>
              <CircleDot className="size-14 text-blue" />
            </button>
            <button onClick={() => setEdit("")}>
              <LogOut className="size-7" />
            </button>
          </div>
          <canvas ref={canvasRef} className="hidden" />
        </>
      ) : (
        <></>
      )}
    </div>
  );
};

export default CameraCapture;
