interface Type {
  nav: string;
  setNav(value: string): void;
  name: string;
}
const NavItem: React.FC<Type> = ({ nav, setNav, name }) => {
  return (
    <>
      <div
        className={`${
          name === "videos"
            ? "items-start"
            : name === "cards"
            ? "items-center"
            : "items-end"
        } flex flex-col text-[12px] font-semibold tracking-widest`}
      >
        <button
          onClick={() => setNav(name)}
          className="flex flex-col items-center justify-between h-[37px] w-[65.67px]"
        >
          <img
            className={`${nav === name ? "block" : "hidden"}`}
            width={20}
            height={20}
            src={`/icon/profile/${name}Blue.png`}
            alt=""
            loading="eager"
          />
          <img
            className={`${nav === name ? "hidden" : "block"}`}
            width={20}
            height={20}
            src={`/icon/profile/${name}.png`}
            alt=""
            loading="eager"
          />
          <div className={nav === name ? "text-blue" : ""}>
            {name.toUpperCase()}
          </div>
        </button>
        <div
          className={`${
            name === nav ? "border-blue" : "border-transparent"
          } border-[2px] w-[95px] rounded-full mt-[17px]`}
        ></div>
      </div>
    </>
  );
};
export default NavItem;
