"use client";

import { SquareArrowOutUpRight, Users } from "lucide-react";
import { useState } from "react";
import { User } from "../..";
import { formatBigNum } from "@/utils/calculateBigNum";
import useVideo from "@/hooks/useVideo";
import { errorModal, successModal } from "@/utils/confirm";

interface Type {
  users: User[];
}
const UserAnalytics: React.FC<Type> = ({ users }) => {
  const { handleUserStatus, loading } = useVideo();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [allUsers, setAllUsers] = useState<User[]>(users);

  function formatDate(dateInput: string) {
    if (!dateInput) return ""; // handle empty or undefined values
    const date = new Date(dateInput);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // months are 0-indexed
    const year = date.getFullYear();
    return `${day} / ${month} / ${year}`;
  }

  const handleBlock = async (userId: string) => {
    if (loading) return;

    const res = await handleUserStatus(userId);

    if (res.status === 200 && "userStatus" in res) {
      successModal(res.message);
    } else {
      errorModal(res.message);
      return;
    }

    setAllUsers((prev) =>
      prev.map((user) =>
        user._id === userId ? { ...user, status: res.userStatus } : user
      )
    );
  };

  return (
    <>
      <div className="flex flex-col gap-[33px] uppercase mt-[70px]">
        <div className="flex items-center gap-[31px]">
          <h1 className="flex items-center gap-[9px] text-[20px] font-semibold">
            <Users className=" fill-foreground" />
            USERS
          </h1>
          <div className="border h-0 flex-1"></div>
        </div>
        <div
          className={`${
            isOpen ? " overflow-y-scroll overflow-x-hidden " : "overflow-hidden"
          } max-h-[350px] duration-500`}
        >
          <table className=" w-full ">
            <thead className="text-[16px] font-semibold">
              <tr className=" h-[31px]">
                <th className="text-left">USER MAIL</th>
                <th className="w-[]">
                  <div className="flex gap-[5.23px] items-center justify-center">
                    STATUS
                  </div>
                </th>
                <th className="w-[] ">
                  <div className="flex gap-[5.23px] items-center justify-center">
                    SIGN UP DATE
                  </div>
                </th>
                <th className="w-[] ">
                  <div className="flex gap-[5.23px] items-center justify-center">
                    LAST LOG IN
                  </div>
                </th>
                <th className="w-[] ">
                  <div className="flex gap-[5.23px] items-center justify-center">
                    VIDEOS
                  </div>
                </th>
                <th className="w-[] ">
                  <div className="flex gap-[5.23px] items-center justify-center">
                    CARDS
                  </div>
                </th>
                <th className="w-[] ">
                  <div className="flex gap-[5.23px] items-center justify-center">
                    ACTIONS
                  </div>
                </th>
                <th className="w-[] ">
                  <div className="flex gap-[5.23px] items-center justify-center">
                    PROFILE
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="font-bold text-[20px]">
              {allUsers?.map((item, index) => (
                <tr key={index} className="h-8">
                  <td className="font-normal text-[16px] italic lowercase">
                    <a href={`mailto:${item.email}`}>{item.email}</a>
                  </td>
                  <td className="w-[]">
                    <div className="flex gap-[5.23px] items-center justify-center">
                      {item.status || "active"}
                    </div>
                  </td>
                  <td className="w-[] ">
                    <div className="flex gap-[5.23px] items-center justify-center font-normal text-[16px]">
                      {formatDate(item.signupAt)}
                    </div>
                  </td>
                  <td className="w-[]">
                    <div className="flex gap-[5.23px] items-center justify-center font-normal text-[16px]">
                      {formatDate(item.lastLoginAt || item.signupAt)}
                    </div>
                  </td>
                  <td className="w-[]">
                    <div className="flex gap-[5.23px] items-center justify-center">
                      {formatBigNum(item.videos)}
                    </div>
                  </td>
                  <td className="w-[]">
                    <div className="flex gap-[5.23px] items-center justify-center">
                      {formatBigNum(item.cards)}
                    </div>
                  </td>
                  <td className="w-[]">
                    <button
                      onClick={() => handleBlock(item._id)}
                      className={`${
                        item.status === "active"
                          ? " text-[red]"
                          : "text-foreground"
                      } flex justify-center w-full`}
                    >
                      {item.status === "active" ? "BLOCK" : "UNBLOCK"}
                    </button>
                  </td>
                  <td className="w-[] flex justify-center">
                    <a
                      href={`/profile/${item._id}`}
                      target="_blank"
                      className="flex gap-[5.23px] items-center justify-center"
                    >
                      <SquareArrowOutUpRight className="size-[19px]" />
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button
          onClick={() => setIsOpen(true)}
          className="border text-[16px] font-semibold rounded-[5px] flex items-center justify-center w-[128px] h-[32px]"
        >
          SHOW MORE
        </button>
      </div>
    </>
  );
};
export default UserAnalytics;
