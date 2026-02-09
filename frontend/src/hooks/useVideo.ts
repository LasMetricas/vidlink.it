import {
  ADDLIKE,
  CHECKUSERNAME,
  DELETEDRAFT,
  DELETEVIDEO,
  FOLLOWUSER,
  GETCARDS,
  GETDATAADMIN,
  GETDATACREATOR,
  GETDATAVIEWER,
  GETDRAFT,
  GETDRAFTS,
  GETEDITVIDEO,
  GETHOMEVIDEOS,
  GETMYVIDEO,
  GETMYVIDEOS,
  GETUSERINFO,
  GETUSERNAME,
  GETUSERVIDEOS,
  GETVIDEO,
  GETVIDEOS,
  HANDLEUSERSTATUS,
  INCREASECLICKS,
  PUBLISHVIDEO,
  SAVECARD,
  SAVEDRAFT,
  SETUSERINFO,
  STOREVIDOEFILE,
  WATCHTIME,
} from "@/utils/constant";
import {
  AddLikeError,
  AddLikeSuccess,
  CheckUserNameError,
  CheckUserNameSuccess,
  DeleteVideoError,
  DeleteVideoSuccess,
  FollowStatusError,
  FollowStatusSccess,
  GetCardsError,
  GetCardsSuccess,
  GetDataAdminError,
  GetDataAdminSuccess,
  GetDataCreatorError,
  GetDataCreatorSuccess,
  GetDataViewerError,
  GetDataViewerSuccess,
  GetDraftsError,
  GetDraftsSuccess,
  GetEditVideoError,
  GetEditVideoSuccess,
  GetHomeVideosError,
  GetHomeVideosSuccess,
  GetMyVideoError,
  GetMyVideosError,
  GetMyVideosSuccess,
  GetMyVideoSuccess,
  GetUserInfoError,
  GetUserInfoSuccess,
  GetUserNameError,
  GetUserNameSuccess,
  GetUserVideosError,
  GetUserVideosSuccess,
  GetVideoError,
  GetVideosError,
  GetVideosSuccess,
  GetVideoSuccess,
  HandleUserStatusError,
  HandleUserStatusSuccess,
  IncreaseClicksError,
  IncreaseClicksSuccess,
  PublishError,
  PublishSuccess,
  SaveCardError,
  SaveCardSuccess,
  SetUserInfoError,
  SetUserInfoSuccess,
  StoreVideoFileError,
  StoreVideoFileSuccess,
  WatchTimeError,
  WatchTimeSuccess,
} from "@/types/videoApiType";
import { useRouter } from "next/navigation";
import axios, { AxiosResponse } from "axios";
import { useState } from "react";
import Cookies from "js-cookie";

