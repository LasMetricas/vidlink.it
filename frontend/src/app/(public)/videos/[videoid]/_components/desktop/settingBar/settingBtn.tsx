interface Type {
  handleSet(): void;
  setIsHovered(value: string): void;
  name: string;
  value: boolean;
  isHovered: string;
}
const SettingBtn: React.FC<Type> = ({
  handleSet,
  setIsHovered,
  name,
  value,
  isHovered,
}) => {
  return (
    <>
      <button onClick={handleSet} className="flex flex-col items-center gap-[10px] uppercase tracking-wide">
        {!value ? (
          <img
            src={
              name === isHovered
                ? `/icon/desktop/detail/${name}_blue_blank.png`
                : `/icon/desktop/detail/${name}.png`
            }
            className="size-[47px]"
            alt="heart"
            onMouseEnter={() => setIsHovered(name)}
            onMouseLeave={() => setIsHovered("")}
          />
        ) : (
          <img
            src={`/icon/desktop/detail/${name}_blue_fill.png`}
            className="size-[47px]"
            alt=""
          />
        )}
        {name}
      </button>
    </>
  );
};
export default SettingBtn;
