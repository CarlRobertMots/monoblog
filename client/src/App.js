import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PostList from './components/PostList'
import PostPage from './components/PostPage'
import AddPost from './components/AddPost'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<PostList />} />
        <Route path='/posts/:id' element={<PostPage />} />
        <Route path='/add' element={<AddPost />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App