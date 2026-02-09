import { RelatedUser } from "../../../page";
import Link from "next/link";
import { formatBigNum } from "@/utils/calculateBigNum";

interface Type {
  relatedUsers: RelatedUser[] | null;
}

const RelatedUsers: React.FC<Type> = ({ relatedUsers }) => {
  if (!relatedUsers || relatedUsers.length === 0) return null;

  return (
    <div className="w-full mt-[145px]">
      <h2 className="text-[33px] text-blue mb-[51px] font-semibold">
        RELATED PROFILES
      </h2>

      <div className="flex items-center gap-[100px] font-semibold text-[16px] uppercase">
        {relatedUsers.map((user) => (
          <Link
            key={user._id}
            href={`/profile/${user._id}`}
            className="text-center text-white"
          >
            {/* Profile Picture */}
            <div className="w-[190px] h-[190px] rounded-full overflow-hidden mx-auto mb-3">
              {user.picture ? (
                <img
                  src={user.picture}
                  alt={user.userName}
                  width={190}
                  height={190}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-500" />
              )}
            </div>
            <div className="flex flex-col items-center justify-between h-[95px] w-full">
              <span className="text-blue font-bold mb-1">@{user.userName}</span>
              <span className="mb-[2px]">
                {formatBigNum(user.totalVideos)} VIDEOS
              </span>
              <span className="mb-[6px]">
                {formatBigNum(user.followers)} FOLLOWERS
              </span>
              <div className="flex justify-center items-center gap-[5px] font-medium">
                <img
                  src="/icon/desktop/profile/sticker.png"
                  alt="cards"
                  className="size-[18px]"
                />
                {formatBigNum(user.totalCards)}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RelatedUsers;
