interface Type {
  name: string;
  holderName: string;
}
const InputItem: React.FC<Type> = ({ name, holderName }) => {
  return (
    <>
      <label className="w-full flex flex-col justify-between h-[40.75px]">
        <span className="text-[11.63px] font-normal">
          {name}
        </span>
        <input
          type="text"
          placeholder={holderName}
          className="h-[26.62px] bg-white rounded-[3.32px] px-[8.31px] placeholder-[#D5D9DF] placeholder:text-[13.3px] placeholder:font-normal "
        />
      </label>
    </>
  );
};
export default InputItem;
