import { formatBigNum } from "@/utils/calculateBigNum";

interface Type {
  name: string;
  amount: number;
}
const DetailItem: React.FC<Type> = ({ name, amount }) => {
  return (
    <>
      <div className="uppercase text-[20px] flex justify-between items-center gap-[35px]">
        {name}
        <span className="text-blue font-bold text-[32px]">
          {formatBigNum(amount)}
        </span>
      </div>
    </>
  );
};
export default DetailItem;
