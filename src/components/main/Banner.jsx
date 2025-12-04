import React, { useState, useEffect } from "react";
import { TbMessage2Check, TbPencil } from "react-icons/tb";
import { VscFeedback } from "react-icons/vsc";
import baseProfile from "../../assets/baseProfile.png";
import { useNavigate } from "react-router-dom";
import { makeAbsoluteImageUrl } from "../../utils/imageHelper";
import { attendance } from "../../api/userApi";

const getTodayKey = () => new Date().toISOString().split("T")[0];

export default function Banner({
  name,
  avatar,
  postCount,
  totalFeedbackCount,
  adoptedFeedbackCount,
}) {
  const navigate = useNavigate();
  const profileImg = makeAbsoluteImageUrl(avatar) || baseProfile;

  const [attendLoading, setAttendLoading] = useState(false);
  const [attended, setAttended] = useState(false);
  const storageKey = `attendanceDate_${name || "guest"}`;

  // 첫 렌더링 시, 오늘 이미 출석했는지 localStorage에서 확인
  useEffect(() => {
    try {
      const today = getTodayKey();
      const saved = localStorage.getItem(storageKey);
      if (saved === today) {
        setAttended(true);
      }
    } catch (e) {
      console.error("attendance localStorage read error:", e);
    }
  }, [storageKey]);

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

  // 출석 체크
  const handleAttendance = async () => {
    if (attendLoading || attended) return;

    try {
      setAttendLoading(true);
      const res = await attendance();

      let msg = "";
      if (typeof res === "string") {
        msg = res;
      } else if (res && typeof res === "object") {
        msg =
          res.message || res.msg || res.data || res.result || res.content || "";
      }

      if (!msg) {
        msg = JSON.stringify(res);
      }

      alert(msg);

      // 출석 완료 또는 이미 출석한 경우 -> 오늘 날짜를 localStorage에 저장 + 버튼 비활성화
      if (
        msg.includes("출석 완료") ||
        msg.includes("지급") ||
        msg.includes("이미 출석")
      ) {
        try {
          const today = getTodayKey();
          localStorage.setItem(storageKey, today);
        } catch (e) {
          console.error("attendance localStorage write error:", e);
        }
        setAttended(true);
      }
    } catch (error) {
      console.error(error);
      alert("출석 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setAttendLoading(false);
    }
  };

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

          {/* 텍스트 + 출석 버튼 */}
          <div>
            <div className="text-[24px] font-bold">
              <span className="text-[#13B358]">{name}</span>님, 안녕하세요!
            </div>
            <div className="mt-1 text-[20px] md:text-[15px] leading-6 text-[#2B2B2B]">
              코드와 피드백이 자라는 정원
              <br />
              <span className="font-semibold">CodeGardener</span>입니다
            </div>

            {/* 출석하기 버튼 */}
            <button
              type="button"
              onClick={handleAttendance}
              disabled={attendLoading || attended}
              className={`
                mt-4 inline-flex items-center justify-center px-5 py-2 rounded-full
                text-white text-[14px] font-semibold
                transition
                ${
                  attendLoading || attended
                    ? "bg-[#A8D5B8] cursor-not-allowed"
                    : "bg-[#13B358] hover:bg-[#0f9a4a]"
                }
              `}
            >
              {attended
                ? "출석 완료!"
                : attendLoading
                ? "출석 중..."
                : "출석하기"}
            </button>
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
