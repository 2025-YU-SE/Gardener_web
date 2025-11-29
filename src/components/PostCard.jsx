import React, { useState } from "react";
import {
  FaHeart,
  FaRegHeart,
  FaBookmark,
  FaRegBookmark,
  FaComment,
  FaEye,
} from "react-icons/fa";
import { IoMdTime } from "react-icons/io";

function PostCard({
  avatar,
  author,
  timeAgo,
  title,
  content,
  languages = [],
  stacks = [],
  likes = 0,
  comments = 0,
  views = 0,
  isLiked = false,
  isBookmarked = false,
  onClick,
  onLike,
  onBookmark,
}) {
  // 설명 110자 초과 시 '...' 표시
  const truncatedContent =
    typeof content === "string"
      ? content.length > 110
        ? content.slice(0, 110) + "..."
        : content
      : "";

  // 토글 상태
  const [liked, setLiked] = useState(isLiked);
  const [bookmarked, setBookmarked] = useState(isBookmarked);
  const [likeCount, setLikeCount] = useState(likes);

  const handleToggleLike = (e) => {
    e.stopPropagation();
    setLiked((prev) => {
      const next = !prev;
      setLikeCount((c) => (next ? c + 1 : Math.max(0, c - 1)));
      onLike && onLike(next);
      return next;
    });
  };

  const handleToggleBookmark = (e) => {
    e.stopPropagation();
    setBookmarked((prev) => {
      const next = !prev;
      onBookmark && onBookmark(next);
      return next;
    });
  };

  return (
    <div
      className="h-full flex flex-col bg-white border border-gray-200 rounded-xl p-5 transition-shadow cursor-pointer"
      onClick={onClick}
    >
      {/* 상단: 작성자/시간 */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-[40px] h-[40px] rounded-full border border-gray-300 flex items-center justify-center overflow-hidden">
            <img
              src={avatar}
              alt="profile"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-[14px]">{author}</span>
            </div>
            <div className="text-[10px] text-gray-500">
              <IoMdTime className="inline-block -mt-0.5 mr-1" />
              {timeAgo}
            </div>
          </div>
        </div>
      </div>

      {/* 본문 */}
      <div className="flex-1">
        {/* 제목 */}
        <h2 className="text-[16px] font-semibold text-[#343434] leading-snug line-clamp-1 min-h-[24px]">
          {title}
        </h2>

        {/* 설명 */}
        <p className="mt-1 text-[#8F8F8F] text-[12px] leading-relaxed min-h-[36px]">
          {truncatedContent}
        </p>

        {/* 태그 */}
        <div className="flex flex-wrap gap-2 mt-3 mb-2 mr-2 min-h-[28px]">
          {/* languages */}
          {languages.map((tag, i) => (
            <span
              key={`lang-${tag}-${i}`}
              className="inline-flex items-center justify-center h-7 px-3 rounded-full text-[12px] font-medium leading-none bg-[#E9FFEA] text-[#00B834] border border-[#C8F4CE]"
            >
              {tag}
            </span>
          ))}

          {/* stacks */}
          {stacks.map((tag, i) => (
            <span
              key={`stack-${tag}-${i}`}
              className="inline-flex items-center justify-center h-7 px-3 rounded-full text-[12px] font-medium leading-none bg-[#00B834] text-white"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* 하단 */}
      <div className="pt-3 mt-auto border-t border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-6 text-[#4D4D4D]">
          {/* 좋아요 */}
          <button
            className="flex items-center gap-1 hover:opacity-80 transition"
            onClick={handleToggleLike}
            type="button"
            aria-label="좋아요"
          >
            {liked ? <FaHeart className="text-red-500" /> : <FaRegHeart />}
            <span className="text-[10px] font-medium">{likeCount}</span>
          </button>

          {/* 스크랩 */}
          <button
            className={`flex items-center gap-1 transition ${
              bookmarked ? "text-blue-500" : "hover:text-blue-500"
            }`}
            onClick={handleToggleBookmark}
            type="button"
            aria-label="스크랩"
          >
            {bookmarked ? <FaBookmark /> : <FaRegBookmark />}
            <span className="text-[10px] font-medium">스크랩</span>
          </button>

          {/* 피드백수 */}
          <div className="flex items-center gap-1">
            <FaComment />
            <span className="text-[10px] font-medium">{comments}</span>
          </div>

          {/* 조회수 */}
          <div className="flex items-center gap-1">
            <FaEye />
            <span className="text-[10px]">{views}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PostCard;
