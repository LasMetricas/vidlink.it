import { Clock3, ChevronRight } from "lucide-react";

interface Type {
  handleNext(): void;
  start: number;
}

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins < 10 ? `0${mins}` : mins}:${secs < 10 ? `0${secs}` : secs}`;
};

const CardNext: React.FC<Type> = ({ handleNext, start }) => {
  return (
    <button
      onClick={handleNext}
      className="w-[174px] h-[50px] flex items-center justify-center bg-white/10 hover:bg-white/20 border border-white/30 rounded-[12px] text-white text-[14px] font-semibold gap-2 transition-all hover:scale-105"
    >
      <Clock3 className="w-5 h-5 text-blue" />
      <span>NEXT @ {formatTime(start)}</span>
      <ChevronRight className="w-4 h-4" />
    </button>
  );
};

export default CardNext;
