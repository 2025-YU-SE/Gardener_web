import React from "react";
import logo from "../../assets/logo.svg";
import { Link,useNavigate } from "react-router-dom";
import { IoPersonCircle } from "react-icons/io5";

// 로그인한 사용자용 헤더
const HeaderLoggedIn = () => {
    const navigate = useNavigate();

    // 🔐 로그아웃 기능
    const handleLogout = () => {
        localStorage.removeItem("accessToken"); // JWT 삭제

        // 필요하면 refreshToken도 삭제
        localStorage.removeItem("refreshToken");

        // 새로고침해서 즉시 UI 반영
        window.location.reload();
    };

    return (
        <div className="flex items-center justify-between w-full h-[60px] bg-white border-b-2">
            <Link className="flex items-center space-x-1 pl-[80px]" to="/main">
                <img src={logo} alt="logo" className="w-[60px] h-[60px]" />
                <div className="text-[20px] font-semibold">Code Gardener</div>
            </Link>

            {/* 메뉴 */}
            <div className="flex-1 pl-[250px] flex items-center space-x-20 text-[14px] font-medium">
                <Link to="/posts">코드 정원</Link>
                <Link to="/upload">코드 심기</Link>
                <Link to="/leader-board">리더보드</Link>
                <Link to="*">메뉴4</Link>
            </div>

            {/* 우측 영역 */}
            <div className="flex items-center space-x-8 pr-[120px]">
                {/* 로그아웃 */}
                <button
                    onClick={handleLogout}
                    className="flex justify-center items-center text-[12px] cursor-pointer hover:text-green-600 transition"
                >
                    로그아웃
                </button>

                {/* 마이페이지 이동 */}
                <IoPersonCircle
                    className="text-[#B9B9B9] w-[32px] h-[32px] cursor-pointer hover:text-green-600"
                    onClick={() => navigate("/my-paged")}
                />
            </div>
        </div>
    );
};

export default HeaderLoggedIn;