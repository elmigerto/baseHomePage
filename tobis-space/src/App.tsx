import { Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import BoardGame from './pages/BoardGame'
import Stories from './pages/Stories'
import Drawings from './pages/Drawings'
import CheckoutSuccess from './pages/CheckoutSuccess'
import CheckoutCancel from './pages/CheckoutCancel'
import Cart from './components/Cart'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="boardgame" element={<BoardGame />} />
        <Route path="stories" element={<Stories />} />
        <Route path="drawings" element={<Drawings />} />
        <Route path="cart" element={<Cart />} />
        <Route path="success" element={<CheckoutSuccess />} />
        <Route path="cancel" element={<CheckoutCancel />} />
      </Route>
    </Routes>
  )
}
