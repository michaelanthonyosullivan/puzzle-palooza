# Farmyard Puzzle

A fun and colorful farmyard jigsaw puzzle game for kids. Drag and drop pieces to complete the picture, pick a difficulty level, and race against the timer for a best-time star rating.

## Getting started

This project uses [pnpm](https://pnpm.io/) and Node.js.

```sh
# Step 1: Clone the repository.
git clone https://github.com/michaelanthonyosullivan/puzzle-palooza.git

# Step 2: Navigate to the project directory.
cd puzzle-palooza

# Step 3: Install dependencies.
pnpm install

# Step 4: Start the development server with auto-reloading and an instant preview.
pnpm dev
```

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- Tailwind CSS
- Framer Motion
- React Router DOM

## How can I deploy this project?

This is a frontend-only Vite app. Build the production bundle with `pnpm build` and serve the `dist/` folder on any static host (e.g. Replit, Netlify, Vercel, GitHub Pages).

## Recent changes

- Removed the unused `bun.lock` and `package-lock.json`; `pnpm-lock.yaml` is the single source of truth for dependencies.
- Removed remaining Lovable branding (OG image, tagger plugin) in favor of a local puzzle preview image.
- Pinned Vite to v7 with `@vitejs/plugin-react-swc`.
- Added difficulty levels, snap sound, in-play menu, timer/best-time with star ratings, and a Next Puzzle button.
