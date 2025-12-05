import React from "react";
import { TbCoin } from "react-icons/tb";
import baseProfile from "../../assets/baseProfile.png";
import { makeAbsoluteImageUrl } from "../../utils/imageHelper";
import { useNavigate } from "react-router-dom";

function SmallTopCard({ rank, name, score, profileImage, onClick }) {
  const toneMap = {
    1: "bg-[#FEF9C3] border-[#FACC15]", // 1등
    2: "bg-[#F3F4F6] border-[#D1D5DB]", // 2등
    3: "bg-[#FFE4D6] border-[#FDBA74]", // 3등
  };

  const toneClass = toneMap[rank] || "bg-white border-[#E5E7EB]";

  // 이미지 절대 경로 변환
  const finalImg = makeAbsoluteImageUrl(profileImage) || baseProfile;

  return (
    <div
      onClick={onClick}
      className={`w-[120px] h-[120px] sm:w-[140px] sm:h-[140px] lg:w-[160px] lg:h-[160px] p-2 sm:p-3 flex flex-col items-center justify-center 
      rounded-xl shadow-sm border ${toneClass} cursor-pointer`}
    >
      {/* 등수 */}
      <div className="w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center rounded-full bg-white/70 text-[10px] sm:text-[11px] font-bold border border-black/10">
        {rank}
      </div>

      {/* 프로필 */}
      <div className="mt-2 sm:mt-3 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/50 flex items-center justify-center border border-black/10 overflow-hidden">
        <img
          src={finalImg}
          alt={`${name} profile`}
          className="w-full h-full object-cover block"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = baseProfile;
          }}
        />
      </div>

      {/* 이름 + 포인트 */}
      <div className="mt-1 sm:mt-2 text-center">
        <div className="text-[11px] sm:text-[12px] lg:text-[13px] font-semibold truncate w-full px-1">{name}</div>
        <div className="flex items-center justify-center gap-1 text-[10px] sm:text-[11px] lg:text-[12px] text-[#4D4D4D] mt-1">
          <TbCoin size={10} className="sm:w-[12px] sm:h-[12px]" />
          {Number(score || 0).toLocaleString()}
        </div>
      </div>
    </div>
  );
}

export default function MainTop3({ users = [] }) {
  const navigate = useNavigate();

  if (!users || users.length === 0) return null;

  const [first, second, third] = users.slice(0, 3);

  const goUserPage = (userId) => {
    if (!userId) return;
    navigate(`/my-paged/${userId}`);
  };

  return (
    <div className="mt-6 sm:mt-8 lg:mt-10">
      <div className="flex items-end justify-center gap-2 sm:gap-3">
        {/* 2등 */}
        {second && (
          <div className="translate-y-1 sm:translate-y-2">
            <SmallTopCard
              rank={2}
              name={second.userName}
              score={second.points}
              profileImage={second.userPicture}
              onClick={() => goUserPage(second.userId)}
            />
          </div>
        )}

        {/* 1등 */}
        {first && (
          <div className="-translate-y-1 sm:-translate-y-2">
            <SmallTopCard
              rank={1}
              name={first.userName}
              score={first.points}
              profileImage={first.userPicture}
              onClick={() => goUserPage(first.userId)}
            />
          </div>
        )}

        {/* 3등 */}
        {third && (
          <div className="translate-y-1 sm:translate-y-2">
            <SmallTopCard
              rank={3}
              name={third.userName}
              score={third.points}
              profileImage={third.userPicture}
              onClick={() => goUserPage(third.userId)}
            />
          </div>
        )}
      </div>
    </div>
  );
}
