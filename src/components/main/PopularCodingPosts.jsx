import React, { useEffect, useState } from "react";
import PostCard from "../PostCard";
import baseProfile from "../../assets/baseProfile.png";
import { useNavigate } from "react-router-dom";
import { timeAgo } from "../../utils/date";
import { makeAbsoluteImageUrl } from "../../utils/imageHelper";
import { likePost, bookmarkPost } from "../../api/postApi";

export default function PopularCodingPosts({ posts = [] }) {
  const navigate = useNavigate();
  const [localPosts, setLocalPosts] = useState(() => posts.slice(0, 4));

  useEffect(() => {
    setLocalPosts(posts.slice(0, 4));
  }, [posts]);

  const postsToShow = localPosts;
  if (postsToShow.length === 0) return null;

  const handleToggleLike = async (postId) => {
    setLocalPosts((prev) =>
      prev.map((post) => {
        if (post.postId !== postId) return post;
        const nextLiked = !post.liked;
        const nextLikesCount = post.likesCount + (nextLiked ? 1 : -1);

        return {
          ...post,
          liked: nextLiked,
          likesCount: nextLikesCount < 0 ? 0 : nextLikesCount,
        };
      })
    );

    try {
      await likePost(postId);
    } catch (err) {
      console.error("코테 게시글 좋아요 API 호출 실패:", err);
    }
  };

  const handleToggleScrap = async (postId) => {
    setLocalPosts((prev) =>
      prev.map((post) => {
        if (post.postId !== postId) return post;
        const nextScrapped = !post.scrapped;
        const nextScrapCount = post.scrapCount + (nextScrapped ? 1 : -1);

        return {
          ...post,
          scrapped: nextScrapped,
          scrapCount: nextScrapCount < 0 ? 0 : nextScrapCount,
        };
      })
    );

    try {
      await bookmarkPost(postId);
    } catch (err) {
      console.error("코테 게시글 스크랩 API 호출 실패:", err);
    }
  };

  return (
    <section className="mt-14 mb-10">
      <h2 className="text-[20px] font-semibold mb-4">인기 코테 게시글</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {postsToShow.map((post) => {
          const languageTags = (post.languages || "")
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean);

          const stackTags = (post.stacks || "")
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean);

          const avatarImg =
            makeAbsoluteImageUrl(post.userPicture) || baseProfile;

          return (
            <PostCard
              key={post.postId}
              avatar={avatarImg}
              author={post.userName}
              timeAgo={timeAgo(post.createdAt)}
              title={post.title}
              content={post.content}
              languages={languageTags}
              stacks={stackTags}
              likes={post.likesCount}
              comments={post.feedbackCount}
              views={post.views}
              isLiked={post.liked}
              isBookmarked={post.scrapped}
              onClick={() => navigate(`/posts/${post.postId}`)}
              onLike={() => handleToggleLike(post.postId)}
              onBookmark={() => handleToggleScrap(post.postId)}
            />
          );
        })}
      </div>
    </section>
  );
}
