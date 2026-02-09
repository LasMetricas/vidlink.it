const AmountItem = ({ number, label }: { number: number; label: string }) => {
  return (
    <>
      <div className="flex flex-col items-center gap-[8.45px] font-semibold tracking-wide">
        <div className="text-[17px]  text-blue">{number}</div>
        <div className="text-[7px] font-semibold">{label}</div>
      </div>
    </>
  );
};
export default AmountItem;
