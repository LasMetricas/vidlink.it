import { CardType, UserInfoType } from "../../../page";
import AmountItem from "../amountItem";

interface Type {
  userInfo: UserInfoType | null;
  cards: CardType[];
}
const Total: React.FC<Type> = ({ userInfo, cards }) => {
  return (
    <div className="mt-[12px] flex flex-col gap-[12px]">
      <div className="flex gap-[8.46px]">
        <AmountItem name="COMMENTS" value={0} src="comment" />
        <AmountItem name="TOTAL CARD CREATED" value={cards.length} src="card" />
      </div>
      <div className="flex gap-[8.46px]">
        <AmountItem
          name="TOTAL CARDS CLICKED"
          value={userInfo?.cardsClicks || 0}
          src="click"
        />
        <AmountItem
          name="TOTAL CARD SAVED"
          value={userInfo?.savedCards || 0}
          src="save"
        />
      </div>
      <div className="flex gap-[8.46px]">
        <AmountItem
          name="FOLLOWRES GAINED"
          value={userInfo?.gainedFollowers || 0}
          src="gain"
        />
        <AmountItem
          name="FOLLOWERS LOST"
          value={userInfo?.lostFollowers || 0}
          src="lost"
        />
      </div>
    </div>
  );
};
export default Total;
