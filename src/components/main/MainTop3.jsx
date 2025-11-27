import React from "react";
import { TbCoin } from "react-icons/tb";
import baseProfile from "../../assets/baseProfile.png";
import { makeAbsoluteImageUrl } from "../../utils/imageHelper";

function SmallTopCard({ rank, name, score, profileImage }) {
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
      className={`w-[160px] h-[160px] p-3 flex flex-col items-center justify-center 
      rounded-xl shadow-sm border ${toneClass}`}
    >
      {/* 등수 */}
      <div className="w-6 h-6 flex items-center justify-center rounded-full bg-white/70 text-[11px] font-bold border border-black/10">
        {rank}
      </div>

      {/* 프로필 */}
      <div className="mt-3 w-12 h-12 rounded-full bg-white/50 flex items-center justify-center border border-black/10 overflow-hidden">
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
      <div className="mt-2 text-center">
        <div className="text-[13px] font-semibold">{name}</div>
        <div className="flex items-center justify-center gap-1 text-[12px] text-[#4D4D4D] mt-1">
          <TbCoin size={12} />
          {Number(score || 0).toLocaleString()}
        </div>
      </div>
    </div>
  );
}

export default function MainTop3({ users = [] }) {
  if (!users || users.length === 0) return null;

  const [first, second, third] = users.slice(0, 3);

  return (
    <div className="mt-10">
      <div className="flex items-end justify-center gap-3">
        {/* 2등 */}
        {second && (
          <div className="translate-y-1">
            <SmallTopCard
              rank={2}
              name={second.userName}
              score={second.points}
              profileImage={second.userPicture}
            />
          </div>
        )}

        {/* 1등 */}
        {first && (
          <div className="-translate-y-2">
            <SmallTopCard
              rank={1}
              name={first.userName}
              score={first.points}
              profileImage={first.userPicture}
            />
          </div>
        )}

        {/* 3등 */}
        {third && (
          <div className="translate-y-1">
            <SmallTopCard
              rank={3}
              name={third.userName}
              score={third.points}
              profileImage={third.userPicture}
            />
          </div>
        )}
      </div>
    </div>
  );
}
