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
    <div className="space-y-3">
      {slicedUsers.map((item) => {
        const img = makeAbsoluteImageUrl(item.userPicture) || baseProfile;

        return (
          <div
            key={item.rank}
            onClick={() => goUserPage(item.userId)}
            className="w-[400px] min-w-[260px] px-4 py-3 rounded-xl bg-white border border-[#E5E7EB] shadow-sm 
            flex items-center justify-between cursor-pointer"
          >
            {/* 왼쪽 영역 */}
            <div className="flex items-center gap-3">
              {/* 랭크 */}
              <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-[#F3F4F6] text-[#374151] text-[12px] font-bold">
                {item.rank}
              </span>

              {/* 프로필 + 이름 */}
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-[#F9FAFB] border border-[#E5E7EB] overflow-hidden">
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

                <span className="text-[13px] font-semibold">
                  {item.userName}
                </span>
              </div>
            </div>

            {/* 포인트 */}
            <div className="flex items-center gap-1 text-[12px] text-[#4D4D4D]">
              <TbCoin size={12} />
              {item.points.toLocaleString()}
            </div>
          </div>
        );
      })}
    </div>
  );
}
