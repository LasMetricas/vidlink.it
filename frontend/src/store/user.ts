import { atom } from "jotai";
export interface User {
  name: string;
  pic: string;
}
export const userAtom = atom<User>({
  name: "You",
  pic: "/icon/layout/avatar.png",
});
