interface Type {
  handleNext(): void;
  no: number;
  start: number;
}
const CardNext: React.FC<Type> = ({ handleNext, no, start }) => {
  return (
    <>
      <div className="border-[0.7px] rounded-[6px] w-[32%] p-[5.9px] flex flex-col gap-[11px]">
        <div className="text-[13.86px] font-semibold">
          {no < 10 ? `0${no}` : no}
        </div>
        <div className="flex flex-col items-center h-[38.4px] w-full justify-between">
          <button onClick={handleNext} className="text-[13.86px] font-semibold">
            NEXT
          </button>
          <div className="flex items-center gap-[6px] h-[22.51px]">
            <img src="/icon/detail/card/clock.svg" alt="" />
            <div className="text-[13.86px] font-normal">
              <i>
                ({Math.floor(start / 60)}:
                {start % 60 < 10 ? `0${start % 60}` : start % 60})
              </i>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default CardNext;
