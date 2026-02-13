"use client";
import { Suspense, useLayoutEffect, useState } from "react";
import ProgressLine from "./progressLine";
import { useVideoValidate } from "@/hooks/useVideoValidate";
import dynamic from "next/dynamic";
import Upload from "./upload";
import Loading from "@/app/_components/ui/loading";
import { useAtom } from "jotai";
import { cardAtom, CardType } from "@/store";
import useVideo from "@/hooks/useVideo";
// import { getItem, setItem } from "@/utils/localstorage";
import { useRouter, useSearchParams } from "next/navigation";
import { errorModal, successModal } from "@/utils/confirm";
const AddCards = dynamic(() => import("./addCards"), { ssr: false });
const Preview = dynamic(() => import("./preview"), { ssr: false });

const UploadDesktop = () => {
  const [edit, setEdit] = useState<string>("upload");
  const {
    validateVideo,
    cancelVideo,
    error,
    videoSrc,
    uploadedFile,
    fileDuration,
  } = useVideoValidate();
  const [videoLink, setVideoLink] = useState<string>("");
  const [url, setUrl] = useState<string>("");
  const [duration, setDuration] = useState<number>(0);
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [info, setInfo] = useState<string>("");
  const [cards, setCards] = useAtom<CardType[]>(cardAtom);
  const [editSignal, setEditSignal] = useState<boolean>(false);
  const [hasMounted, setHasMounted] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const { publish, saveDraft, getEditVideo, getDraft, loading, draftLoading, storeVideoFile, getUserName } =
    useVideo();

  const status = searchParams.get("status") ?? "create";
  const videoId = searchParams.get("videoId") ?? "";

  const handlePublish = async () => {
    if (loading || !editSignal) return;
    if (!title) return errorModal("Please enter a title.");
    if (!description) return errorModal("Please enter a description.");
    if (!info) return errorModal("Please enter a extra info.");
    if (cards.length < 1) return errorModal("Please create the cards.");

    // Check if user is authenticated
    const userRes = await getUserName();
    if (userRes.status !== 200 || !("userName" in userRes)) {
      errorModal("Please log in to publish your video.");
      router.push("/login");
      return;
    }
    if (userRes.userName.trim() === "") {
      errorModal("You must set a username before publishing.");
      router.push("/settings");
      return;
    }

    let finalVideoLink = videoLink;

    // If we have a local file, upload to S3 first
    if (file && videoLink.startsWith("blob:")) {
      const fileData = new FormData();
      fileData.append("file", file);
      const uploadRes = await storeVideoFile(fileData);
      if (uploadRes.status === 200 && "videoLink" in uploadRes) {
        finalVideoLink = uploadRes.videoLink;
      } else {
        errorModal(uploadRes.message || "Failed to upload video file.");
        return;
      }
    }

    const data = new FormData();
    if (finalVideoLink) {
      data.append("videoLink", finalVideoLink);
    } else {
      errorModal("Please provide either a file or a video link.");
      return;
    }
    data.append("title", title);
    data.append("description", description);
    data.append("info", info);
    data.append("cards", JSON.stringify(cards));
    data.append("duration", String(duration || 0));
    const res = await publish(data, status, videoId);
    if (res.status === 201 && "videoId" in res) {
      setEditSignal(false);
      cancelVideo();
      successModal(
        status === "edit"
          ? "Video saved successfully"
          : `Video published successfully`,
        () => router.push(`/myvideo/${res.videoId}`)
      );
    } else {
      errorModal(res.message || "Something went wrong");
    }
  };

  const handleSaveDrafts = async () => {
    // const isDrafted = getItem("isDrafted") ?? false;
    if (draftLoading || !editSignal) return;
    if (status !== "create" || videoId !== "") return;
    const data = new FormData();
    if (videoLink) {
      data.append("videoLink", videoLink);
    } else {
      errorModal("Please provide either a file or a video link.");
      return;
    }
    data.append("title", title || "");
    data.append("description", description || "");
    data.append("info", info || "");
    data.append("cards", JSON.stringify(cards || []));
    data.append("duration", String(duration || 0));
    const res = await saveDraft(data);
    if (res.status === 201) {
      cancelVideo();
      successModal("Saved to drafts successfully");
      // setItem("isDrafted", true);
    } else {
      errorModal(res.message || "Something went wrong");
    }
  };

  useLayoutEffect(() => {
    (async () => {
      // Only fetch video data when editing an existing video or draft
      if (videoId) {
        let res;
        if (status === "draft") {
          res = await getDraft(videoId);
        } else {
          res = await getEditVideo(videoId);
        }
        if (res.status === 200 && "videoInfo" in res && res.videoInfo) {
          const videoInfo = res.videoInfo;
          setCards(videoInfo.cards ?? []);
          setTitle(videoInfo.title ?? "");
          setDescription(videoInfo.description ?? "");
          setInfo(videoInfo.info ?? "");
          setVideoLink(videoInfo.videoLink);
          setDuration(videoInfo.duration);
          setEditSignal(status === "draft" ? true : false);
          setEdit("add");
        }
      }
      setHasMounted(true);
    })();
  }, []);

  if (!hasMounted) return <Loading />;
  return (
    <>
      <ProgressLine
        setEdit={setEdit}
        cancelVideo={cancelVideo}
        setUrl={setUrl}
        edit={edit}
        url={url}
        videoSrc={videoSrc}
        videoLink={videoLink}
        editSignal={editSignal}
      />
      {edit === "upload" ? (
        <Suspense fallback={<Loading />}>
          <Upload
            validateVideo={validateVideo}
            setVideoLink={setVideoLink}
            setEdit={setEdit}
            setUrl={setUrl}
            cancelVideo={cancelVideo}
            setDuration={setDuration}
            setFile={setFile}
            setTitle={setTitle}
            setDescription={setDescription}
            setEditSignal={setEditSignal}
            setInfo={setInfo}
            videoSrc={videoSrc}
            error={error}
            url={url}
            fileDuration={fileDuration}
            uploadedFile={uploadedFile}
          />
        </Suspense>
      ) : edit === "add" ? (
        <Suspense fallback={<Loading />}>
          <AddCards
            handlePublish={handlePublish}
            handleSaveDrafts={handleSaveDrafts}
            setEdit={setEdit}
            setEditSignal={setEditSignal}
            setTitle={setTitle}
            setDescription={setDescription}
            setInfo={setInfo}
            loading={loading}
            videoLink={videoLink}
            title={title}
            description={description}
            info={info}
            editSignal={editSignal}
          />
        </Suspense>
      ) : (
        <Suspense fallback={<Loading />}>
          <Preview
            setEdit={setEdit}
            handlePublish={handlePublish}
            setEditSignal={setEditSignal}
            videoLink={videoLink}
            loading={loading}
            editSignal={editSignal}
            title={title}
            description={description}
            info={info}
          />
        </Suspense>
      )}
    </>
  );
};
export default UploadDesktop;
