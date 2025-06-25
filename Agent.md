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
- **Formatter**: [Biome](https://biomejs.dev)

## 📂 File Organization
- Project code lives in `tobis-space/`
- Individual task files are in `Agent/`
- This file (`Agent.md`) summarizes the project scope

## 🧑‍💻 Agent Instructions
### Coding Style
- Use Tailwind for styling
- Functional components only
- Manage state with React Context or signals
- Apply `min-h-screen` for layout height
- Sort imports and remove unused ones
- Format using Biome on save

### Routing & Pages
- Use `react-router-dom` for routing
- Subpages: `/`, `/boardgame`, `/stories`, `/drawings`

### Stripe Integration
- Backend exposes `/create-checkout-session`
- Frontend redirects to Stripe Checkout
- Handle success and cancel routes
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
- **Content Sections**: Board game showcase, stories list with full texts, and a virtual drawings gallery with image modal.
- **Stripe Checkout**: Node.js backend exposes `/create-checkout-session` and handles success/cancel redirects.
- **Deployment**: Host frontend and backend (e.g., Vercel/Render) and store Stripe secrets as environment variables.
- **Design Enhancements**: Responsive layout using Tailwind and a full-screen hero section.

