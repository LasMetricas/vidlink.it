//publish video
export interface PublishSuccess {
  videoId: string;
  newCards?: CardT[];
  message: string;
  status: number;
}
export interface PublishError {
  message: string;
  status?: number;
}

//delete video
export interface DeleteVideoSuccess {
  message: string;
  status: number;
}
export interface DeleteVideoError {
  message: string;
  status?: number;
}

//get videos
type Video = {
  _id: string;
  videoLink: string;
  title: string;
  info: string;
  duration: number;
  views: number;
  card: number;
  user: { _id: string; userName: string; picture: string };
  createdAt: string;
};
export interface GetVideosSuccess {
  allVideos?: Video[];
  followingVideos?: Video[];
  status: number;
  message: string;
}
export interface GetVideosError {
  message: string;
  status?: number;
}

//get homepage videos

export interface GetHomeVideosSuccess {
  homeVideos?: Video[];
  status: number;
  message: string;
}
export interface GetHomeVideosError {
  message: string;
  status?: number;
}

//get video detail
type User = {
  userName: string;
  picture: string;
  totalVideos: number;
  like: boolean;
  owner: boolean;
};
interface CardT {
  _id: string;
  link: string;
  name: string;
  // icon: string;
  start: number;
  no: number;
  isSaved: boolean;
}
type VideoInfo = {
  videoLink: string;
  title: string;
  description: string;
  info: string;
  duration: number;
  userId: string;
  cards: CardT[];
};
export interface GetVideoSuccess {
  userInfo: User;
  videoInfo: VideoInfo;
  // cards: CardType[];
  userVideos: Video[];
  relatedVideos: Video[];
  followStatus: boolean;
  message: string;
  status: number;
}
export interface GetVideoError {
  message: string;
  status?: number;
}

//get edit video
export interface GetEditVideoSuccess {
  videoInfo: VideoInfo;
  message: string;
  status: number;
}
export interface GetEditVideoError {
  message: string;
  status?: number;
}

//get my video
export interface GetMyVideoSuccess {
  videoInfo: {
    _id: string;
    videoLink: string;
    title: string;
    description: string;
    info: string;
    duration: number;
    likes: number;
    views: number;
    cards: CardT[];
  };
  moreVideos: (Video & { card: number })[];
  message: string;
  status: number;
}

export interface GetMyVideoError {
  message: string;
  status?: number;
}

// add like
export interface AddLikeSuccess {
  like: boolean;
  message: string;
  status: number;
}
export interface AddLikeError {
  message: string;
  status?: number;
}

//get my videos
type UserInfo = {
  _id: string;
  userName: string;
  picture: string;
  followers: number;
  following: number;
  totalVideos: number;
  totalCards: number;
  instagram: string;
  tiktok: string;
  youtube: string;
  linkedin: string;
  email?: string;
  bio: string;
};
export interface GetMyVideosSuccess {
  userInfo: UserInfo;
  myVideos: {
    _id: string;
    videoLink: string;
    title: string;
    info: string;
    duration: number;
    views: number;
    card: number;
    createdAt: string;
  }[];
  myLikesVideos: { videoLink: string; title: string; _id: string }[];
  status: number;
  message: string;
}
export interface GetMyVideosError {
  message: string;
  status?: number;
}
export interface GetCardsSuccess {
  cards: {
    title: string;
    userName: string;
    cards: {
      _id: string;
      name: string;
      // icon: string;
      start: number;
      link: string;
      no: number;
      isSaved: boolean;
    }[];
  }[];
  status: number;
  message: string;
}
export interface GetCardsError {
  message: string;
  status?: number;
}

//get user's videos
export interface GetUserVideosSuccess {
  userInfo: UserInfo;
  userVideos: {
    _id: string;
    videoLink: string;
    title: string;
    info: string;
    duration: number;
    views: number;
    card: number;
    createdAt: string;
  }[];
  relatedUsers: {
    _id: string;
    userName: string;
    picture: string;
    totalVideos: number;
    followers: number;
    totalCards: number;
  }[];
  followStatus: boolean;
  status: number;
  message: string;
}
export interface GetUserVideosError {
  message: string;
  status?: number;
}
//follow the user
export interface FollowStatusSccess {
  followStatus: boolean;
  status: number;
  message: string;
}
export interface FollowStatusError {
  message: string;
  status?: number;
}

