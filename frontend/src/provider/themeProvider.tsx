"use client";

import dynamic from "next/dynamic";
import { type ThemeProviderProps } from "next-themes";

const DynamicThemeProvider = dynamic(
  () => import("next-themes").then((mod) => mod.ThemeProvider),
  { ssr: false }
);

export default function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <DynamicThemeProvider {...props}>{children}</DynamicThemeProvider>;
}
