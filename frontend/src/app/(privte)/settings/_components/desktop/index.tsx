"use client";
import { Suspense, useState } from "react";
import { UserInfoType } from "../../page";
import Setting from "./setting";
import dynamic from "next/dynamic";
import Loading from "@/app/_components/ui/loading";
import FooterDesktop from "@/app/_components/layout/desktop/footer";
const CameraCapture = dynamic(() => import("./cameraCapture"));
const ImageCropper = dynamic(() => import("./imageCrop"));
interface Type {
  userInfo: UserInfoType | null;
}

const SettingsMobile: React.FC<Type> = ({ userInfo }) => {
  const [edit, setEdit] = useState<string>("");
  const [imgFile, setImgFile] = useState<File | null>(null);
  const [imgBase64, setImgBase64] = useState<string>("");
  const [imgUrl, setImgUrl] = useState<string>(userInfo?.picture || "");

  return (
    <>
      <main className="flex flex-col justify-between min-h-screen">
        {edit === "" || edit === "modal" ? (
          <Setting
            setEdit={setEdit}
            setImgUrl={setImgUrl}
            setImgBase64={setImgBase64}
            setImgFile={setImgFile}
            edit={edit}
            userInfo={userInfo}
            imgFile={imgFile}
            imgUrl={imgUrl}
          />
        ) : edit === "camera" ? (
          <Suspense fallback={<Loading />}>
            <CameraCapture setEdit={setEdit} setImgBase64={setImgBase64} />
          </Suspense>
        ) : (
          <Suspense fallback={<Loading />}>
            <ImageCropper
              setEdit={setEdit}
              setImgFile={setImgFile}
              setImgUrl={setImgUrl}
              imgBase64={imgBase64}
            />
          </Suspense>
        )}
        <FooterDesktop isFixed={!edit || edit === "modal" ? false : true} />
      </main>
    </>
  );
};
export default SettingsMobile;
