# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Development server**: `npm run dev` (starts Next.js dev server)
- **Build**: `npm run build` (creates production build)  
- **Lint**: `npm run lint` (runs ESLint with Next.js config)
- **Start production**: `npm start` (serves production build)

The project uses npm as the package manager.

## Architecture Overview

This is a Next.js 15 frontend application for displaying board game statistics and collection data. The app uses:

- **Next.js App Router** with TypeScript and React 19
- **Tailwind CSS** for styling with custom fonts (Inter + local icon font)
- **Server-side data fetching** from Azure Blob Storage cache
- **Plausible Analytics** for tracking (production only)

### Key Directories

- `/app` - Next.js App Router pages and layouts
  - `/api` - API routes for cache revalidation
  - Page directories: `/overview`, `/insights`, `/mostplayed`, `/topten`, `/collection`
- `/lib` - Shared utilities and data fetching
  - `data.ts` - Main data fetching functions with Next.js caching
  - `games-interfaces.ts` - TypeScript interfaces for game data
  - `insights.ts` - Analytics calculations
- `/components` - Reusable UI components

### Data Architecture

Data is fetched from `https://ewalgamescache.blob.core.windows.net/gamescache` with:
- 60-second revalidation intervals
- Next.js `unstable_cache` for server-side caching
- Cache tags for selective invalidation
- Automatic 404 handling for missing data

Core data types:
- `Play` - Individual game sessions with players, ratings, duration
- `Game` - Board game collection items with BGG metadata  
- `Stats` - Aggregated statistics (collection + play stats)
- `TopTenItem` - Top 10 ranked games

### Routing Structure

- `/` - Redirects to overview
- `/overview` - Dashboard with recent plays and stats blocks
- `/insights` - Charts and analytics (Nivo charts)
- `/mostplayed` - Games ranked by play count
- `/topten` - Personal top 10 games list
- `/collection` - Full collection table with sorting

### Styling Notes

- Uses Tailwind CSS with responsive design (mobile-first)
- Custom icon font loaded locally (`/fonts/icons.woff`)
- Sidebar navigation that collapses on mobile
- Image optimization for BoardGameGeek CDN images
- WebP format preferred for images

### Next.js Configuration

- **Standalone output** for Docker deployment
- **Typed routes** experimental feature enabled
- **SVG support** via @svgr/webpack
- **Remote images** allowed from cf.geekdo-images.com
- **Cache headers** configured for static assets and data