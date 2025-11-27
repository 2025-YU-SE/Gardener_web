import React from "react";
import { TbMessage2Check, TbPencil } from "react-icons/tb";
import { VscFeedback } from "react-icons/vsc";
import baseProfile from "../../assets/baseProfile.png";
import { useNavigate } from "react-router-dom";
import { makeAbsoluteImageUrl } from "../../utils/imageHelper";

export default function Banner({
  name,
  avatar,
  postCount,
  totalFeedbackCount,
  adoptedFeedbackCount,
}) {
  const navigate = useNavigate();
  const profileImg = makeAbsoluteImageUrl(avatar) || baseProfile;

  // 비로그인인 경우
  if (!name) {
    return (
      <section className="w-full h-[260px] bg-[#E9FAEE] flex flex-col items-center justify-center">
        <img
          src={baseProfile}
          className="w-[70px] h-[70px] mb-3 opacity-90"
          alt="base profile"
        />
        <h1 className="text-[26px] font-bold">
          <span className="text-black">Welcome to </span>
          <span className="text-[#2E7D32]">Code Gardener!</span>
        </h1>
        <p className="text-[15px] mt-2 font-medium text-[#2B2B2B]">
          <span
            className="underline cursor-pointer text-[#2E7D32]"
            onClick={() => navigate("/sign-in")}
          >
            로그인
          </span>
          후 함께 자라는 개발자 커뮤니티를 이용해보세요 😊
        </p>
      </section>
    );
  }

  // 채택률 계산
  const acceptRate =
    totalFeedbackCount && totalFeedbackCount > 0
      ? Math.round((adoptedFeedbackCount / totalFeedbackCount) * 100)
      : 0;

  return (
    <section className="w-full h-[280px] bg-[#E9FAEE] flex items-center justify-center">
      <div className="w-full max-w-[1000px] flex items-center justify-between px-8">
        <div className="flex items-center gap-10">
          {/* 프로필 */}
          <img
            src={profileImg}
            alt="avatar"
            className="w-[120px] h-[120px] rounded-full object-cover ring-1 ring-[#D6EBD9] bg-[#E9FAEE]"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = baseProfile;
            }}
          />

          {/* 텍스트 */}
          <div>
            <div className="text-[24px] font-bold">
              {name ? (
                <>
                  <span className="text-[#13B358]">{name}</span>님, 안녕하세요!
                </>
              ) : (
                "안녕하세요!"
              )}
            </div>
            <div className="mt-1 text-[20px] md:text-[15px] leading-6 text-[#2B2B2B]">
              코드와 피드백이 자라는 정원
              <br />
              <span className="font-semibold">CodeGardener</span>입니다
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 font-semibold">
          <MetricRow
            icon={<TbMessage2Check size={18} className="text-[#170000]" />}
            label="피드백 채택률"
            value={`${acceptRate}%`}
          />
          <MetricRow
            icon={<TbPencil size={18} className="text-[#170000]" />}
            label="등록한 게시물 수"
            value={postCount ?? 0}
          />
          <MetricRow
            icon={<VscFeedback size={18} className="text-[#170000]" />}
            label="등록한 피드백 수"
            value={totalFeedbackCount ?? 0}
          />
        </div>
      </div>
    </section>
  );
}

function MetricRow({ icon, label, value }) {
  return (
    <div className="flex items-center justify-between gap-8 min-w-[260px]">
      <div className="flex items-center gap-2 text-[14px] text-[#1E1E1E]">
        {icon}
        <span>{label}</span>
      </div>
      <div className="text-[14px] font-semibold text-[#1E1E1E]">{value}</div>
    </div>
  );
}

