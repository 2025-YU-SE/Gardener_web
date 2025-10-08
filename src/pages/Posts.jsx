import React from 'react'
import HeaderLoggedIn from '../components/header/HeaderLoggedIn'

function Posts() {
  return (
    <div className="min-h-screen bg-gray-50">
      <HeaderLoggedIn />
      <div className="p-4">
        <h1 className="text-xl font-semibold">Posts</h1>
        <p>게시물 목록 페이지</p>
      </div>
    </div>
  )
}

export default Posts


