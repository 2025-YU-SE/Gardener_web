import React from "react";
import Header from "../components/header/Header";
import { Link } from "react-router-dom";
import { IoCodeOutline } from "react-icons/io5";

function Landing() {
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
        <div className="flex justify-center gap-6 text-[20px] text-white pt-16">
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
      </div>
    </div>
  );
}

export default Landing;
