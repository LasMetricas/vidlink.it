import AmountItem from "./amountItem";
import Cookies from "js-cookie";
import { signOut } from "next-auth/react";
import NavBtn from "./navBtn";
// import EditPic from "./editPic";

interface Type {
  picture?: string | null;
  totalVideos?: number | null;
  totalCards?: number | null;
  followers?: number | null;
  bio?: string | null;
}
const Index: React.FC<Type> = ({
  picture,
  totalVideos,
  totalCards,
  followers,
  bio,
}) => {
  // const [isOpen, setIsOpen] = useState<boolean>(false);
  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/login" });
    Cookies.remove("token");
    Cookies.remove("reqUrl");
    Cookies.remove("user");
  };
  return (
    <>
      <div className="relative size-[146px] mx-auto ">
        {picture ? (
          <img
            width={146}
            height={146}
            className="size-[146px] rounded-full"
            src={picture}
            alt=""
            loading="eager"
            // priority
            referrerPolicy="no-referrer"
          />
        ) : (
          <span className="size-[146px]"></span>
        )}
        <a
          href="/settings"
          // onClick={() => setIsOpen(!isOpen)}
          className="absolute top-[9px] size-[18px] right-[17px]"
        >
          <img src="/icon/profile/edit.png" alt="" />
        </a>
        {/* {isOpen && <EditPic setIsOpen={setIsOpen} />} */}
      </div>
      <div className="mx-[91px] mt-[28px] mb-[28px]">
        <div className="flex justify-between mb-[21px]">
          <AmountItem number={followers || 0} label="FOLLOWING" />
          <AmountItem number={totalCards || 0} label="CARDS ADDED" />
          <AmountItem number={totalVideos || 0} label="VIDEOS" />
        </div>
        <div className="text-center text-[13px]">{bio}</div>
        <div className="flex flex-col gap-[5.47px] mt-[5px]">
          <NavBtn name="DASHBOARD" link="dashboard" />
          <NavBtn name="DRAFTS" link="upload" />
          <NavBtn name="SETTINGS" link="settings" />
          <button
            onClick={handleSignOut}
            className="h-[28.88px] bg-[#002355] rounded-[4.97px] flex items-center py-[2px]  justify-center text-[10.5px] font-semibold"
          >
            LOG OUT
          </button>
        </div>
      </div>
    </>
  );
};
export default Index;
