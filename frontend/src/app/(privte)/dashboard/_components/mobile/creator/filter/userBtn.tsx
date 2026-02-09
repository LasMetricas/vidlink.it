interface Type {
  setFilter(value: string): void;
  name: string;
  filter: string;
}
const UserBtn: React.FC<Type> = ({ setFilter, name, filter }) => {
  return (
    <button
      onClick={() => setFilter(name)}
      className={`${
        filter === name ? "text-white bg-blue" : "text-background bg-[#191919]"
      } h-[34px] flex justify-center items-center rounded-[7px] tracking-wider w-full pt-[1px] font-bold text-[14px]`}
    >
      {name.toUpperCase()}
    </button>
  );
};
export default UserBtn;
