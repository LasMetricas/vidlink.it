export type AuthSuccessResponse = {
  token: string;
  user: { picture: string; userName: string };
  message: string;
};

export type AuthErrorResponse = {
  message: string;
};
