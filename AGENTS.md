# 🧠 Agent Briefing: tobis-space

## 🎯 Project Goal
Build a personal homepage where visitors can browse board games, read stories, and explore a virtual gallery. Each section offers products that can be purchased through a shared cart and Stripe Checkout.

## 🛠 Tech Stack
- **Frontend**: React + Vite + Tailwind CSS
- **Language**: TypeScript
- **Routing**: React Router
- **Cart**: Custom React context
- **Payments**: Stripe Checkout (custom backend)
- **Backend**: Node.js (Express or serverless)
- **Database**: SQLite used to store checkout orders
- **Translations**: English/German strings via `LanguageContext`
- **Theme**: Light/Dark toggle provided by `ThemeContext` (default dark)
- **Formatter**: [Biome](https://biomejs.dev)

## 📂 File Organization
- Project code lives in `tobis-space/`
- Individual task files are in `Agent/`
- Markdown files inside `Agent/` match their topic and should be kept updated
- This file (`Agent.md`) summarizes the project scope

## 🗂 Repository Structure
Use this overview to quickly locate files:
- `tobis-space/` – React and Node project root
  - `src/` – Frontend source
    - `components/` – Shared UI components
    - `contexts/` – React contexts (e.g. cart)
    - `pages/` – Page components for each route
    - `files/` – Markdown chapters and assets
  - `server/` – Express backend with Stripe
  - `package.json` – Scripts (run `npm run dev` for Vite, `npm run server` for backend)
  - `404.html` – Fallback page for GitHub Pages
- `Agent/` – Documentation and tasks
  - `frontend/` – Frontend tasks (`README.md` lists all subtasks)
  - `stories/` – Story Markdown chapters
  - `backend.md` / `deployment.md` – Backend and deployment guides
- `README.md` – Minimal repo overview (refer mainly to `Agent/` docs)

## 🧑‍💻 Agent Instructions
### Coding Style
- Use Tailwind for styling
- Functional components only
- Manage state with React Context or signals
- Apply `min-h-screen` for layout height
- Sort imports and remove unused ones
- Format using Biome on save
- It's not needed to run Biome again at the end of your work

### Routing & Pages
- Use `react-router-dom` for routing
- Subpages include:
  - `/` (home)
  - `/boardgame` with `/about`, `/community`, `/rules`, `/updates`, `/buy`
  - `/stories` and `/stories/:chapterSlug`
  - `/drawings` walk-through view
  - `/drawings/gallery` grid view
  - `/drawings/virtual` 3D room
  - `/software` and `/about`
  - `/checkout` → address form
  - `/payment` → Stripe redirect
  - `/success` and `/cancel` checkout result pages

### Stripe Integration
- Backend exposes `/create-checkout-session`
- Frontend redirects to Stripe Checkout
- Handle success and cancel routes
- Orders stored in `orders.db` (SQLite)
- Avoid third-party shopping platforms

## ✅ Do
- Respect folder structure
- Modularize components
- Use environment variables for API keys
- Optimize for clarity and maintainability

## 🚫 Don’t
- Use class components
- Introduce external UI libraries
- Include hardcoded secrets or credentials

---

## 📈 Task Summary
- **Frontend Setup**: Vite + React + Tailwind scaffold, basic layout, and routing configured.
- **Pages & Navigation**: Implement routes for the homepage, board game, stories, and drawings with a shared layout.
- **Cart & Product Display**: Global cart context, add-to-cart buttons, and a drawer/modal to show items.
- **Shopping Cards**: Reusable product cards with images, descriptions, and add-to-cart controls.
- **Content Sections**: Board game showcase, stories list with full texts, and a virtual drawings gallery with image modal.
- **Chapter Navigation**: Chapters load from Markdown files with matching images, ordered by number, and include previous/next links for continuous reading.
- **Stripe Checkout**: Node.js backend exposes `/create-checkout-session` and handles success/cancel redirects.
- **Deployment**: Host frontend and backend (e.g., Vercel/Render) and store Stripe secrets as environment variables.
- **Design Enhancements**: Responsive layout, default dark mode with toggle, and FontAwesome icons.
- **Internationalization**: Language dropdown with English and German strings.
- **404 Handling**: Static `404.html` page for GitHub Pages.

## 🗒️ Detailed Task List

The individual task files live in the `Agent/` folder. Each section below links to the
corresponding file so you can dive deeper when needed.

### Frontend Setup (`Agent/frontend/setup.md`)
- [x] Scaffold frontend using **Vite + React + Tailwind (TypeScript + SWC)**
- [x] Configure Tailwind with working `tailwind.config.ts` and global styles
- [x] Set up **basic layout**: header, nav bar, footer
- [x] Install and configure **React Router v6+** for subpages

-### Pages & Navigation (`Agent/frontend/pages-navigation.md`)
- [x] Create routes:
  - `/` → Homepage
  - `/boardgame` with `/about`, `/community`, `/rules`, `/updates`, `/buy`
  - `/stories` → Overview and `/stories/:chapterSlug`
  - `/drawings` walk-through view
  - `/drawings/gallery` grid gallery
  - `/drawings/virtual` 3D room
  - `/software` and `/about` static pages
  - Checkout flow: `/checkout` → `/payment` → `/success` or `/cancel`
- [x] Add navigation bar with active link highlighting
- [x] Implement a **shared layout** (e.g. with `<Outlet>`)

### Cart & Product Display (`Agent/frontend/cart.md`)
- [x] Implement global **Cart Context** using React Context API or signals
- [x] Show cart icon in header with item count
- [ ] Enable **Add to Cart** functionality from each subpage
- [x] Create a **Cart drawer or modal** to show items and total

### Shopping Cards (`Agent/frontend/product-cards.md`)
- [ ] Build a reusable **ProductCard** component
- [ ] Include image, description, price, and Add to Cart control

### Drawings Gallery (`Agent/frontend/gallery.md`)
- [x] Display paintings in a **virtual gallery style UI**
- [x] Add modal to preview enlarged artwork
- [x] Allow adding individual artworks to cart
- [ ] (Later) Add hover effects or simple 3D illusion
- [x] Add a `/drawings/room` subpage for an interactive room view
- [x] Let visitors pan or take small steps to look around
- [x] Keep movement minimal to stay lightweight

### Stripe Checkout Integration (`Agent/backend.md`)
- [x] Set up basic **Node.js Express backend**
- [x] Implement `/create-checkout-session` endpoint
- [x] Redirect user to Stripe Checkout when clicking "Buy"
- [x] Handle success/cancel URLs (e.g. `/success`, `/cancel`)
- [ ] (Optional) Add webhook handling for digital delivery

### Backend Hosting (`Agent/backend.md`)
- [ ] Deploy backend to **Render**, **Vercel**, or similar
- [ ] Store Stripe secret in environment variable
- [ ] Test full checkout flow end-to-end

### Deployment (`Agent/deployment.md`)
- [ ] Deploy frontend (Vite) to GitHub Pages or Vercel
- [ ] Connect to backend Stripe API from frontend
- [ ] Use custom domain (optional)

### Design Enhancements (`Agent/frontend/design.md`)
- [x] Improve layout with Tailwind so pages fill the screen and respond well on mobile
- [x] Add a full-screen hero section on the homepage

### File Locations
- **Board Game page component**: `tobis-space/src/pages/BoardGame.tsx`
- **Board Game subpages**: `tobis-space/src/pages/BoardGameCommunity.tsx`, `tobis-space/src/pages/BoardGameRules.tsx`
- **Board Game updates**: `tobis-space/src/pages/BoardGameUpdates.tsx`

