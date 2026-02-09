import { useCallback, useEffect } from "react";
import InputItem from "../item/inputItem";
import useVideo from "@/hooks/useVideo";
import { errorModal } from "@/utils/confirm";

interface Type {
  setUserName(value: string): void;
  setCaution(value: string): void;
  setCheckingName(value: boolean): void;
  userName: string;
}

const Index: React.FC<Type> = ({
  setUserName,
  setCaution,
  setCheckingName,
  userName,
}) => {
  const { checkUserName, loading } = useVideo();
  //validate the user name if there already is such username.
  const validateUserName = useCallback(
    async (userName: string) => {
      if (/[!@#$%^&*?><":;'`]/.test(userName)) {
        setCaution("You can't use special characters in your username.");
        return;
      } else {
        setCaution("");
      }
      const res = await checkUserName(userName);
      if (res.status === 200 && "isAlreadyOne" in res) {
        if (res.isAlreadyOne) setCaution("This username is already in use.");
      } else {
        errorModal(res.message || "Something went wrong");
        setCaution(res.message);
      }
    }, // Adjust debounce delay as needed
    [checkUserName, setCaution]
  );
  useEffect(() => {
    if (userName && !loading) {
      setCheckingName(true);
      const check = setTimeout(() => {
        validateUserName(userName);
      }, 500);
      setCheckingName(false);
      return () => clearTimeout(check);
    }
    if (!userName) {
      setCaution("");
    }
  }, [userName]);

  return (
    <>
      <InputItem
        name="username"
        holderName="Text"
        setValue={setUserName}
        value={userName.trim().toLowerCase()}
      />
    </>
  );
};
export default Index;
