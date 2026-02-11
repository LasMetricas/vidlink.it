// Centralized error handling with user-friendly messages and admin logging

interface ErrorLog {
  timestamp: string;
  action: string;
  error: string;
  details?: unknown;
  userId?: string;
}

// Store errors in localStorage for admin viewing (last 50 errors)
const ERROR_LOG_KEY = "vidlink_error_log";
const MAX_ERRORS = 50;

const getErrorLogs = (): ErrorLog[] => {
  if (typeof window === "undefined") return [];
  try {
    const logs = localStorage.getItem(ERROR_LOG_KEY);
    return logs ? JSON.parse(logs) : [];
  } catch {
    return [];
  }
};

const saveErrorLog = (log: ErrorLog) => {
  if (typeof window === "undefined") return;
  try {
    const logs = getErrorLogs();
    logs.unshift(log); // Add to beginning
    // Keep only last MAX_ERRORS
    const trimmed = logs.slice(0, MAX_ERRORS);
    localStorage.setItem(ERROR_LOG_KEY, JSON.stringify(trimmed));

    // Log to console for debugging (use warn to avoid Next.js error overlay)
    console.warn("[VidLink Error]", log);
  } catch (e) {
    console.error("Failed to save error log:", e);
  }
};

// Export for admin dashboard
export const getAdminErrorLogs = (): ErrorLog[] => getErrorLogs();
export const clearErrorLogs = () => {
  if (typeof window === "undefined") return;
  localStorage.removeItem(ERROR_LOG_KEY);
};

// User-friendly error messages based on action
const friendlyMessages: Record<string, string> = {
  // Auth
  login: "We couldn't sign you in. Please try again.",
  logout: "We couldn't sign you out. Please try again.",
  session_expired: "Your session has expired. Please sign in again.",

  // Video
  upload_video: "We couldn't upload your video. Please check your connection and try again.",
  publish_video: "We couldn't publish your video. Please try again.",
  fetch_video: "We couldn't load this video. Please refresh the page.",
  fetch_videos: "We couldn't load videos. Please refresh the page.",
  delete_video: "We couldn't delete this video. Please try again.",
  update_video: "We couldn't save your changes. Please try again.",

  // Cards
  save_card: "We couldn't save this card. Please try again.",
  delete_card: "We couldn't delete this card. Please try again.",
  fetch_cards: "We couldn't load cards. Please refresh the page.",

  // Profile
  fetch_profile: "We couldn't load this profile. Please refresh the page.",
  update_profile: "We couldn't save your profile changes. Please try again.",

  // General
  network: "Connection problem. Please check your internet and try again.",
  server: "Our servers are having issues. Please try again in a moment.",
  unknown: "Something unexpected happened. Please try again.",
};

export const logError = (
  action: string,
  error: unknown,
  details?: unknown
): string => {
  // Get user ID if available
  let userId: string | undefined;
  try {
    const userCookie = document.cookie.split("; ").find(row => row.startsWith("user="));
    if (userCookie) {
      const user = JSON.parse(decodeURIComponent(userCookie.split("=")[1]));
      userId = user._id;
    }
  } catch {}

  // Parse error message
  let errorMessage = "Unknown error";
  if (error instanceof Error) {
    errorMessage = error.message;
  } else if (typeof error === "string") {
    errorMessage = error;
  } else if (error && typeof error === "object" && "message" in error) {
    errorMessage = String((error as { message: unknown }).message);
  }

  // Save to log
  saveErrorLog({
    timestamp: new Date().toISOString(),
    action,
    error: errorMessage,
    details,
    userId,
  });

  // Return user-friendly message
  return friendlyMessages[action] || friendlyMessages.unknown;
};

// Helper for API errors
export const handleApiError = (
  action: string,
  response: { message?: string } | unknown,
  fallbackAction?: string
): string => {
  const actualAction = fallbackAction || action;

  // If response has a message, use it (it might be more specific)
  if (response && typeof response === "object" && "message" in response) {
    const msg = (response as { message?: string }).message;
    if (msg && msg !== "Something went wrong") {
      logError(actualAction, msg);
      return msg;
    }
  }

  return logError(actualAction, response);
};
