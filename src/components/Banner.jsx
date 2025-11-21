import React from "react";
import { TbMessage2Check, TbPencil } from "react-icons/tb";
import { VscFeedback } from "react-icons/vsc";
import fakeProfile from "../assets/profile.png";

export default function Banner({
  name = "농담곰",
  acceptRate = 50,
  postCount = 3,
  feedbackCount = 5,
  avatar = fakeProfile,
}) {
  return (
    <section className="w-full h-[280px] bg-[#E9FAEE] flex items-center justify-center">
      <div className="w-full max-w-[1000px] flex items-center justify-between px-8">
        <div className="flex items-center gap-10">
          {/* 프로필 */}
          {avatar ? (
            <img
              src={avatar}
              alt="avatar"
              className="w-[120px] h-[120px] rounded-full object-cover ring-1 ring-[#D6EBD9] bg-white"
            />
          ) : (
            <div className="w-[84px] h-[84px] rounded-full flex items-center justify-center bg-white ring-1 ring-[#D6EBD9] text-3xl">
              🌱
            </div>
          )}

          {/* 텍스트 */}
          <div>
            <div className="text-[24px] font-bold">{name}님, 안녕하세요!</div>
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
            value={postCount}
          />
          <MetricRow
            icon={<VscFeedback size={18} className="text-[#170000]" />}
            label="등록한 피드백 수"
            value={feedbackCount}
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
