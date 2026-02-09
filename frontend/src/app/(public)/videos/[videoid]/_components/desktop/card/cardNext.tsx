import { Clock3 } from "lucide-react";

interface Type {
  handleNext(): void;
  start: number;
}
const CardNext: React.FC<Type> = ({ handleNext, start }) => {
  return (
    <button
      onClick={handleNext}
      className="w-[174px] h-[43px] flex items-center justify-center border border-white rounded-[7px] text-white text-[18px] font-semibold gap-[15px]"
    >
      <Clock3 className="size-[25px]"/>
      NEXT ({Math.floor(start / 60)}:
      {start % 60 < 10 ? `0${start % 60}` : start % 60})
    </button>
  );
};
export default CardNext;
