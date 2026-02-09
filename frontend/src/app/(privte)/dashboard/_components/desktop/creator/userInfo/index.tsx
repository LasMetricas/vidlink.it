import FltButtons from "./fltButtons";

interface Type {
  setUser(value: string): void;
  setPeriod(value: string): void;
  user: string;
  period: string;
  picture?: string | null;
  userName?: string | null;
  isAdmin?: boolean | null;
}
const UserInfo: React.FC<Type> = ({
  setUser,
  setPeriod,
  user,
  period,
  picture,
  userName,
  isAdmin,
}) => {
  return (
    <div className="flex justify-between gap-[150px]">
      <div className="flex flex-grow-0 gap-[50px] items-start">
        {picture ? (
          <img src={picture} alt="" className="size-[225px] rounded-full" />
        ) : (
          <span className="size-[225px]"></span>
        )}
        <div className="py-[14px]">
          <h1 className="text-[40px] font-semibold uppercase max-w-1">
            dashboard
          </h1>
          <div className="text-[14px] uppercase mb-[34px] mt-[12px]">
            @{userName ?? ""}
          </div>
          <p className="text-[18px] font-normal text-justify leading-5">
            This panel displays analytics about your activity in Vidlink. You
            can see your data both as a viewer and as a creator. To change the
            layout, click the button on the right side of the screen. The
            dashboard also includes stats for the cards and a visual graph with
            various options to help you track your progress easily.
            Additionally, you can download your dashboard for a selected time
            frame.
          </p>
        </div>
      </div>
      <FltButtons
        setUser={setUser}
        setPeriod={setPeriod}
        user={user}
        period={period}
        isAdmin={isAdmin ?? false}
      />
    </div>
  );
};
export default UserInfo;
