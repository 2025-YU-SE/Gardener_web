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
    <div className="min-h-screen bg-gradient-to-r from-[#F0FDF4] to-[#BDF7D1]">
      <Header />
      <div className="w-full min-h-[calc(100vh-60px)] bg-gradient-to-r from-[#F0FDF4] to-[#BDF7D1] px-4 py-12 sm:py-16 lg:py-20 pb-20 sm:pb-24 lg:pb-32">
        {/* 텍스트 영역 */}
        <div>
          <h2 className="flex justify-center text-2xl sm:text-3xl lg:text-[50px] text-[#4D4D4D] font-bold pt-8 sm:pt-12 lg:pt-20 px-4 text-center">
            새싹을 심고, 함께 가꾸고, 함께 성장하세요
          </h2>
          <span className="flex justify-center text-sm sm:text-base lg:text-[20px] text-[#626262] pt-4 sm:pt-6 px-4 text-center">
            AI와 동료 개발자들과 함께 새싹를 리뷰하고 피드백을 받으며, 더 나은
            개발자로 성장해보세요.
          </span>
          <span className="flex justify-center text-sm sm:text-base lg:text-[20px] text-[#626262] px-4 text-center">
            정원에 새싹을 심고 가꿔보세요.
          </span>
        </div>

        {/* 버튼 */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6 text-base sm:text-lg lg:text-[20px] text-white pt-8 sm:pt-12 px-4">
          <Link
            className="w-full sm:w-[250px] h-[50px] sm:h-[63px] bg-[#16A34A] rounded-[6px] hover:bg-[#2bad5b] flex items-center justify-center space-x-2 text-white font-medium"
            to="/upload"
          >
            <IoCodeOutline size={22} />
            <span>새싹 심기 시작하기</span>
          </Link>
          <Link
            className="w-full sm:w-[149px] h-[50px] sm:h-[63px] bg-[#4D4D4D] rounded-[6px] hover:bg-[#575757] flex items-center justify-center"
            to="/posts"
          >
            정원 둘러보기
          </Link>
        </div>

        {/* 통계 영역 */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-8 sm:gap-12 lg:gap-44 pt-12 sm:pt-16 lg:pt-20 px-4">
          {stats.map(({ icon: Icon, value, label }) => (
            <div key={label} className="flex flex-col items-center">
              <div className="flex justify-center items-center w-[60px] h-[60px] sm:w-[80px] sm:h-[80px] bg-white rounded-[12px] shadow-sm">
                <Icon size={30} className="sm:w-[40px] sm:h-[40px] text-[#16A34A]" />
              </div>
              <div className="text-2xl sm:text-3xl lg:text-[36px] font-bold text-black pt-2">
                {value}
              </div>
              <div className="text-[#4D4D4D] text-base sm:text-lg lg:text-[24px] font-semibold">
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