//get user info
export interface GetUserInfoSuccess {
  userInfo: {
    userName: string;
    picture: string;
    gender: string;
    bio: string;
    instagram: string;
    tiktok: string;
    youtube: string;
    linkedin: string;
  };
  status: number;
  message: string;
}
export interface GetUserInfoError {
  message: string;
  status?: number;
}
//set user info
export interface SetUserInfoSuccess {
  user: { picture: string; userName: string };
  status: number;
  message: string;
}
export interface SetUserInfoError {
  message: string;
  status?: number;
}
//check user name
export interface CheckUserNameSuccess {
  isAlreadyOne: boolean;
  status: number;
  message: string;
}
export interface CheckUserNameError {
  message: string;
  status?: number;
}

//get user name
export interface GetUserNameSuccess {
  userName: string;
  status: number;
  message: string;
}
export interface GetUserNameError {
  message: string;
  status?: number;
}
//save card
export interface SaveCardSuccess {
  saved: boolean;
  status: number;
  message: string;
}
export interface SaveCardError {
  message: string;
  status?: number;
}
//increase card clicks
export interface IncreaseClicksSuccess {
  status: number;
  message: string;
}
export interface IncreaseClicksError {
  message: string;
  status?: number;
}
//watch time record
export interface WatchTimeSuccess {
  status: number;
  message: string;
}
export interface WatchTimeError {
  message: string;
  status?: number;
}
//get data as a creator
export interface GetDataCreatorSuccess {
  userInfo: {
    picture: string;
    userName: string;
    gainedFollowers: number;
    profileViews: number;
    lostFollowers: number;
    cardsClicks: number;
    savedCards: number;
    isAdmin: boolean;
  };
  videos: {
    title: string;
    videoLink: string;
    info: string;
    views: number;
    likes: number;
    card: number;
    watchTime: number;
  }[];
  cards: {
    title: string;
    name: string;
    clicks: number;
    saved: number;
    link: string;
    no: number;
  }[];
  chartData?: {
    labels: string[];
    values: number[];
  };
  videoViewsChartData?: {
    labels: string[];
    values: number[];
  };
  cardClicksChartData?: {
    labels: string[];
    values: number[];
  };
  status: number;
  message: string;
}
export interface GetDataCreatorError {
  message: string;
  status?: number;
}
//get data as a viewer
export interface GetDataViewerSuccess {
  userInfo: {
    likeVideos: number;
    cardsClicks: number;
    savedCards: number;
  };
  status: number;
  message: string;
}
export interface GetDataViewerError {
  message: string;
  status?: number;
}

//get data as a admin
export interface GetDataAdminSuccess {
  totalInfo: {
    visitors: number;
    videos: number;
    cards: number;
    videoViews: number;
    cardClicks: number;
    signups: number;
    usersAvgTime: number;
    visitorsAvgTime: number;
  };
  users: {
    _id: string;
    email: string;
    status: string;
    signupAt: string;
    lastLoginAt: string;
    videos: number;
    cards: number;
  }[];
  chartData?: {
    labels: string[];
    values: number[];
  };
  signupsChartData?: {
    labels: string[];
    values: number[];
  };
  visitorsChartData?: {
    labels: string[];
    values: number[];
  };
  videoViewsChartData?: {
    labels: string[];
    values: number[];
  };
  cardClicksChartData?: {
    labels: string[];
    values: number[];
  };
  status: number;
  message: string;
}
export interface GetDataAdminError {
  message: string;
  status?: number;
}

//handle user status
export interface HandleUserStatusSuccess {
  userStatus: string;
  message: string;
  status?: number;
}
export interface HandleUserStatusError {
  message: string;
  status?: number;
}

//store video file to s3
export interface StoreVideoFileSuccess {
  videoLink: string;
  status: number;
  message: string;
}
export interface StoreVideoFileError {
  message: string;
  status?: number;
}

//get a drafts
type DraftVideo = {
  _id: string;
  videoLink: string;
  views?: number;
  duration: number;
  info: string;
  title: string;
  card: number;
  createdAt: string;
};
export interface GetDraftsSuccess {
  draftVideos: DraftVideo[];
  publishedVideos: DraftVideo[];
  status: number;
  message: string;
}
export interface GetDraftsError {
  message: string;
  status?: number;
}
