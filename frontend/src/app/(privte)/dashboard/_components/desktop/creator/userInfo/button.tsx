interface Type {
  name: string;
  value: string;
  setValue(value: string): void;
}

const Button: React.FC<Type> = ({ name, value, setValue }) => {
  return (
    <>
      <button
        onClick={() => setValue(value)}
        className={`flex items-center justify-center gap-[8px] w-[234px] h-[49px] rounded-[7px] uppercase font-semibold text-[19px] border-foreground border-[2px]`}
      >
        {name}
      </button>
    </>
  );
};
export default Button;
