import React from "react";
import { TbCoin } from "react-icons/tb";
import baseProfile from "../../assets/baseProfile.png";
import { makeAbsoluteImageUrl } from "../../utils/imageHelper";
import { useNavigate } from "react-router-dom";

export default function MainRankingList({ users = [] }) {
  const navigate = useNavigate();

  if (!users.length) return null;

  const slicedUsers = users.slice(3, 7).map((user, i) => ({
    ...user,
    rank: 4 + i,
  }));

  const goUserPage = (userId) => {
    if (!userId) return;
    navigate(`/my-paged/${userId}`);
  };

  return (
    <div className="space-y-2 sm:space-y-3 w-full flex flex-col items-center">
      {slicedUsers.map((item) => {
        const img = makeAbsoluteImageUrl(item.userPicture) || baseProfile;

        return (
          <div
            key={item.rank}
            onClick={() => goUserPage(item.userId)}
            className="w-full max-w-[400px] px-3 sm:px-4 py-2 sm:py-3 rounded-xl bg-white border border-[#E5E7EB] shadow-sm 
            flex items-center justify-between cursor-pointer"
          >
            {/* 왼쪽 영역 */}
            <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
              {/* 랭크 */}
              <span className="inline-flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#F3F4F6] text-[#374151] text-[11px] sm:text-[12px] font-bold shrink-0">
                {item.rank}
              </span>

              {/* 프로필 + 이름 */}
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#F9FAFB] border border-[#E5E7EB] overflow-hidden shrink-0">
                  <img
                    src={img}
                    alt={item.userName}
                    className="w-full h-full object-cover block"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = baseProfile;
                    }}
                  />
                </div>

                <span className="text-[12px] sm:text-[13px] font-semibold truncate">
                  {item.userName}
                </span>
              </div>
            </div>

            {/* 포인트 */}
            <div className="flex items-center gap-1 text-[11px] sm:text-[12px] text-[#4D4D4D] shrink-0 ml-2">
              <TbCoin size={11} className="sm:w-[12px] sm:h-[12px]" />
              {item.points.toLocaleString()}
            </div>
          </div>
        );
      })}
    </div>
  );
}
