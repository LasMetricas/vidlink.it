interface Type {
  setValue(value: string): void;
  name: string;
  holderName: string;
  value: string;
}
const LinkItem: React.FC<Type> = ({ setValue, name, holderName, value }) => {
  return (
    <>
      <label className="w-full flex flex-col justify-between h-[54.01px]">
        <span className="text-[10.32px] font-semibold flex items-center gap-[8.03px]">
          {name.toUpperCase()}
          <img src={`/icon/settings/${name}.png`} alt="" />
        </span>
        <input
          value={value.trim()}
          onChange={(e) => setValue(e.target.value)}
          type="text"
          placeholder={holderName}
          className={`${
            value
              ? "bg-blue border-none"
              : "bg-[#3E3E3E66] border-[#272727] border-[3.12px]"
          } h-[40px] text-[14px] py-[2px] rounded-[10.41px] px-[11.47px] placeholder-[#4F4F4F] placeholder:text-[13px] placeholder:font-semibold`}
        />
      </label>
    </>
  );
};
export default LinkItem;
