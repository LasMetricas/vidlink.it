import { createImage } from "@/utils/createImage";
type CropArea = {
  x: number;
  y: number;
  width: number;
  height: number;
};
export default async function getCroppedImg(
  imageSrc: string,
  crop: CropArea,
  rotation: number = 0
): Promise<Blob | null> {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    console.error("Failed to get 2D context");
    return null;
  }

  const radian = (rotation * Math.PI) / 180; // Convert degrees to radians

  // Set canvas size for rotated image
  const safeWidth =
    Math.abs(image.width * Math.cos(radian)) + Math.abs(image.height * Math.sin(radian));
  const safeHeight =
    Math.abs(image.width * Math.sin(radian)) + Math.abs(image.height * Math.cos(radian));

  canvas.width = safeWidth;
  canvas.height = safeHeight;

  // Center origin for rotation
  ctx.translate(safeWidth / 2, safeHeight / 2);
  ctx.rotate(radian);
  ctx.drawImage(image, -image.width / 2, -image.height / 2);

  // New canvas for final cropped image
  const croppedCanvas = document.createElement("canvas");
  const croppedCtx = croppedCanvas.getContext("2d");

  if (!croppedCtx) {
    console.error("Failed to get 2D context for cropped canvas");
    return null;
  }

  croppedCanvas.width = crop.width;
  croppedCanvas.height = crop.height;

  // Extract cropped portion from rotated image
  croppedCtx.drawImage(
    canvas,
    crop.x,
    crop.y,
    crop.width,
    crop.height,
    0,
    0,
    crop.width,
    crop.height
  );

  return new Promise<Blob | null>((resolve) => {
    croppedCanvas.toBlob((blob) => {
      resolve(blob);
    }, "image/jpeg");
  });
}
