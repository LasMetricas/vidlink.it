// Utility for managing upload flow data in localStorage

export interface UploadData {
  videoLink: string;
  duration: number;
  title: string;
  description: string;
  info: string;
  cards: Array<{
    id?: string;
    name: string;
    link: string;
    start: number;
    no: number;
    isSaved?: boolean;
  }>;
  step: number;
  isVertical: boolean;
}

const STORAGE_KEY = "vidlink_upload_data";

const defaultData: UploadData = {
  videoLink: "",
  duration: 0,
  title: "",
  description: "",
  info: "",
  cards: [],
  step: 1,
  isVertical: false,
};

export const getUploadData = (): UploadData => {
  if (typeof window === "undefined") return defaultData;
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      return { ...defaultData, ...JSON.parse(data) };
    }
  } catch (e) {
    console.error("Error reading upload data:", e);
  }
  return defaultData;
};

export const setUploadData = (data: Partial<UploadData>): void => {
  if (typeof window === "undefined") return;
  try {
    const current = getUploadData();
    const updated = { ...current, ...data };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error("Error saving upload data:", e);
  }
};

export const clearUploadData = (): void => {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.error("Error clearing upload data:", e);
  }
};

export const getUploadStep = (): number => {
  return getUploadData().step;
};

export const setUploadStep = (step: number): void => {
  setUploadData({ step });
};
