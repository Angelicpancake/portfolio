# CLAUDE.md

This file guides Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Interactive 3D portfolio website designed to showcase software and creative projects. Inspired by the immersive web experience of Phantom (phantom.land), the application features a curved 3D grid wall hero view where users can pan and inspect project tiles. Clicking any project card smoothly transitions straight to the detailed project view featuring embedded high-definition videos, interactive photo galleries, and tech breakdowns.

Key sections and features:
- **Home (Work)**: Immersive 3D curved grid wall with interactive project cards, sound effects, tags (e.g., 3D, AI, Web), and real-time floating status indicators.
- **Projects**: Filterable list/grid catalog of all past and current builds with rich media embeds (video previews, screenshots, links).
- **About**: Personal profile, technical skills, timeline, and background.
- **Interactive Navigation**: Bottom pill-style navigation bar (`Work`, `About`, `Projects`, `Filter`) and top utility bar (live time clocks, sound toggle, contact CTA).

## Tech Stack

- **Framework**: Next.js 15 (App Router), React 19, TypeScript 5.x
- **3D & Animation**: WebGL / Three.js, React Three Fiber (`@react-three/fiber`), `@react-three/drei`, GSAP (GreenSock) / Framer Motion
- **Styling**: Tailwind CSS v4, Lucide React (Icons)
- **Smooth Scroll & Utilities**: Lenis Scroll, Zustand (State Management for sound & active filters)

## Architecture

├── public/                  # Static assets (images, video previews, models, audio)
│   ├── assets/projects/     # Screenshots and video demo embeds per project
│   └── audio/               # Ambient sounds and hover SFX
├── src/
│   ├── app/                 # Next.js App Router routes
│   │   ├── layout.tsx       # Root layout with WebGL canvas wrapper & Global UI
│   │   ├── page.tsx         # Home tab (3D Curved Grid Showcase)
│   │   ├── about/           # About tab
│   │   ├── projects/        # All Projects list & detailed view
│   │   │   └── [slug]/      # Individual project deep-dive page
│   │   └── api/             # Optional contact/metadata endpoints
│   ├── components/
│   │   ├── 3d/              # React Three Fiber components
│   │   │   ├── CurvedWall.tsx    # 3D spherical/cylindrical project grid
│   │   │   ├── ProjectCard3D.tsx # WebGL texture plane for project thumbnails
│   │   │   └── CanvasContainer.tsx # Canvas initialization & post-processing
│   │   ├── ui/              # Floating navigation bars & UI overlays
│   │   │   ├── Header.tsx        # Top status bar, live clocks, sound toggle
│   │   │   ├── Navigation.tsx    # Bottom pill navigation ([Work], [About], [Projects])
│   │   │   └── FilterModal.tsx   # Filter drawer by project tags/categories
│   │   └── media/           # Video player & lightbox photo viewer components
│   ├── hooks/               # Custom React hooks (useSound, useTimezones, use3DInteraction)
│   ├── store/               # Zustand state store (active project, mute status, filters)
│   ├── data/                # Static JSON/TS project metadata definitions
│   │   └── projects.ts      # Project descriptions, media URLs, tags, links
│   └── styles/              # Global styles and WebGL canvas CSS overrides

## Common Commands

```bash
# Development
npm run dev           # Start Next.js development server on http://localhost:3000

# Build & Quality Checks
npm run build         # Build production-ready bundle
npm run start         # Preview production build locally
npm run lint          # Run ESLint check
npm run type-check    # Run TypeScript compiler check without emitting files

# Formatting & Maintenance
npm run format        # Format codebase with Prettier

## Adding projects

Project write-ups live in `src/data/projects.ts` and render verbatim via `components/media/SectionRenderer.tsx`. To add or update them from a PDF/notes, use the prompt in `docs/add-project-prompt.md`.
