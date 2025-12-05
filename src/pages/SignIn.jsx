import React, { useState } from "react";
import HeaderAuth from "../components/header/HeaderAuth";
import illustration from "../assets/illustration.png";
import { login } from "../api/userApi";

function SignIn() {
  // 입력값 상태 관리
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");

  // 로그인 처리 함수
  const handleLogin = async () => {
    try {
      const res = await login({
        userName,
        password,
      });

      const token = res.data.accessToken;
      if (!token) {
        alert("로그인 실패: 토큰을 받지 못했습니다.");
        return;
      }

      // 로그인 토큰 저장
      localStorage.setItem("accessToken", token);

      alert("로그인 성공!");

      window.location.href = "/main";
    } catch (err) {
      console.error(err);
      alert("로그인 실패! 아이디와 비밀번호를 확인해주세요.");
    }
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-r from-[#F0FDF4] to-[#BDF7D1] flex flex-col">
      <HeaderAuth />
      <div className="flex-1 flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16 px-4 sm:px-6 py-8 lg:py-12">
        {/* 왼쪽: 일러스트레이션 영역 */}
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left w-full lg:w-auto">
          <div className="text-xl sm:text-2xl lg:text-[30px] font-semibold mb-4 lg:mb-6">
            <h3 className="text-[#4D4D4D]">
              안녕하세요, 코드와 피드백이 자라는 정원
            </h3>
            <span className="text-[#00C839]">Code Gardener</span>
            <span className="text-[#4D4D4D]">입니다.</span>
          </div>
          <img
            src={illustration}
            alt="illust"
            className="w-full max-w-[400px] sm:max-w-[500px] lg:max-w-[673px] h-auto"
          />
        </div>

        {/* 오른쪽: 로그인 폼 */}
        <div className="flex flex-col items-center w-full max-w-[499px] bg-white rounded-[16px] border border-[#B8B8B8] px-4 sm:px-0 py-8 sm:py-10">
          <h2 className="text-2xl sm:text-[30px] font-semibold mb-8 sm:mb-12">로그인</h2>

          <div className="flex flex-col items-center w-full">
            {/* 아이디 */}
            <input
              type="text"
              placeholder="아이디를 입력해 주세요"
              className="w-full max-w-[360px] h-[48px] border border-[#B8B8B8] rounded-[6px] px-4 py-3 text-sm sm:text-[14px] focus:outline-none focus:ring-2 focus:ring-[#00C839] focus:border-transparent mb-4 placeholder:text-[#B8B8B8]"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleLogin();
                }
              }}
            />

            {/* 비밀번호 */}
            <input
              type="password"
              placeholder="비밀번호를 입력해 주세요"
              className="w-full max-w-[360px] h-[48px] border border-[#B8B8B8] rounded-[6px] px-4 py-3 text-sm sm:text-[14px] focus:outline-none focus:ring-2 focus:ring-[#00C839] focus:border-transparent mb-8 placeholder:text-[#B8B8B8]"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleLogin();
                }
              }}
            />

            {/* 로그인 버튼 */}
            <button
              className="w-[160px] h-[40px] bg-[#00C839] text-white text-[16px] py-2 rounded-[6px] font-medium hover:bg-[#0bdd47]"
              onClick={handleLogin}
            >
              로그인
            </button>
          </div>

          <p className="text-[10px] text-[#B8B8B8] mt-6 mb-0">
            계정이 없으신가요?{" "}
            <a
              href="/sign-up"
              className="text-[#00C839] font-semibold hover:underline"
            >
              회원가입
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
