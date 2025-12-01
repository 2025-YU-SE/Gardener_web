import React, { useState } from "react";
import Header from "../components/header/Header";
import illustration from "../assets/illustration.png";
import { signup, checkUsername } from "../api/userApi";

function SignUp() {
  // 입력값 상태 관리
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");

  // 아이디 중복 확인 관련 상태
  const [isCheckingUsername, setIsCheckingUsername] = useState(false); // 로딩 여부
  const [usernameCheckMessage, setUsernameCheckMessage] = useState(""); // 안내 메시지
  const [isUsernameAvailable, setIsUsernameAvailable] = useState(null); // null | true | false

  // 아이디 중복 확인 함수
  const handleCheckUsername = async () => {
    if (!userName.trim()) {
      setUsernameCheckMessage("아이디를 입력해 주세요.");
      setIsUsernameAvailable(false);
      return;
    }

    try {
      setIsCheckingUsername(true);
      setUsernameCheckMessage("");
      setIsUsernameAvailable(null);

      const res = await checkUsername(userName);
      const available = res.data === true;

      if (available) {
        setUsernameCheckMessage("사용 가능한 아이디입니다.");
        setIsUsernameAvailable(true);
      } else {
        setUsernameCheckMessage("이미 사용 중인 아이디입니다.");
        setIsUsernameAvailable(false);
      }
    } catch (err) {
      console.error(err);
      setUsernameCheckMessage("아이디 중복 확인 중 오류가 발생했습니다.");
      setIsUsernameAvailable(false);
    } finally {
      setIsCheckingUsername(false);
    }
  };

  // 회원가입 처리 함수
  const handleSignup = async () => {
    if (password !== passwordCheck) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    // 아이디 중복 확인하지 않고 회원가입 버튼을 누를 시
    if (isUsernameAvailable !== true) {
      alert("아이디 중복 확인을 완료해 주세요.");
      return;
    }

    try {
      const res = await signup({
        userName,
        email,
        password,
      });

      alert("회원가입 성공!");
      console.log(res.data);

      // 예: 회원가입 성공 후 로그인 페이지로 이동
      window.location.href = "/sign-in";
    } catch (err) {
      console.error(err);
      alert("회원가입 실패");
    }
  };

  return (
    <div className="w-full h-screen bg-gradient-to-r from-[#F0FDF4] to-[#BDF7D1]">
      <Header />
      <div className="flex justify-center">
        <div className="mt-20">
          <div className="text-[30px] font-semibold">
            <h3 className="text-[#4D4D4D]">
              안녕하세요, 코드와 피드백이 자라는 정원
            </h3>
            <span className="text-[#00C839]">Code Gardener</span>
            <span className="text-[#4D4D4D]">입니다.</span>
          </div>
          <img
            src={illustration}
            alt="illust"
            className="w-[673px] h-[449px]"
          />
        </div>

        <div className="flex flex-col items-center w-[499px] h-[562px] bg-white rounded-[16px] border border-[#B8B8B8] mt-12">
          <h2 className="text-[30px] font-semibold mt-16 mb-6">회원가입</h2>
          <div className="flex flex-col items-center">
            {/* 아이디 */}
            <div className="flex flex-col mb-4">
              <label className="flex items-center text-[12px] font-medium text-[#4D4D4D] ml-1 mb-1">
                아이디
                <p className="text-[#00C839]">*</p>
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="아이디를 입력해 주세요"
                  className="w-[280px] h-[40px] border border-[#B8B8B8] rounded-[6px] px-4 py-3 text-[12px] focus:outline-none placeholder:text-[#B8B8B8]"
                  value={userName}
                  onChange={(e) => {
                    setUserName(e.target.value);
                    // 입력이 바뀌면 이전 검사 결과 초기화
                    setUsernameCheckMessage("");
                    setIsUsernameAvailable(null);
                  }}
                />
                <button
                  type="button"
                  className="w-[69px] h-[40px] rounded-[6px] bg-[#4D4D4D] text-white text-[12px] hover:bg-[#212121]"
                  onClick={handleCheckUsername}
                  disabled={isCheckingUsername}
                >
                  {isCheckingUsername ? "확인중" : "중복확인"}
                </button>
              </div>

              {/* 아이디 중복 확인 메시지 */}
              {usernameCheckMessage && (
                <p
                  className={`mt-1 ml-1 text-[10px] ${
                    isUsernameAvailable
                      ? "text-[#00C839]" // 사용 가능
                      : "text-[#FF4D4F]" // 중복
                  }`}
                >
                  {usernameCheckMessage}
                </p>
              )}
            </div>

            {/* 이메일 */}
            <div className="flex flex-col mb-4">
              <label className="flex items-center text-[12px] font-medium text-[#4D4D4D] ml-1 mb-1">
                이메일
                <p className="text-[#00C839]">*</p>
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="이메일을 입력해 주세요"
                  className="w-[280px] h-[40px] border border-[#B8B8B8] rounded-[6px] px-4 py-3 text-[12px] focus:outline-none placeholder:text-[#B8B8B8]"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                />
                <button
                  type="button"
                  className="w-[69px] h-[40px] rounded-[6px] bg-[#4D4D4D] text-white text-[12px] hover:bg-[#212121]"
                >
                  중복확인
                </button>
              </div>
            </div>

            {/* 비밀번호 */}
            <div className="flex flex-col mb-3">
              <label className="flex items-center text-[12px] font-medium text-[#4D4D4D] ml-1 mb-1">
                비밀번호
                <p className="text-[#00C839]">*</p>
              </label>
              <input
                type="password"
                placeholder="영문자, 숫자 포함 8~12자"
                className="w-[360px] h-[40px] border border-[#B8B8B8] rounded-[6px] px-4 py-3 text-[12px] focus:outline-none placeholder:text-[#B8B8B8]"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {/* 비밀번호 확인 */}
            <div className="flex flex-col mb-7">
              <input
                type="password"
                placeholder="비밀번호를 확인해주세요"
                className="w-[360px] h-[40px] border border-[#B8B8B8] rounded-[6px] px-4 py-3 text-[12px] focus:outline-none placeholder:text-[#B8B8B8]"
                value={passwordCheck}
                onChange={(e) => setPasswordCheck(e.target.value)}
              />
            </div>

            {/* 회원가입 버튼 */}
            <button
              className="w-[160px] h-[40px] bg-[#00C839] text-white text-[16px] py-2 rounded-[6px] font-medium hover:bg-[#0bdd47]"
              onClick={handleSignup}
            >
              회원가입
            </button>

            {/* 로그인 이동 링크 */}
            <p className="text-[10px] text-[#B8B8B8] mt-4">
              이미 계정이 있으신가요?{" "}
              <a
                href="/sign-in"
                className="text-[#00C839] font-semibold hover:underline"
              >
                로그인
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
