# Puzzle Game

## Overview
A puzzle game application built with React, Vite, and Tailwind CSS. Users can select from different puzzle images (Farmyard, Playground, Dinosaurs, Harbour, Fire Engine, Steam Train, Tower Bridge, Wild Horses) and play jigsaw-style puzzle games with them.

## Features
- **Difficulty levels**: Easy (2×3), Medium (3×4), Hard (4×5) piece grids.
- **Drag-and-drop** pieces with a scaled snap threshold (forgiving on any screen size).
- **Snap sound** feedback when a piece locks into place.
- **In-play Menu button** to return to the puzzle selector without finishing.
- **Timer + best time** per puzzle, persisted in `localStorage`, with a 1–3 star rating on completion.
- **Next Puzzle** button on the celebration screen to advance through the puzzle list.
- **Celebration** animation (balloons, stars, bells) on completion.

## Project Structure
```
src/
├── assets/              # Puzzle images (jpg files)
├── components/
│   ├── Celebration.tsx # Celebration animation component
│   ├── PuzzleGame.tsx  # Main puzzle game logic
│   └── PuzzleSelector.tsx # Puzzle selection screen
├── hooks/
│   └── useCelebrationSound.ts # Sound effects hook
├── pages/
│   ├── Index.tsx       # Home page with puzzle selector
│   └── NotFound.tsx    # 404 page
├── App.tsx             # Main app component (router)
├── index.css           # Global styles
└── main.tsx            # Entry point
```

## Technologies Used
- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Animation**: Framer Motion
- **Routing**: React Router DOM

## Running the Project
The development server runs on port 5000:
```bash
npm run dev
```

## Recent Changes
- 2025-12-11: Migrated from Lovable platform to Replit
  - Updated Vite config to use port 5000 with allowedHosts enabled
  - Removed unused Supabase integration (was empty/unused)
  - Removed server folder (not needed for frontend-only app)
- Removed unused dependencies and shadcn/ui component library; trimmed to a minimal dependency set.
- Added difficulty levels, snap sound, in-play menu, timer/best-time/stars, and Next Puzzle.

## User Preferences
- None recorded yet

## Architecture Notes
- Frontend-only application with no backend required
- All puzzle images are stored locally in src/assets/
- Uses React Router for navigation
- Best times are stored per-puzzle in the browser's localStorage
