interface Type {
  setFilter(value: string): void;
  name: string;
  period: string;
  filter: string;
}
const PeriodBtn: React.FC<Type> = ({ setFilter, name, period, filter }) => {
  return (
    <button
      onClick={() => setFilter(filter)}
      className={`${
        period === filter
          ? "text-white bg-blue"
          : "text-background bg-[#191919]"
      } h-[34px] flex justify-center items-center rounded-[7px] tracking-wider w-full py-[1px] font-bold text-[14px]`}
    >
      {name.toUpperCase()}
    </button>
  );
};
export default PeriodBtn;
