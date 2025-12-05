import React, { useEffect, useState } from "react";
import PostCard from "../PostCard";
import baseProfile from "../../assets/baseProfile.png";
import { useNavigate } from "react-router-dom";
import { timeAgo } from "../../utils/date";
import { makeAbsoluteImageUrl } from "../../utils/imageHelper";
import { likePost, bookmarkPost } from "../../api/postApi";
import { getCurrentUsername } from "../../utils/jwtHelper";

export default function PopularDevPosts({ posts = [] }) {
  const navigate = useNavigate();
  const [localPosts, setLocalPosts] = useState(() => []);

  useEffect(() => {
    const username = getCurrentUsername();
    const mapped = posts.slice(0, 4).map((post) => {
      if (!username) {
        return {
          ...post,
          liked: false,
          scrapped: false,
        };
      }

      const likedKey = `postLiked:${username}:${post.postId}`;
      const scrapKey = `postScrapped:${username}:${post.postId}`;

      return {
        ...post,
        liked: localStorage.getItem(likedKey) === "true",
        scrapped: localStorage.getItem(scrapKey) === "true",
      };
    });

    setLocalPosts(mapped);
  }, [posts]);

  const postsToShow = localPosts;
  if (postsToShow.length === 0) return null;

  // 좋아요
  const handleToggleLike = async (postId) => {
    const isAuthed = Boolean(localStorage.getItem("accessToken"));
    if (!isAuthed) {
      alert("로그인이 필요합니다.");
      navigate("/sign-in");
      return;
    }

    const username = getCurrentUsername();
    const likedKey = username ? `postLiked:${username}:${postId}` : null;

    let prevPost = null;

    setLocalPosts((prev) =>
      prev.map((post) => {
        if (post.postId !== postId) return post;
        prevPost = post;

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
      if (likedKey && prevPost) {
        const finalLiked = !prevPost.liked;
        if (finalLiked) localStorage.setItem(likedKey, "true");
        else localStorage.removeItem(likedKey);
      }
    } catch (err) {
      console.error("게시글 좋아요 API 호출 실패:", err);
      setLocalPosts((prev) =>
        prev.map((post) =>
          post.postId === postId && prevPost ? prevPost : post
        )
      );

      if (likedKey && prevPost) {
        if (prevPost.liked) localStorage.setItem(likedKey, "true");
        else localStorage.removeItem(likedKey);
      }

      alert("좋아요 처리 중 오류가 발생했습니다.");
    }
  };

  // 스크랩
  const handleToggleScrap = async (postId) => {
    const isAuthed = Boolean(localStorage.getItem("accessToken"));
    if (!isAuthed) {
      alert("로그인이 필요합니다.");
      navigate("/sign-in");
      return;
    }

    const username = getCurrentUsername();
    const scrapKey = username ? `postScrapped:${username}:${postId}` : null;

    let prevPost = null;

    setLocalPosts((prev) =>
      prev.map((post) => {
        if (post.postId !== postId) return post;
        prevPost = post;

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

      if (scrapKey && prevPost) {
        const finalScrapped = !prevPost.scrapped;
        if (finalScrapped) localStorage.setItem(scrapKey, "true");
        else localStorage.removeItem(scrapKey);
      }
    } catch (err) {
      console.error("게시글 스크랩 API 호출 실패:", err);

      setLocalPosts((prev) =>
        prev.map((post) =>
          post.postId === postId && prevPost ? prevPost : post
        )
      );

      if (scrapKey && prevPost) {
        if (prevPost.scrapped) localStorage.setItem(scrapKey, "true");
        else localStorage.removeItem(scrapKey);
      }

      alert("스크랩 처리 중 오류가 발생했습니다.");
    }
  };

  return (
    <section className="mt-10">
      <h2 className="text-[20px] font-semibold mb-4">인기 개발 게시글</h2>

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
