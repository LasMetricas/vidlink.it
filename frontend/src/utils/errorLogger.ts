import axios from "axios";
import Cookies from "js-cookie";
import { BASE_URL } from "./constant";
import { ErrorInfo } from "react";

interface ErrorLogData {
  errorMessage: string;
  errorStack?: string;
  errorType: "error" | "unhandledrejection" | "component" | "network";
  url: string;
  userAgent: string;
  metadata?: {
    componentStack?: string;
    lineNumber?: number;
    columnNumber?: number;
    filename?: string;
    originalError?: string;
    errorDetails?: string;
    requestUrl?: string;
    requestMethod?: string;
    statusCode?: number;
    [key: string]: string | number | boolean | undefined;
  };
}

class ErrorLogger {
  private logQueue: ErrorLogData[] = [];
  private isProcessing = false;
  private readonly MAX_RETRIES = 3;
  private readonly BATCH_SIZE = 10;
  private readonly FLUSH_INTERVAL = 5000; // 5 seconds

  constructor() {
    // Periodically flush the queue
    setInterval(() => {
      if (this.logQueue.length > 0) {
        this.flushQueue();
      }
    }, this.FLUSH_INTERVAL);
  }

  private async sendErrorToBackend(errorData: ErrorLogData, retries = 0): Promise<void> {
    try {
      const token = Cookies.get("token");
      const config = {
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      };

      await axios.post(`${BASE_URL}/express/errors/log`, errorData, config);
    } catch (error) {
      // Fail silently to avoid cascading errors
      console.warn("Failed to log error to backend:", error);
      
      // Retry if under max attempts
      if (retries < this.MAX_RETRIES) {
        setTimeout(() => {
          this.sendErrorToBackend(errorData, retries + 1);
        }, 1000 * (retries + 1)); // Exponential backoff
      }
    }
  }

  private async flushQueue(): Promise<void> {
    if (this.isProcessing || this.logQueue.length === 0) {
      return;
    }

    this.isProcessing = true;
    const batch = this.logQueue.splice(0, this.BATCH_SIZE);

    try {
      await Promise.all(
        batch.map((errorData) => this.sendErrorToBackend(errorData))
      );
    } catch {
      // Put failed items back in queue
      this.logQueue.unshift(...batch);
    } finally {
      this.isProcessing = false;
    }
  }

  public logError(errorData: ErrorLogData): void {
    // Queue the error
    this.logQueue.push(errorData);

    // Flush if queue is getting big
    if (this.logQueue.length >= this.BATCH_SIZE) {
      this.flushQueue();
    }
  }

  public logJavaScriptError(
    error: Error | string,
    errorInfo?: {
      filename?: string;
      lineno?: number;
      colno?: number;
      error?: Error;
    }
  ): void {
    const errorMessage = typeof error === "string" ? error : error.message;
    const errorStack = typeof error === "string" ? undefined : error.stack;

    this.logError({
      errorMessage,
      errorStack,
      errorType: "error",
      url: window.location.href,
      userAgent: navigator.userAgent,
      metadata: {
        filename: errorInfo?.filename,
        lineNumber: errorInfo?.lineno,
        columnNumber: errorInfo?.colno,
        ...(errorInfo?.error && { originalError: errorInfo.error.toString() }),
      },
    });
  }

  public logPromiseRejection(
    event: PromiseRejectionEvent
  ): void {
    const error = event.reason;
    const errorMessage = error?.message || String(error) || "Unhandled Promise Rejection";
    const errorStack = error?.stack;

    this.logError({
      errorMessage,
      errorStack,
      errorType: "unhandledrejection",
      url: window.location.href,
      userAgent: navigator.userAgent,
      metadata: {
        ...(error && typeof error === "object" && { errorDetails: JSON.stringify(error) }),
      },
    });
  }

  public logComponentError(
    error: Error,
    errorInfo: ErrorInfo
  ): void {
    this.logError({
      errorMessage: error.message,
      errorStack: error.stack,
      errorType: "component",
      url: window.location.href,
      userAgent: navigator.userAgent,
      metadata: {
        componentStack: errorInfo.componentStack ?? undefined,
      },
    });
  }

  public logAxiosError(
    error: unknown
  ): void {
    // Only log axios errors
    if (typeof window === "undefined") return; // Skip on server side
    
    let errorMessage = "Unknown network error";
    let errorStack: string | undefined;
    let requestUrl: string | undefined;
    let requestMethod: string | undefined;
    let statusCode: number | undefined;
    let errorDetails: string | undefined;

    if (axios.isAxiosError(error)) {
      errorMessage = error.message || "Network request failed";
      errorStack = error.stack;
      
      // Get request info
      if (error.config) {
        requestUrl = error.config.url || error.config.baseURL;
        requestMethod = error.config.method?.toUpperCase();
      }
      
      // Get response info
      if (error.response) {
        statusCode = error.response.status;
        errorDetails = JSON.stringify({
          status: error.response.status,
          statusText: error.response.statusText,
          data: error.response.data,
        });
      } else if (error.request) {
        // Network error - timeout or no response
        errorMessage = error.code === "ECONNABORTED" 
          ? `Request timeout: ${error.message}`
          : error.code === "ERR_NETWORK"
          ? `Network error: ${error.message}`
          : `Network request failed: ${error.message}`;
        errorDetails = JSON.stringify({
          code: error.code,
          message: error.message,
        });
      }
    } else if (error instanceof Error) {
      errorMessage = error.message;
      errorStack = error.stack;
    } else {
      errorMessage = String(error);
    }

    this.logError({
      errorMessage,
      errorStack,
      errorType: "network",
      url: window.location.href,
      userAgent: navigator.userAgent,
      metadata: {
        requestUrl,
        requestMethod,
        statusCode,
        errorDetails,
      },
    });
  }
}

// Single instance
export const errorLogger = new ErrorLogger();

// Helper functions
export const logError = (
  error: Error | string,
  errorInfo?: {
    filename?: string;
    lineno?: number;
    colno?: number;
    error?: Error;
  }
) => {
  errorLogger.logJavaScriptError(error, errorInfo);
};

export const logPromiseRejection = (event: PromiseRejectionEvent) => {
  errorLogger.logPromiseRejection(event);
};

export const logComponentError = (error: Error, errorInfo: ErrorInfo) => {
  errorLogger.logComponentError(error, errorInfo);
};

export const logAxiosError = (error: unknown) => {
  errorLogger.logAxiosError(error);
};

