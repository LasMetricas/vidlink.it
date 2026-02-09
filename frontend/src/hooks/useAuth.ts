"use client";
import { AuthErrorResponse, AuthSuccessResponse } from "@/types/authApiType";
import { SIGNUP, SIGNIN } from "@/utils/constant";
import axios, { AxiosResponse } from "axios";
import { useState } from "react";

const useAuth = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  // Register
  const signup = async (
    idToken: string | undefined
  ): Promise<AuthSuccessResponse | AuthErrorResponse> => {
    setLoading(true);
    try {
      const res: AxiosResponse<AuthSuccessResponse | AuthErrorResponse> =
        await axios.post(SIGNUP, { idToken }, config);
      return res.data;
    } catch (error: unknown) {
      // Handle axios errors
      if (axios.isAxiosError(error)) {
        return {
          message:
            error.response?.data?.message ===
            "User already registered, please login"
              ? "User already registered, please login"
              : "Something went wrong",
        };
      }
      return { message: "An unknown error occurred" };
    } finally {
      setLoading(false);
    }
  };

  // Login
  const login = async (
    idToken: string | undefined
  ): Promise<AuthSuccessResponse | AuthErrorResponse> => {
    setLoading(true);
    try {
      const res: AxiosResponse<AuthSuccessResponse | AuthErrorResponse> =
        await axios.post(SIGNIN, { idToken: idToken }, config);
      return res.data;
    } catch (error: unknown) {
      // Handle axios errors
      if (axios.isAxiosError(error)) {
        return {
          message:
            error.response?.data?.message ===
            "User doesn't exist, please sign up firstly"
              ? "User doesn't exist, please sign up firstly"
              : "Something went wrong",
        };
      }
      return { message: "An unknown error occurred" };
    } finally {
      setLoading(false);
    }
  };

  return { signup, login, loading };
};

export default useAuth;
