interface Type {
  name: string;
  time: string;
}
const ModalCard: React.FC<Type> = ({ name, time }) => {
  return (
    <>
      <div className="border-[0.7px] border-black rounded-[6px] w-[122.41px] h-[94.5px] p-[5.9px] flex flex-col justify-between">
        <div className="text-[13.86px] font-semibold flex justify-between w-full items-center">
          <div>01</div> <i className="font-normal">({time})</i>
        </div>
        <div className="flex flex-col items-center h-[38.4px] w-full mt-[8px] justify-between">
          <h1 className="text-[13.86px] font-semibold">{name.toUpperCase()}</h1>
          <img src={`/icon/detail/card/${name}2.svg`} alt="" />
        </div>
        <div className="flex justify-between h-">
          <img className="size-[22.51px]" src="/icon/detail/card/leftBlack.png" alt="" />
          <img className="size-[22.51px]" src="/icon/detail/card/rightBlack.png" alt="" />
        </div>
      </div>
    </>
  );
};
export default ModalCard;
