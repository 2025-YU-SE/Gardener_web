import React from "react";
import Header from "../components/header/Header";
import { Link } from "react-router-dom";
import { IoCodeOutline } from "react-icons/io5";
import { PiUsersFour } from "react-icons/pi";
import { VscFeedback } from "react-icons/vsc";

function Landing() {
  // 랜딩 페이지 통계 영역 데이터 (추후 백엔드 연동 예정)
  const stats = [
    { icon: IoCodeOutline, value: "1,234", label: "심어진 새싹" },
    { icon: PiUsersFour, value: "567", label: "활성 가드너" },
    { icon: VscFeedback, value: "8,901", label: "피드백" },
  ];

  return (
    <div>
      <Header />
      <div className="w-full h-[868px] bg-gradient-to-r from-[#F0FDF4] to-[#BDF7D1]">
        {/* 텍스트 영역 */}
        <div>
          <h2 className="flex justify-center text-[50px] text-[#4D4D4D] font-bold pt-20">
            새싹을 심고, 함께 가꾸고, 함께 성장하세요
          </h2>
          <span className="flex justify-center text-[20px] text-[#626262] pt-6">
            AI와 동료 개발자들과 함께 새싹를 리뷰하고 피드백을 받으며, 더 나은
            개발자로 성장해보세요.
          </span>
          <span className="flex justify-center text-[20px] text-[#626262]">
            정원에 새싹을 심고 가꿔보세요.
          </span>
        </div>

        {/* 버튼 */}
        <div className="flex justify-center gap-6 text-[20px] text-white pt-12">
          <Link
            className="w-[250px] h-[63px] bg-[#16A34A] rounded-[6px] hover:bg-[#2bad5b] flex items-center justify-center space-x-2 text-white font-medium"
            to="/upload"
          >
            <IoCodeOutline size={22} />
            <span>새싹 심기 시작하기</span>
          </Link>
          <Link
            className="w-[149px] h-[63px] bg-[#4D4D4D] rounded-[6px] hover:bg-[#575757] flex items-center justify-center"
            to="/posts"
          >
            정원 둘러보기
          </Link>
        </div>

        {/* 통계 영역 */}
        <div className="flex justify-center space-x-44 pt-20">
          {stats.map(({ icon: Icon, value, label }) => (
            <div key={label} className="flex flex-col items-center">
              <div className="flex justify-center items-center w-[80px] h-[80px] bg-white rounded-[12px] shadow-sm">
                <Icon size={40} className="text-[#16A34A]" />
              </div>
              <div className="text-[36px] font-bold text-black pt-2">
                {value}
              </div>
              <div className="text-[#4D4D4D] text-[24px] font-semibold">
                {label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Landing;
