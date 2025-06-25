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
- [ ] Set up **basic layout**: header, nav bar, footer
- [ ] Install and configure **React Router v6+** for subpages

## 🧭 Pages & Navigation
- [ ] Create routes:
  - `/` → Homepage
  - `/boardgame` → Board Game section
  - `/stories` → Stories section
  - `/drawings` → Painted Drawings (virtual gallery)
- [ ] Add navigation bar with active link highlighting
- [ ] Implement a **shared layout** (e.g. with `<Outlet>`)

## 🛒 Cart & Product Display
- [ ] Implement global **Cart Context** using React Context API or signals
- [ ] Show cart icon in header with item count
- [ ] Enable **Add to Cart** functionality from each subpage
- [ ] Create a **Cart drawer or modal** to show items and total

## 🎨 Drawings Gallery (Virtual Room)
- [ ] Display paintings in a **virtual gallery style UI**
- [ ] Add modal to preview enlarged artwork
- [ ] Allow adding individual artworks to cart
- [ ] (Later) Add hover effects or simple 3D illusion

## 💳 Stripe Checkout Integration
- [ ] Set up basic **Node.js Express backend**
- [ ] Implement `/create-checkout-session` endpoint
- [ ] Redirect user to Stripe Checkout when clicking "Buy"
- [ ] Handle success/cancel URLs (e.g. `/success`, `/cancel`)
- [ ] (Optional) Add webhook handling for digital delivery

## 📦 Backend Hosting
- [ ] Deploy backend to **Render**, **Vercel**, or similar
- [ ] Store Stripe secret in environment variable
- [ ] Test full checkout flow end-to-end

## 🚚 Deployment
- [ ] Deploy frontend (Vite) to GitHub Pages or Vercel
- [ ] Connect to backend Stripe API from frontend
- [ ] Use custom domain (optional)
