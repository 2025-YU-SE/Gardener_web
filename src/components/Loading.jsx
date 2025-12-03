import React from "react";
import baseProfile from "../assets/baseProfile.png";

function Loading({ message = "로딩 중..." }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F9FAFB]">
      <div className="flex flex-col items-center gap-6">
        {/* baseProfile 이미지에 애니메이션 효과 */}
        <div className="relative w-32 h-32 flex items-center justify-center">
          {/* 회전하는 점들 (8개) */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="relative w-40 h-40">
              {[0, 1, 2, 3, 4, 5, 6, 7].map((index) => {
                const angle = (index * 45) * (Math.PI / 180);
                const radius = 80;
                const x = Math.cos(angle) * radius;
                const y = Math.sin(angle) * radius;
                return (
                  <div
                    key={index}
                    className="absolute w-2.5 h-2.5 bg-green-500 rounded-full"
                    style={{
                      left: `calc(50% + ${x}px)`,
                      top: `calc(50% + ${y}px)`,
                      transform: 'translate(-50%, -50%)',
                      animation: `dotPulse 1.2s ease-in-out infinite`,
                      animationDelay: `${index * 0.15}s`,
                    }}
                  />
                );
              })}
            </div>
          </div>
          
          {/* 부드러운 그라데이션 원 (배경) */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none -z-10">
            <div 
              className="w-40 h-40 rounded-full opacity-30"
              style={{
                background: "conic-gradient(from 0deg, transparent, rgba(34, 197, 94, 0.4), transparent)",
                animation: "spin 2s linear infinite",
              }}
            />
          </div>
          
          <img
            src={baseProfile}
            alt="로딩 중"
            className="w-full h-full object-contain relative z-10"
            style={{
              animation: "gentlePulse 2s ease-in-out infinite",
            }}
          />
        </div>
        
        {/* 로딩 메시지 */}
        <div className="text-center">
          <p className="text-lg font-semibold text-gray-700">{message}</p>
          <p className="text-sm text-gray-500 mt-2">잠시만 기다려주세요...</p>
        </div>
      </div>
      
      <style>{`
        @keyframes dotPulse {
          0%, 100% {
            opacity: 0.3;
            transform: translate(-50%, -50%) scale(0.8);
          }
          50% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1.2);
          }
        }
        
        @keyframes gentlePulse {
          0%, 100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.05);
            opacity: 0.95;
          }
        }
        
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}

export default Loading;

