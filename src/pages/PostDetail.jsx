import React from 'react'
import { useParams } from 'react-router-dom'

function PostDetail() {
  const { postId } = useParams()
  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold">Post Detail</h1>
      <p>게시물 상세 페이지: {postId}</p>
    </div>
  )
}

export default PostDetail


