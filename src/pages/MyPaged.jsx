import React from "react";
import Header from "../components/header/Header";
import profileImg from "../assets/profile.png";
import { TbCoin, TbMessage2Check, TbPencil } from "react-icons/tb";
import { VscFeedback } from "react-icons/vsc";

function MyPaged() {
  const profile = {
    name: "Chiikawa",
    avatar: profileImg,
    points: 4300,
    selectRate: 50,
    postCount: 3,
    feedbackCount: 5,
    gradeLabel: "등급",
  };

  // 등급 도넛
  const GradeDonut = ({ percent = 50, label = "등급" }) => {
    const size = 120;
    const stroke = 12;
    const r = (size - stroke) / 2;
    const c = 2 * Math.PI * r;
    const dash = (percent / 100) * c;

    return (
      <div className="relative">
        <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            stroke="#E5E7EB"
            strokeWidth={stroke}
            fill="none"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            stroke="#10B981"
            strokeWidth={stroke}
            strokeLinecap="round"
            fill="none"
            strokeDasharray={`${dash} ${c - dash}`}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-[13px] font-semibold text-gray-800">
            {label}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      <Header />
      <div className="mx-auto max-w-[1100px] px-4 py-8">
        <div className="rounded-[10px] border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-5 px-20">
            {/* 프로필 */}
            <div className="h-full w-[132px] overflow-hidden rounded-[10px]">
              <img
                src={profile.avatar}
                alt={`${profile.name} 프로필`}
                className="h-full w-full object-cover"
              />
            </div>

            {/* 가운데 박스 */}
            <div
              className="flex-1 w-[825px] h- rounded-[10px] border border-[#ACACAC] bg-white
                            pl-6 pr-3 py-4 flex items-center justify-between box-border overflow-hidden"
            >
              {/* 이름/지표 */}
              <div className="flex-1 min-w-0">
                <h2 className="text-[22px] font-semibold mb-2">
                  {profile.name}
                </h2>
                <ul className="space-y-2 text-[14px]">
                  <Row
                    icon={<TbCoin className="text-[#4D4D4D]" size={18} />}
                    label="누적포인트"
                    value={profile.points.toLocaleString()}
                  />
                  <Row
                    icon={
                      <TbMessage2Check className="text-[#4D4D4D]" size={18} />
                    }
                    label="피드백 채택률"
                    value={`${profile.selectRate}%`}
                  />
                  <Row
                    icon={<TbPencil className="text-[#4D4D4D]" size={18} />}
                    label="등록한 게시물 수"
                    value={profile.postCount}
                  />
                  <Row
                    icon={<VscFeedback className="text-[#4D4D4D]" size={18} />}
                    label="등록한 피드백 수"
                    value={profile.feedbackCount}
                  />
                </ul>
              </div>

              {/* 등급 */}
              <div className="shrink-0 ml-16 mr-5">
                <GradeDonut
                  percent={profile.selectRate}
                  label={profile.gradeLabel}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({ icon, label, value }) {
  return (
    <li className="flex items-center justify-between">
      <div className="flex items-center gap-2 text-gray-800">
        <span className="shrink-0">{icon}</span>
        <span className="font-medium">{label}</span>
      </div>
      <span className="font-semibold text-gray-900">{value}</span>
    </li>
  );
}

export default MyPaged;
