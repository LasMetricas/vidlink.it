"use client";
import UserBtn from "./userBtn";
import PeriodBtn from "./periodBtn";

interface Type {
  setUser(value: string): void;
  setPeriod(value: string): void;
  user: string;
  period: string;
}
const Filter: React.FC<Type> = ({ setUser, setPeriod, user, period }) => {
  return (
    <div className="mt-[51.82px]">
      <div className="flex justify-between gap-[5px]">
        <UserBtn setFilter={setUser} name="creator" filter={user} />
        <UserBtn setFilter={setUser} name="viewer" filter={user} />
      </div>
      <div className="flex justify-between gap-[5px] mt-[15px]">
        <PeriodBtn setFilter={setPeriod} name="7 days" period={period} filter='week'/>
        <PeriodBtn setFilter={setPeriod} name="30 days" period={period} filter='month'/>
        <PeriodBtn setFilter={setPeriod} name="1 year" period={period} filter='year'/>
        <PeriodBtn setFilter={setPeriod} name="ever" period={period} filter='ever'/>
      </div>
    </div>
  );
};
export default Filter;
