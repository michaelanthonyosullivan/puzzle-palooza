# Puzzle Game

## Overview
A puzzle game application built with React, Vite, and Tailwind CSS. Users can select from different puzzle images (Farmyard, Playground, Dinosaurs, Harbour) and play puzzle games with them.

## Project Structure
```
src/
├── assets/              # Puzzle images (dinosaurs.jpg, farmyard.jpg, harbour.jpg, playground.jpg)
├── components/
│   ├── ui/             # Shadcn UI components
│   ├── Celebration.tsx # Celebration animation component
│   ├── NavLink.tsx     # Navigation link component
│   ├── PuzzleGame.tsx  # Main puzzle game logic
│   └── PuzzleSelector.tsx # Puzzle selection screen
├── hooks/
│   ├── use-mobile.tsx  # Mobile detection hook
│   ├── use-toast.ts    # Toast notification hook
│   └── useCelebrationSound.ts # Sound effects hook
├── lib/
│   └── utils.ts        # Utility functions
├── pages/
│   ├── Index.tsx       # Home page with puzzle selector
│   └── NotFound.tsx    # 404 page
├── App.tsx             # Main app component
├── index.css           # Global styles
└── main.tsx            # Entry point
```

## Technologies Used
- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with Shadcn UI components
- **Animation**: Framer Motion
- **Routing**: React Router DOM
- **State Management**: TanStack React Query

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

## User Preferences
- None recorded yet

## Architecture Notes
- Frontend-only application with no backend required
- All puzzle images are stored locally in src/assets/
- Uses React Router for navigation