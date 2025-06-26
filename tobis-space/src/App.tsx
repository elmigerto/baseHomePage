import { Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import BoardGame from './pages/BoardGame'
import BoardGameCommunity from './pages/BoardGameCommunity'
import BoardGameRules from './pages/BoardGameRules'
import BoardGameUpdates from './pages/BoardGameUpdates'
import Stories from './pages/Stories'
import Chapter from './pages/Chapter'
import Drawings from './pages/Drawings'
import About from './pages/About'
import CheckoutSuccess from './pages/CheckoutSuccess'
import CheckoutCancel from './pages/CheckoutCancel'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="boardgame" element={<BoardGame />}>
          <Route path="community" element={<BoardGameCommunity />} />
          <Route path="rules" element={<BoardGameRules />} />
          <Route path="updates" element={<BoardGameUpdates />} />
        </Route>
        <Route path="stories" element={<Stories />}>
          <Route path=":chapterSlug" element={<Chapter />} />
        </Route>
        <Route path="drawings" element={<Drawings />} />
        <Route path="about" element={<About />} />
        <Route path="success" element={<CheckoutSuccess />} />
        <Route path="cancel" element={<CheckoutCancel />} />
      </Route>
    </Routes>
  )
}
