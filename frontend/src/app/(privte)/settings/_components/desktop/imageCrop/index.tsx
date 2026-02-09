import { useState } from "react";
import Cropper from "react-easy-crop";
import getCroppedImg from "@/utils/cropImage";
import { RotateCcw, RotateCw, ZoomIn, ZoomOut } from "lucide-react";

interface CropperProps {
  setEdit(value: string): void;
  setImgFile(value: File | null): void | null;
  setImgUrl(value: string): void;
  imgBase64: string;
}

export default function ImageCropper({
  setEdit,
  setImgUrl,
  setImgFile,
  imgBase64,
}: CropperProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0); // Rotation state
  type AreaPixels = {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<AreaPixels | null>(null);
  
  const handleCropComplete = (_: unknown, areaPixels: AreaPixels) => {
    setCroppedAreaPixels(areaPixels);
  };
  const handleSave = async () => {
    if (!croppedAreaPixels || !imgBase64) return;
    const blob = await getCroppedImg(imgBase64, croppedAreaPixels, rotation);
    if (!blob) return;
    const objectUrl = URL.createObjectURL(blob);
    const file = new File([blob], "avatar.png", { type: blob.type });
    setImgUrl(objectUrl);
    setImgFile(file);
    setEdit("");
  };

  const handleZoom = (value: number) => {
    if (value < 0 && zoom < 1) return;
    if (value > 0 && zoom > 3) return;
    setZoom((prev) => prev + value);
  };
  const handleRotate = (value: number) => {
    if (value < 0 && rotation < -180) return;
    if (value > 0 && rotation > 180) return;
    setRotation((prev) => prev + value);
  };

  return (
    <main className="relative h-screen w-screen ">
      {imgBase64 && (
        <div className="h-[80vh] w-full absolute top-0">
          <Cropper
            image={imgBase64}
            crop={crop}
            zoom={zoom}
            rotation={rotation} // Pass rotation state
            aspect={1}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onRotationChange={setRotation} // Update rotation state
            onCropComplete={handleCropComplete}
          />
        </div>
      )}
      <div className=" absolute bottom-0 right-0 left-0 h-[20vh] bg-[#050505]">
        <div className="flex gap-1 absolute bottom-[200px] left-1/2 -translate-x-1/2">
          <button onClick={() => handleZoom(-0.03)}>
            <ZoomOut className="size-5" />
          </button>
          <input
            className="w-[70vw]"
            type="range"
            min="1"
            max="3"
            step="0.1"
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
          />
          <button onClick={() => handleZoom(0.03)}>
            <ZoomIn className="size-5" />
          </button>
        </div>
        <div className="flex gap-1 absolute bottom-[150px] left-1/2 -translate-x-1/2">
          <button onClick={() => handleRotate(-1)}>
            <RotateCcw className="size-5" />
          </button>
          <input
            className=" w-[70vw]"
            type="range"
            min="-180"
            max="180"
            step="1"
            value={rotation}
            onChange={(e) => setRotation(Number(e.target.value))} // Adjust rotation
          />
          <button onClick={() => handleRotate(1)}>
            <RotateCw className="size-5" />
          </button>
        </div>
        <div className="absolute bottom-[80px] left-1/2 -translate-x-1/2 text-[20px] flex gap-3 bg-[#050505]">
          <button
            onClick={handleSave}
            className="bg-blue text-white pt-[2px] font-semibold tracking-widest h-[40px] w-[120px] flex justify-center items-center rounded-full"
          >
            SAVE
          </button>
          <button
            onClick={() => {
              setEdit("");
            }}
            className="border-[3px] border-white pt-[2px] text-white font-semibold tracking-widest h-[40px] w-[130px] flex justify-center items-center rounded-full"
          >
            CANCEL
          </button>
        </div>
      </div>
    </main>
  );
}
