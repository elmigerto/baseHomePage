import { Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import About from './pages/About'
import BoardGame from './pages/BoardGame'
import BoardGameAbout from './pages/BoardGameAbout'
import BoardGameCommunity from './pages/BoardGameCommunity'
import BoardGameRules from './pages/BoardGameRules'
import BoardGameUpdates from './pages/BoardGameUpdates'
import Chapter from './pages/Chapter'
import CheckoutCancel from './pages/CheckoutCancel'
import CheckoutSuccess from './pages/CheckoutSuccess'
import Drawings from './pages/Drawings'
import DrawingsRoom from './pages/DrawingsRoom'
import DrawingsScrollRoom from './pages/DrawingsScrollRoom'
import Home from './pages/Home'
import Stories from './pages/Stories'
import StoryOverview from './pages/StoryOverview'
import Software from './pages/Software'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="boardgame" element={<BoardGame />}>
          <Route index element={<BoardGameAbout />} />
          <Route path="about" element={<BoardGameAbout />} />
          <Route path="community" element={<BoardGameCommunity />} />
          <Route path="rules" element={<BoardGameRules />} />
          <Route path="updates" element={<BoardGameUpdates />} />
        </Route>
        <Route path="stories" element={<Stories />}>
          <Route index element={<StoryOverview />} />
          <Route path=":chapterSlug" element={<Chapter />} />
        </Route>
        <Route path="drawings" element={<DrawingsRoom />} />
        <Route path="drawings/scroll" element={<DrawingsScrollRoom />} />
        <Route path="drawings/gallery" element={<Drawings />} />
        <Route path="software" element={<Software />} />
        <Route path="about" element={<About />} />
        <Route path="success" element={<CheckoutSuccess />} />
        <Route path="cancel" element={<CheckoutCancel />} />
      </Route>
    </Routes>
  )
}
