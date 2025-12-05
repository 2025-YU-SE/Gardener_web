import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../components/header/Header";
import notFoundImg from "../assets/notFoundImg.png";

function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="w-full min-h-screen bg-[#EEFFED]">
      <Header />
      <div className="flex justify-center items-center mt-12 sm:mt-24 px-4">
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-0 lg:ml-0 lg:ml-32">
          {/* 텍스트 */}
          <div className="text-center lg:text-left">
            <h1 className="text-6xl sm:text-[80px] font-extrabold text-[#4D4D4D]">404</h1>
            <p className="mt-2 text-lg sm:text-[24px] font-semibold text-[#4D4D4D]">
              길을 잃으셨나요?
            </p>
            <p className="mt-2 text-sm sm:text-[14px] text-[#6B6B6B]">
              찾으시는 페이지가 없어요.{" "}
              <span className="text-[#00C839] font-medium">Code Gardener</span>
              에서 다시 시작해보세요.
            </p>

            {/* 버튼 */}
            <div className="mt-6 sm:mt-10 flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
              <Link
                to="/main"
                className="flex items-center justify-center h-[44px] px-5 rounded-[6px] bg-[#00C839] text-white text-sm sm:text-[15px] font-medium hover:bg-[#0bdd47]"
              >
                메인으로 가기
              </Link>
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="flex items-center justify-center h-[44px] px-5 rounded-[8px] border border-[#B8B8B8] text-[#4D4D4D] text-sm sm:text-[15px] font-medium hover:bg-white/40"
              >
                이전 화면
              </button>
            </div>
          </div>

          {/* 일러스트 */}
          <img
            src={notFoundImg}
            alt="새싹 일러스트"
            className="w-full max-w-[300px] sm:max-w-[400px] h-auto lg:ml-8 xl:ml-20"
          />
        </div>
      </div>
    </div>
  );
}

export default NotFound;
