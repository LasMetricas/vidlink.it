import { UserInfoViewerType } from "..";
import AmountItem from "../amountItem";

interface Type {
  userInfo: UserInfoViewerType | null;
}
const Viewer: React.FC<Type> = ({ userInfo }) => {
  return (
    <>
      <div className="mt-[16px] flex flex-col gap-[12px]">
        <div className="flex gap-[8.46px]">
          <AmountItem name="VIDEOS REPRODUCED" value={0} src="reproduce" />
          <AmountItem
            name="VIDEOS LIKED"
            value={userInfo?.likeVideos || 0}
            src="like"
          />
        </div>
        <div className="flex gap-[8.46px]">
          <AmountItem name="COMMENTS" value={0} src="comment" />
          <AmountItem name="CARD SUGGESTIONS" value={0} src="card" />
        </div>
        <div className="flex gap-[8.46px]">
          <AmountItem
            name="CARDS CLICKED"
            value={userInfo?.cardsClicks || 0}
            src="click"
          />
          <AmountItem
            name="CARD SAVED"
            value={userInfo?.savedCards || 0}
            src="save"
          />
        </div>
      </div>
    </>
  );
};

export default Viewer;
