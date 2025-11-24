import React from "react";
import PostCard from "../PostCard";
import baseProfile from "../../assets/baseProfile.png";
import { useNavigate } from "react-router-dom";
import { timeAgo } from "../../utils/date";

export default function PopularDevPosts({ posts = [] }) {
  const navigate = useNavigate();
  if (posts.length === 0) return null;

  return (
    <section className="mt-10">
      <h2 className="text-[20px] font-semibold mb-4">인기 개발 게시글</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {posts.map((post) => {
          const languageTags = (post.languages || "")
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean);

          const stackTags = (post.stacks || "")
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean);

          return (
            <PostCard
              avatar={post.userPicture || baseProfile}
              author={post.userName}
              timeAgo={timeAgo(post.createdAt)}
              title={post.title}
              content={post.content}
              languages={(post.languages || "")
                .split(",")
                .map((t) => t.trim())
                .filter(Boolean)}
              stacks={(post.stacks || "")
                .split(",")
                .map((t) => t.trim())
                .filter(Boolean)}
              likes={post.likesCount}
              comments={post.feedbackCount}
              views={post.views}
              onClick={() => navigate(`/posts/${post.postId}`)}
            />
          );
        })}
      </div>
    </section>
  );
}
