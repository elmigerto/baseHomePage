# 🛠️ Project: tobis-space – Creator Homepage with Integrated Shop

## 🎯 Goal
A personal homepage with subpages for:
- **Board Game**, **Stories**, and **Painted Drawings**
- Integrated shopping across all subpages
- Custom lightweight cart
- Stripe Checkout for payments
- Full control over design and logic — no platform fees

---

## ✅ Frontend Setup
- [x] Scaffold frontend using **Vite + React + Tailwind (TypeScript + SWC)**
- [x] Configure Tailwind with working `tailwind.config.ts` and global styles
- [x] Set up **basic layout**: header, nav bar, footer
- [x] Install and configure **React Router v6+** for subpages

## 🧭 Pages & Navigation
- [x] Create routes:
  - `/` → Homepage
  - `/boardgame` → Board Game section
  - `/stories` → Stories section
  - `/drawings` → Painted Drawings (virtual gallery)
- [x] Add navigation bar with active link highlighting
- [x] Implement a **shared layout** (e.g. with `<Outlet>`)

## 🛒 Cart & Product Display
- [x] Implement global **Cart Context** using React Context API or signals
- [x] Show cart icon in header with item count
- [x] Enable **Add to Cart** functionality from each subpage
- [x] Create a **Cart drawer or modal** to show items and total

## 🎨 Drawings Gallery (Virtual Room)
- [x] Display paintings in a **virtual gallery style UI**
- [x] Add modal to preview enlarged artwork
- [x] Allow adding individual artworks to cart
- [ ] (Later) Add hover effects or simple 3D illusion

## 💳 Stripe Checkout Integration
- [x] Set up basic **Node.js Express backend**
- [x] Implement `/create-checkout-session` endpoint
- [x] Redirect user to Stripe Checkout when clicking "Buy"
- [x] Handle success/cancel URLs (e.g. `/success`, `/cancel`)
- [ ] (Optional) Add webhook handling for digital delivery

## 📦 Backend Hosting
- [ ] Deploy backend to **Render**, **Vercel**, or similar
- [ ] Store Stripe secret in environment variable
- [ ] Test full checkout flow end-to-end

## 🚚 Deployment
- [ ] Deploy frontend (Vite) to GitHub Pages or Vercel
- [ ] Connect to backend Stripe API from frontend
- [ ] Use custom domain (optional)

## 🎨 Design Enhancements
- [x] Improve layout with Tailwind so pages fill the screen and respond well on mobile
- [x] Add a full-screen hero section on the homepage
