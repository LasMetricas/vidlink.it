import { formatBigNum } from "@/utils/calculateBigNum";

const AmountItem = ({ amount, label }: { amount: number; label: string }) => {
  return (
    <>
      <div className="flex flex-col font items-center gap-[9px] text-[12px] uppercase">
        <span className="text-[28px]">{formatBigNum(amount ?? 0)}</span>
        {label}
      </div>
    </>
  );
};
export default AmountItem;
