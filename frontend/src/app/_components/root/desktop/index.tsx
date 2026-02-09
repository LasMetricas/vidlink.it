"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Loading from "@/app/_components/ui/loading";

export type Video = {
  _id: string;
  videoLink: string;
  title: string;
  info: string;
  duration: number;
  views: number;
  user: { _id: string; userName: string; picture: string };
  createdAt: string;
};

export default function HomeDesktop() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/upload");
  }, [router]);

  return <Loading />;
}