const useVideo = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [draftLoading, setDraftLoading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const router = useRouter();
  const token = Cookies.get("token");
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };
  const videoIdConfig = (videoId: string) => ({
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      "x-video-id": videoId,
    },
  });
  const userIdConfig = (userId: string) => ({
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      "x-user-id": userId,
    },
  });
  const multiConfig = {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  };
  const getDataConfig = (duration: string) => ({
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      "x-duration": duration,
    },
  });
  //publish video
  const publish = async (
    data: FormData,
    status: string,
    videoId: string
  ): Promise<PublishSuccess | PublishError> => {
    setLoading(true);
    try {
      const res: AxiosResponse<PublishSuccess | PublishError> =
        await axios.post(
          `${PUBLISHVIDEO}?status=${status}&videoId=${videoId}`,
          data,
          config
        );
      return { ...res.data, status: res.status };
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        if (
          error?.response?.data?.message === "Token is invalid or has expired!"
        ) {
          Cookies.remove("token");
          Cookies.remove("user");
          router.push("/login");
          return { message: "Your session was expired. Please log in again." };
        } else {
          return { message: "Something went wrong" };
        }
      }
      return { message: "An unknown error occurred" };
    } finally {
      setLoading(false);
    }
  };

  //delete a video
  const deleteVideo = async (
    videoId: string
  ): Promise<DeleteVideoSuccess | DeleteVideoError> => {
    setLoading(true);
    try {
      const res: AxiosResponse<DeleteVideoSuccess | DeleteVideoError> =
        await axios.delete(DELETEVIDEO, videoIdConfig(videoId));
      return { ...res.data, status: res.status };
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        if (
          error?.response?.data?.message === "Token is invalid or has expired!"
        ) {
          Cookies.remove("token");
          Cookies.remove("user");
          router.push("/login");
          return { message: "Your session was expired. Please log in again." };
        } else {
          return { message: "Something went wrong" };
        }
      }
      return { message: "An unknown error occurred" };
    } finally {
      setLoading(false);
    }
  };
  //fetch the videos
  const getVideos = async (): Promise<GetVideosSuccess | GetVideosError> => {
    setLoading(true);
    try {
      const res: AxiosResponse<GetVideosSuccess | GetVideosError> =
        await axios.get(GETVIDEOS, config);
      return { ...res.data, status: res.status };
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        if (error?.response?.data?.message) {
          return { message: "Something went wrong" };
        }
      }
      return { message: "An unknown error occurred" };
    } finally {
      setLoading(false);
    }
  };
  //
  const getHomeVideos = async (): Promise<
    GetHomeVideosSuccess | GetHomeVideosError
  > => {
    setLoading(true);
    try {
      const res: AxiosResponse<GetHomeVideosSuccess | GetHomeVideosError> =
        await axios.get(GETHOMEVIDEOS, config);
      return { ...res.data, status: res.status };
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        if (error?.response?.data?.message) {
          return { message: "Something went wrong" };
        }
      }
      return { message: "An unknown error occurred" };
    } finally {
      setLoading(false);
    }
  };
  //fetch the video detail
  const getVideo = async (
    videoId: string
  ): Promise<GetVideoSuccess | GetVideoError> => {
    setLoading(true);
    try {
      const res: AxiosResponse<GetVideoSuccess | GetVideoError> =
        await axios.get(GETVIDEO, videoIdConfig(videoId));
      return { ...res.data, status: res.status };
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        if (error?.response?.data?.message) {
          return { message: "Something went wrong" };
        }
      }
      return { message: "An unknown error occurred" };
    } finally {
      setLoading(false);
    }
  };
  //fetch a edit video
  const getEditVideo = async (
    videoId: string
  ): Promise<GetEditVideoSuccess | GetEditVideoError> => {
    setLoading(true);
    try {
      const res: AxiosResponse<GetEditVideoSuccess | GetEditVideoError> =
        await axios.get(GETEDITVIDEO, videoIdConfig(videoId));
      return { ...res.data, status: res.status };
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        if (
          error?.response?.data?.message === "Token is invalid or has expired!"
        ) {
          Cookies.remove("token");
          Cookies.remove("user");
          router.push("/login");
          return { message: "Your session was expired. Please log in again." };
        } else {
          return { message: "Something went wrong" };
        }
      }
      return { message: "An unknown error occurred" };
    } finally {
      setLoading(false);
    }
  };
  //fetch my video detail
  const getMyVideo = async (
    videoId: string
  ): Promise<GetMyVideoSuccess | GetMyVideoError> => {
    setLoading(true);
    try {
      const res: AxiosResponse<GetMyVideoSuccess | GetMyVideoError> =
        await axios.get(GETMYVIDEO, videoIdConfig(videoId));
      return { ...res.data, status: res.status };
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        if (
          error?.response?.data?.message === "Token is invalid or has expired!"
        ) {
          Cookies.remove("token");
          Cookies.remove("user");
          router.push("/login");
          return { message: "Your session was expired. Please log in again." };
        } else {
          return { message: "Something went wrong" };
        }
      }
      return { message: "An unknown error occurred" };
    } finally {
      setLoading(false);
    }
  };

  //add like
  const addLike = async (
    videoId: string
  ): Promise<AddLikeSuccess | AddLikeError> => {
    setLoading(true);
    try {
      const res: AxiosResponse<AddLikeSuccess | AddLikeError> = await axios.put(
        ADDLIKE,
        {},
        videoIdConfig(videoId)
      );
      return { ...res.data, status: res.status };
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        if (
          error?.response?.data?.message === "Token is invalid or has expired!"
        ) {
          Cookies.remove("token");
          Cookies.remove("user");
          router.push("/login");
          return { message: "Your session was expired. Please log in again." };
        } else {
          return { message: "Something went wrong" };
        }
      }
      return { message: "An unknown error occurred" };
    } finally {
      setLoading(false);
    }
  };

  //get my videos
  const getMyVideos = async (): Promise<
    GetMyVideosSuccess | GetMyVideosError
  > => {
    setLoading(true);
    try {
      const res: AxiosResponse<GetMyVideosSuccess | GetMyVideosError> =
        await axios.get(GETMYVIDEOS, config);
      return { ...res.data, status: res.status };
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        if (
          error?.response?.data?.message === "Token is invalid or has expired!"
        ) {
          Cookies.remove("token");
          Cookies.remove("user");
          router.push("/login");
          return { message: "Your session was expired. Please log in again." };
        } else {
          return { message: "Something went wrong" };
        }
      }
      return { message: "An unknown error occurred" };
    } finally {
      setLoading(false);
    }
  };

  //get cards
  const getCards = async (): Promise<GetCardsSuccess | GetCardsError> => {
    setLoading(true);
    try {
      const res: AxiosResponse<GetCardsSuccess | GetCardsError> =
        await axios.get(GETCARDS, config);
      return { ...res.data, status: res.status };
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        if (
          error?.response?.data?.message === "Token is invalid or has expired!"
        ) {
          Cookies.remove("token");
          Cookies.remove("user");
          router.push("/login");
          return { message: "Your session was expired. Please log in again." };
        } else {
          return { message: "Something went wrong" };
        }
      }
      return { message: "An unknown error occurred" };
    } finally {
      setLoading(false);
    }
  };

  //get user videos
  const getUserVideos = async (
    userId: string
  ): Promise<GetUserVideosSuccess | GetUserVideosError> => {
    setLoading(true);
    try {
      const res: AxiosResponse<GetUserVideosSuccess | GetUserVideosError> =
        await axios.get(GETUSERVIDEOS, userIdConfig(userId));
      return { ...res.data, status: res.status };
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        if (error?.response?.data?.message) {
          return { message: "Something went wrong" };
        }
      }
      return { message: "An unknown error occurred" };
    } finally {
      setLoading(false);
    }
  };
  //follow the user
  const followUser = async (
    userId: string
  ): Promise<FollowStatusSccess | FollowStatusError> => {
    setLoading(true);
    try {
      const res: AxiosResponse<FollowStatusSccess | FollowStatusError> =
        await axios.put(FOLLOWUSER, {}, userIdConfig(userId));
      return { ...res.data, status: res.status };
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        if (
          error?.response?.data?.message === "Token is invalid or has expired!"
        ) {
          Cookies.remove("token");
          Cookies.remove("user");
          router.push("/login");
          return { message: "Your session was expired. Please log in again." };
        } else {
          return { message: "Something went wrong" };
        }
      }
      return { message: "An unknown error occurred" };
    } finally {
      setLoading(false);
    }
  };
  //get user info
  const getUserInfo = async (): Promise<
    GetUserInfoSuccess | GetUserInfoError
  > => {
    setLoading(true);
    try {
      const res: AxiosResponse<GetUserInfoSuccess | GetUserInfoError> =
        await axios.get(GETUSERINFO, config);
      return { ...res.data, status: res.status };
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        if (
          error?.response?.data?.message === "Token is invalid or has expired!"
        ) {
          Cookies.remove("token");
          Cookies.remove("user");
          router.push("/login");
          return { message: "Your session was expired. Please log in again." };
        } else {
          return { message: "Something went wrong" };
        }
      }
      return { message: "An unknown error occurred" };
    } finally {
      setLoading(false);
    }
  };

  //set user info
  const setUserInfo = async (
    userInfo: FormData
  ): Promise<SetUserInfoSuccess | SetUserInfoError> => {
    setLoading(true);
    try {
      const res: AxiosResponse<SetUserInfoSuccess | SetUserInfoError> =
        await axios.post(SETUSERINFO, userInfo, multiConfig);
      return { ...res.data, status: res.status };
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        if (
          error?.response?.data?.message === "Token is invalid or has expired!"
        ) {
          Cookies.remove("token");
          Cookies.remove("user");
          router.push("/login");
          return { message: "Your session was expired. Please log in again." };
        } else {
          return { message: error?.response?.data?.message };
        }
      }
      return { message: "An unknown error occurred" };
    } finally {
      setLoading(false);
    }
  };
  //check user name
  const checkUserName = async (
    userName: string
  ): Promise<CheckUserNameSuccess | CheckUserNameError> => {
    setLoading(true);
    try {
      const res: AxiosResponse<CheckUserNameSuccess | CheckUserNameError> =
        await axios.post(CHECKUSERNAME, { userName }, config);
      return { ...res.data, status: res.status };
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        if (
          error?.response?.data?.message === "Token is invalid or has expired!"
        ) {
          Cookies.remove("token");
          Cookies.remove("user");
          router.push("/login");
          return { message: "Your session was expired. Please log in again." };
        } else {
          return { message: "Something went wrong" };
        }
      }
      return { message: "An unknown error occurred" };
    } finally {
      setLoading(false);
    }
  };
  //check user name
  const getUserName = async (): Promise<
    GetUserNameSuccess | GetUserNameError
  > => {
    setLoading(true);
    try {
      const res: AxiosResponse<GetUserNameSuccess | GetUserNameError> =
        await axios.get(GETUSERNAME, config);
      return { ...res.data, status: res.status };
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        if (
          error?.response?.data?.message === "Token is invalid or has expired!"
        ) {
          Cookies.remove("token");
          Cookies.remove("user");
          router.push("/login");
          return { message: "Your session was expired. Please log in again." };
        } else {
          return { message: "Something went wrong" };
        }
      }
      return { message: "An unknown error occurred" };
    } finally {
      setLoading(false);
    }
  };
  //save card
  const saveCard = async (
    cardId: string
  ): Promise<SaveCardSuccess | SaveCardError> => {
    setLoading(true);
    try {
      const res: AxiosResponse<SaveCardSuccess | SaveCardError> =
        await axios.put(SAVECARD, { cardId }, config);
      return { ...res.data, status: res.status };
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        if (
          error?.response?.data?.message === "Token is invalid or has expired!"
        ) {
          Cookies.remove("token");
          Cookies.remove("user");
          router.push("/login");
          return { message: "Your session was expired. Please log in again." };
        } else {
          return { message: "Something went wrong" };
        }
      }
      return { message: "An unknown error occurred" };
    } finally {
      setLoading(false);
    }
  };
  //increase card clicks
  const increaseClicks = async (
    cardId: string
  ): Promise<IncreaseClicksSuccess | IncreaseClicksError> => {
    setLoading(true);
    try {
      const res: AxiosResponse<IncreaseClicksSuccess | IncreaseClicksError> =
        await axios.put(INCREASECLICKS, { cardId }, config);
      return { ...res.data, status: res.status };
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        if (error?.response?.data?.message) {
          return { message: "Something went wrong" };
        }
      }
      return { message: "An unknown error occurred" };
    } finally {
      setLoading(false);
    }
  };
  //record watch time
  const watchTime = async (
    watchTime: number,
    videoId: string
  ): Promise<WatchTimeSuccess | WatchTimeError> => {
    setLoading(true);
    try {
      const res: AxiosResponse<WatchTimeSuccess | WatchTimeError> =
        await axios.put(WATCHTIME, { watchTime, videoId }, config);
      return { ...res.data, status: res.status };
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        if (error?.response?.data?.message) {
          return { message: "Something went wrong" };
        }
      }
      return { message: "An unknown error occurred" };
    } finally {
      setLoading(false);
    }
  };

  //get data as a creator
  const getDataCreator = async (
    duration: string
  ): Promise<GetDataCreatorSuccess | GetDataCreatorError> => {
    setLoading(true);
    try {
      const res: AxiosResponse<GetDataCreatorSuccess | GetDataCreatorError> =
        await axios.get(GETDATACREATOR, getDataConfig(duration));
      return { ...res.data, status: res.status };
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        if (
          error?.response?.data?.message === "Token is invalid or has expired!"
        ) {
          Cookies.remove("token");
          Cookies.remove("user");
          router.push("/login");
          return { message: "Your session was expired. Please log in again." };
        } else {
          return { message: "Something went wrong" };
        }
      }
      return { message: "An unknown error occurred" };
    } finally {
      setLoading(false);
    }
  };
  //get data as a viewer
  const getDataViewer = async (
    duration: string
  ): Promise<GetDataViewerSuccess | GetDataViewerError> => {
    setLoading(true);
    try {
      const res: AxiosResponse<GetDataViewerSuccess | GetDataViewerError> =
        await axios.get(GETDATAVIEWER, getDataConfig(duration));
      return { ...res.data, status: res.status };
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        if (
          error?.response?.data?.message === "Token is invalid or has expired!"
        ) {
          Cookies.remove("token");
          Cookies.remove("user");
          router.push("/login");
          return { message: "Your session was expired. Please log in again." };
        } else {
          return { message: "Something went wrong" };
        }
      }
      return { message: "An unknown error occurred" };
    } finally {
      setLoading(false);
    }
  };
  //get data as a creator
  const getDataAdmin = async (
    duration: string
  ): Promise<GetDataAdminSuccess | GetDataAdminError> => {
    setLoading(true);
    try {
      const res: AxiosResponse<GetDataAdminSuccess | GetDataAdminError> =
        await axios.get(GETDATAADMIN, getDataConfig(duration));
      return { ...res.data, status: res.status };
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        if (
          error?.response?.data?.message === "Token is invalid or has expired!"
        ) {
          Cookies.remove("token");
          Cookies.remove("user");
          router.push("/login");
          return { message: "Your session was expired. Please log in again." };
        } else {
          return { message: "Something went wrong" };
        }
      }
      return { message: "An unknown error occurred" };
    } finally {
      setLoading(false);
    }
  };
  //handle user status
  const handleUserStatus = async (
    userId: string
  ): Promise<HandleUserStatusSuccess | HandleUserStatusError> => {
    setLoading(true);
    try {
      const res: AxiosResponse<
        HandleUserStatusSuccess | HandleUserStatusError
      > = await axios.post(HANDLEUSERSTATUS, { userId }, config);
      return { ...res.data, status: res.status };
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        if (
          error?.response?.data?.message === "Token is invalid or has expired!"
        ) {
          Cookies.remove("token");
          Cookies.remove("user");
          router.push("/login");
          return { message: "Your session was expired. Please log in again." };
        } else {
          return { message: "Something went wrong" };
        }
      }
      return { message: "An unknown error occurred" };
    } finally {
      setLoading(false);
    }
  };

  //store video file to s3
  const storeVideoFile = async (
    file: FormData
  ): Promise<StoreVideoFileSuccess | StoreVideoFileError> => {
    setLoading(true);
    // start smooth, randomized progress towards a cap (95-99)
    setUploadProgress(0);
    const progressCap = 95 + Math.floor(Math.random() * 5); // 95-99
    let localProgress = 0;
    const interval = setInterval(() => {
      // increment by 0.5% - 2.0% per tick, capped at progressCap
      const increment = 0.5 + Math.random() * 1.5;
      localProgress = Math.min(progressCap, localProgress + increment);
      setUploadProgress(Math.floor(localProgress));
    }, 200);
    try {
      const res: AxiosResponse<StoreVideoFileSuccess | StoreVideoFileError> =
        await axios.post(STOREVIDOEFILE, file, multiConfig);
      // complete to 100% when backend confirms
      setUploadProgress(100);
      return { ...res.data, status: res.status };
    } catch (error: unknown) {
      // reset on error
      setUploadProgress(0);
      if (axios.isAxiosError(error)) {
        if (
          error?.response?.data?.message === "Token is invalid or has expired!"
        ) {
          Cookies.remove("token");
          Cookies.remove("user");
          router.push("/login");
          return { message: "Your session was expired. Please log in again." };
        } else {
          return { message: "Something went wrong" };
        }
      }
      return { message: "An unknown error occurred" };
    } finally {
      clearInterval(interval);
      setLoading(false);
    }
  };

  const saveDraft = async (
    data: FormData
  ): Promise<PublishSuccess | PublishError> => {
    setDraftLoading(true);
    try {
      const res: AxiosResponse<PublishSuccess | PublishError> =
        await axios.post(SAVEDRAFT, data, config);
      return { ...res.data, status: res.status };
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        if (
          error?.response?.data?.message === "Token is invalid or has expired!"
        ) {
          Cookies.remove("token");
          Cookies.remove("user");
          router.push("/login");
          return { message: "Your session was expired. Please log in again." };
        } else {
          return { message: "Something went wrong" };
        }
      }
      return { message: "An unknown error occurred" };
    } finally {
      setDraftLoading(false);
    }
  };

  //fetch the video detail
  const getDraft = async (
    videoId: string
  ): Promise<GetEditVideoSuccess | GetEditVideoError> => {
    setLoading(true);
    try {
      const res: AxiosResponse<GetEditVideoSuccess | GetEditVideoError> =
        await axios.get(GETDRAFT, videoIdConfig(videoId));
      return { ...res.data, status: res.status };
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        if (
          error?.response?.data?.message === "Token is invalid or has expired!"
        ) {
          Cookies.remove("token");
          Cookies.remove("user");
          router.push("/login");
          return { message: "Your session was expired. Please log in again." };
        } else {
          return { message: "Something went wrong" };
        }
      }
      return { message: "An unknown error occurred" };
    } finally {
      setLoading(false);
    }
  };

  //delete draft video
  const deleteDraft = async (
    videoId: string
  ): Promise<DeleteVideoSuccess | DeleteVideoError> => {
    setLoading(true);
    try {
      const res: AxiosResponse<DeleteVideoSuccess | DeleteVideoError> =
        await axios.delete(DELETEDRAFT, videoIdConfig(videoId));
      return { ...res.data, status: res.status };
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        if (
          error?.response?.data?.message === "Token is invalid or has expired!"
        ) {
          Cookies.remove("token");
          Cookies.remove("user");
          router.push("/login");
          return { message: "Your session was expired. Please log in again." };
        } else {
          return { message: "Something went wrong" };
        }
      }
      return { message: "An unknown error occurred" };
    } finally {
      setLoading(false);
    }
  };
  //fetch drafts
  const getDrafts = async (): Promise<GetDraftsSuccess | GetDraftsError> => {
    setLoading(true);
    try {
      const res: AxiosResponse<GetDraftsSuccess | GetDraftsError> =
        await axios.get(GETDRAFTS, config);
      return { ...res.data, status: res.status };
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        if (
          error?.response?.data?.message === "Token is invalid or has expired!"
        ) {
          Cookies.remove("token");
          Cookies.remove("user");
          router.push("/login");
          return { message: "Your session was expired. Please log in again." };
        } else {
          return { message: "Something went wrong" };
        }
      }
      return { message: "An unknown error occurred" };
    } finally {
      setLoading(false);
    }
  };
  return {
    publish,
    deleteVideo,
    getVideos,
    getHomeVideos,
    addLike,
    getMyVideos,
    getUserVideos,
    getVideo,
    getEditVideo,
    getMyVideo,
    followUser,
    getUserInfo,
    setUserInfo,
    checkUserName,
    getUserName,
    saveCard,
    increaseClicks,
    watchTime,
    getDataCreator,
    getDataViewer,
    getDataAdmin,
    handleUserStatus,
    getCards,
    storeVideoFile,
    saveDraft,
    getDraft,
    deleteDraft,
    getDrafts,
    loading,
    draftLoading,
    uploadProgress,
  };
};
export default useVideo;
