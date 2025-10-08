import React from 'react'
import { Link } from 'react-router-dom'

function NotFound() {
  return (
    <div className="p-4 text-center">
      <h1 className="text-2xl font-bold">404</h1>
      <p className="mt-2">페이지를 찾을 수 없습니다.</p>
      <div className="mt-4">
        <Link className="text-blue-600" to="/">홈으로</Link>
      </div>
    </div>
  )
}

export default NotFound


