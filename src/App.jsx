import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Landing from './pages/Landing.jsx'
import SignIn from './pages/SignIn.jsx'
import SignUp from './pages/SignUp.jsx'
import Main from './pages/Main.jsx'
import Posts from './pages/Posts.jsx'
import PostDetail from './pages/PostDetail.jsx'
import FeedbackDetail from './pages/FeedbackDetail.jsx'
import Upload from './pages/Upload.jsx'
import LeaderBoard from './pages/LeaderBoard.jsx'
import MyPaged from './pages/MyPaged.jsx'
import Admin from './pages/Admin.jsx'
import NotFound from './pages/NotFound.jsx'

function App() {
  const isAuthed = localStorage.getItem("accessToken") ? true : false;

  return (
    <BrowserRouter>
      <Routes>
        {/* 리디렉션 */}
        <Route path="/" element={<Navigate to="/landing" replace />} />
        

        <Route path="/" element={<Navigate to={isAuthed ? '/main' : '/landing'} replace />} /> 

        {/* 비로그인 시 */}
        <Route path="/landing" element={<Landing />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />

        {/* 로그인 시 (비로그인도 접근 가능) */}
        <Route path="/main" element={<Main />} />
        <Route path="/posts" element={<Posts />} />
        <Route path="/posts/:postId" element={<PostDetail />} />
        <Route path="/posts/:postId/:feedbackId" element={<FeedbackDetail />} />
        <Route
          path="/upload"
          element={isAuthed ? <Upload /> : <Navigate to="/sign-in" replace />}
        />
        <Route path="/leader-board" element={<LeaderBoard />} />
        <Route path="/my-paged" element={<MyPaged />} />
        <Route path="/admin" element={<Admin />} />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App