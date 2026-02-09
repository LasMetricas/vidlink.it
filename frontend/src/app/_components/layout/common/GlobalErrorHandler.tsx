"use client";

import { useEffect } from "react";
import { errorLogger, logAxiosError } from "../../../../utils/errorLogger";
import axios from "axios";

export default function GlobalErrorHandler() {
  useEffect(() => {
    // Handle JS errors
    const handleError = (event: ErrorEvent) => {
      errorLogger.logJavaScriptError(event.error || event.message, {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        error: event.error,
      });
    };

    // Handle unhandled rejections
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      // Check for axios error
      if (axios.isAxiosError(event.reason)) {
        logAxiosError(event.reason);
      } else {
        errorLogger.logPromiseRejection(event);
      }
    };

    // Set up axios interceptor
    const responseInterceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        // Log axios error
        logAxiosError(error);
        // Re-throw so calling code can handle it
        return Promise.reject(error);
      }
    );

    // Add listeners
    window.addEventListener("error", handleError);
    window.addEventListener("unhandledrejection", handleUnhandledRejection);

    // Cleanup
    return () => {
      window.removeEventListener("error", handleError);
      window.removeEventListener("unhandledrejection", handleUnhandledRejection);
      // Remove interceptor
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, []);

  return null; // No render
}

