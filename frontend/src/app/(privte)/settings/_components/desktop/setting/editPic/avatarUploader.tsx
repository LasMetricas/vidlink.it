"use client";

import React, { useState, useCallback } from "react";
import Cropper from "react-easy-crop";

interface AvatarCropperProps {
    imageSrc: string;
    onSave: (croppedImage: File) => void;
    onCancel: () => void;
}

const AvatarCropper: React.FC<AvatarCropperProps> = ({ imageSrc, onSave, onCancel }) => {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [rotation, setRotation] = useState(0);

    const getCroppedImg = useCallback(async () => {
        if (!imageSrc) return;
        const image = await createImage(imageSrc);
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        if (!ctx) return;

        const size = 150; // Avatar size 150x150
        canvas.width = size;
        canvas.height = size;

        ctx.drawImage(image, 0, 0, size, size);

        return new Promise<File>((resolve) => {
            canvas.toBlob((blob) => {
                if (blob) {
                    resolve(new File([blob], "avatar.jpg", { type: "image/jpeg" }));
                }
            }, "image/jpeg");
        });
    }, [imageSrc]);

    const handleSave = async () => {
        const croppedImage = await getCroppedImg();
        if (croppedImage) {
            onSave(croppedImage);
        }
    };

    return (
        <div className="relative w-64 h-64 bg-black">
            <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                rotation={rotation}
                aspect={1}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onRotationChange={setRotation}
            />
            <div className="flex gap-4 mt-2">
                <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={handleSave}>
                    Save
                </button>
                <button className="bg-red-500 text-white px-4 py-2 rounded" onClick={onCancel}>
                    Cancel
                </button>
            </div>
        </div>
    );
};

// Helper function to load an image
const createImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
        const image = new Image();
        image.crossOrigin = "anonymous";
        image.src = url;
        image.onload = () => resolve(image);
        image.onerror = reject;
    });

export default AvatarCropper;
