interface Type {
  setGender(value: string): void;
  name: string;
  setIsOpen(value: boolean): void;
}
const GenderBtn: React.FC<Type> = ({ name, setGender, setIsOpen }) => {
  return (
    <>
      <button
        onClick={() => {
          setGender(name.toLowerCase());
          setIsOpen(false);
        }}
        className="text-left text-[17px]"
      >
        {name}
      </button>
    </>
  );
};
export default GenderBtn;
