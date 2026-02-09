interface Type {
  picture?: string | null;
}
const UserInfo: React.FC<Type> = ({ picture }) => {
  return (
    <>
      <div className="font-semibold flex flex-col items-center w-full px-[39px] gap-[39px]">
        <div className="size-[146px]">
          {picture ? (
            <img
              width={146}
              height={146}
              className="size-[146px] rounded-full"
              src={picture}
              alt=""
              loading="eager"
            //   priority
            />
          ) : (
            <span className="size-[146px]"></span>
          )}
        </div>
        <div className="text-[13.55px] w-full flex gap-[10px] items-center mx-[38px] justify-between">
          <span className={`text-blue`}>LVL&nbsp;49</span>
          <div className="relative w-full h-[9.23px] rounded-full bg-[#3C4450]">
            <span className={`text-blue absolute top-[18.1px] left-0`}>
              37846
            </span>
            <span
              className={`bg-blue absolute left-0 h-[9.23px] rounded-full w-[80%]`}
            ></span>
            <span className={`text-[#3C4450] absolute top-[18.1px] right-0`}>
              50000
            </span>
          </div>
          <span className={`text-[#3C4450]`}>LVL&nbsp;50</span>
        </div>
      </div>
    </>
  );
};
export default UserInfo;
