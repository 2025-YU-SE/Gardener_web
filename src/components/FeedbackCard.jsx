import React, { useState } from "react";
import { FaStar, FaHeart, FaRegHeart } from "react-icons/fa";
import { TbMessage2Check } from "react-icons/tb";
import { IoMdTime } from "react-icons/io";

const formatTimeAgo = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diff = (now - date) / 1000;

  if (diff < 60) return "방금 전";
  if (diff < 3600) return `${Math.floor(diff / 60)}분 전`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}시간 전`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}일 전`;

  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(
    2,
    "0"
  )}.${String(date.getDate()).padStart(2, "0")}`;
};

function FeedbackCard({ feedback, userName, userAvatar, onClick }) {
  const {
    feedbackId,
    content,
    rating,
    adoptedTF,
    likesCount,
    createdAt,
    postId,
  } = feedback;

  const [currentLikesCount, setCurrentLikesCount] = useState(likesCount);
  const [isLiked, setIsLiked] = useState(false);

  const displayContent =
    content.length > 100 ? content.substring(0, 100) + "..." : content;
  const avatarInitial = userName ? userName.charAt(0) : "U";

  // 좋아요 버튼 클릭 핸들러
  const handleToggleLike = (e) => {
    e.stopPropagation();

    setIsLiked((prev) => {
      const next = !prev;
      setCurrentLikesCount((c) => (next ? c + 1 : Math.max(0, c - 1)));
      return next;
    });
  };

  return (
    <div
      className="bg-white border rounded-lg p-5 shadow-sm transition duration-150 hover:shadow-md cursor-pointer flex flex-col justify-between h-full"
      onClick={onClick} // 게시글 상세 페이지로 이동
    >
      {/* 작성자 정보 및 시간 */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-3">
          <div className="w-[40px] h-[40px] rounded-full border border-gray-300 flex items-center justify-center overflow-hidden">
            {!userAvatar && (
              <span className="text-sm font-bold">{avatarInitial}</span>
            )}
            {userAvatar && (
              <img
                src={userAvatar}
                alt={`${userName} 아바타`}
                className="w-full h-full object-cover"
              />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-[14px]">
                {userName || "작성자"}
              </span>
            </div>
            <div className="text-[10px] text-gray-500">
              <IoMdTime className="inline-block -mt-0.5 mr-1" />
              {formatTimeAgo(createdAt)}
            </div>
          </div>
        </div>
      </div>

      {/* 평점 및 내용 */}
      <div className="flex-1 mb-3">
        <div className="flex items-center mb-2">
          <FaStar className="text-base text-yellow-400 mr-1" />
          <span className="text-sm font-bold text-gray-800 mt-0.5">
            {rating.toFixed(1)}점
          </span>
        </div>

        <p className="text-sm text-gray-700 leading-relaxed min-h-[40px]">
          {displayContent || "내용 없음"}
        </p>
      </div>

      {/* 좋아요 및 채택 여부 */}
      <div className="border-t pt-3 mt-auto flex items-center justify-between">
        <button
          className="flex items-center gap-1 text-[#4D4D4D]"
          onClick={handleToggleLike}
          type="button"
          aria-label="좋아요"
        >
          {isLiked ? <FaHeart className="text-red-500" /> : <FaRegHeart />}
          <span className="text-[10px] font-medium">
            {currentLikesCount.toLocaleString()}
          </span>
        </button>

        {/* 채택 여부 */}
        {adoptedTF ? (
          <div className="flex items-center bg-[#D1FAE5] text-[#059669] px-2 py-0.5 rounded-full text-xs font-semibold shrink-0">
            <TbMessage2Check size={14} className="mr-1" />
            채택 완료
          </div>
        ) : (
          <div className="flex items-center bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full text-xs font-semibold shrink-0">
            채택 대기
          </div>
        )}
      </div>
    </div>
  );
}

export default FeedbackCard;
