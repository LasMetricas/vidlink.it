interface Type {
  name: string;
  holderName: string;
}
const LinkItem: React.FC<Type> = ({ name, holderName }) => {
  return (
    <>
      <label className="flex flex-col justify-between h-[40.75px]">
        <span className="text-[11.63px] leading-[10px] font-normal flex items-center gap-[3.32px]">
          {name}
          <img
            className="size-[9.97px]"
            src={`/icon/detail/${name.toLowerCase()}.png`}
            alt=""
          />
        </span>
        <input
          type="text"
          placeholder={holderName}
          className={`h-[26.62px] ${
            name === "Link" ? "w-full" : "max-w-[74.38px]"
          }  bg-white rounded-[3.32px] px-[8.31px] placeholder-[#D5D9DF] placeholder:text-[13px] placeholder:font-semibold`}
        />
      </label>
    </>
  );
};
export default LinkItem;
