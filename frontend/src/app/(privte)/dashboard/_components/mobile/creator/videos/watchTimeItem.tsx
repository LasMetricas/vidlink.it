import { Clock } from "lucide-react";

interface Type {
  name: string;
  watchTime: number;
}
const WatchTimeItem: React.FC<Type> = ({ name, watchTime }) => {
  return (
    <>
      <div className="flex flex-col items-center justify-center gap-[6px] tracking-wider font-semibold w-full text-foreground h-[64.26px] rounded-[8px] bg-[#191919] py-[2px] overflow-hidden">
        <span className="text-[10px]">{name.toUpperCase()}</span>
        <div className="flex gap-[6px] items-center text-[25.7px]">
          <Clock className="size-[18.53px]" />
          {watchTime ? (
            <span>
              {watchTime < 60
                ? `${watchTime < 10 ? 0 : ""}${Math.floor(watchTime)}s`
                : watchTime < 3600
                ? `${Math.floor(watchTime / 60) < 10 ? 0 : ""}${Math.floor(
                    watchTime / 60
                  )}m ${Math.floor(watchTime % 60)}s`
                : `${Math.floor(watchTime / 3600) < 10 ? 0 : ""}${Math.floor(
                    watchTime / 3600
                  )}h ${Math.floor((watchTime % 3660) / 60)}m` || 0}
            </span>
          ) : (
            "000"
          )}
        </div>
      </div>
    </>
  );
};
export default WatchTimeItem;
