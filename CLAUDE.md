# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is **games.ewal.net** - a two-component system for displaying BoardGameGeek collection and play statistics:

1. **Cache Updater** (C#/.NET 9) - Downloads data from BoardGameGeek API and stores in Digital Ocean Spaces
2. **Frontend** (Next.js 15/TypeScript) - Web application displaying the cached data

**Architecture**: BGG XML API → Cache Updater → Digital Ocean Spaces → Next.js Frontend

## Development Commands

### Frontend (Next.js)
```bash
cd frontend/

# Development
npm run dev         # Start dev server
npm run build       # Production build  
npm run lint        # ESLint check
npm start           # Serve production build
```

### Cache Updater (C#/.NET)
```bash
cd cache-updater/

# Development
dotnet build GamesCacheUpdater.csproj
dotnet run

# Docker
docker build -t bgg-cache-updater .
docker run -d -e BGG_USERNAME=username -e DO_SPACES_KEY=your-key -e DO_SPACES_SECRET=your-secret -e DO_SPACES_BUCKET=your-bucket bgg-cache-updater

# Clean artifacts
sudo rm -rf obj bin
```

## Key Architecture Patterns

### Data Flow
- Cache Updater runs continuously (15-min intervals) fetching BGG data
- Processes and enriches data (expansions, statistics, cooperative detection)
- Uploads JSON to Digital Ocean Spaces only when changed
- Triggers Next.js ISR cache invalidation via API calls

### Frontend Data Architecture
- Server-side data fetching with `unstable_cache` (60s revalidation)
- Cache tags for selective invalidation via `/api/revalidate` endpoint
- Hardcoded username: `ervwalter` in data fetching functions
- Base URL: Digital Ocean Spaces public URL (configured via environment variable)

### BGG API Integration
- Rate-limited: 5.1s between requests with semaphore throttling
- Handles HTTP 202 responses with exponential backoff
- Cookie-based authentication for private collection data
- Comprehensive retry logic (5 attempts)

## Data Contracts

### Key JSON Files
- `plays.json` - Complete play history
- `collection.json` - Board game collection with expansions
- `stats.json` - Aggregated statistics
- `top10.json` - Personal top 10 rankings
- `game-details.json` - Shared BGG metadata cache

### Core TypeScript Interfaces
- `Play` - Game sessions with players, ratings, duration
- `Game` - Collection items with BGG metadata and relationships
- `Stats` - Collection and play statistics
- `TopTenItem` - Ranked games list

## Environment Configuration

### Cache Updater
**Required:**
- `BGG_USERNAME` - BoardGameGeek username
- `DO_SPACES_KEY` - Digital Ocean Spaces access key (keep secret!)
- `DO_SPACES_SECRET` - Digital Ocean Spaces secret key (keep secret!)
- `DO_SPACES_BUCKET` - Digital Ocean Spaces bucket name

**Optional:**
- `BGG_PASSWORD` - For private BGG data access
- `DO_SPACES_REGION` - Digital Ocean Spaces region (default: nyc3)
- `UPDATE_INTERVAL_MINUTES` - Update frequency (default: 15)

### Frontend
**Required:**
- `DO_SPACES_URL` - Digital Ocean Spaces public URL (e.g., https://bucket.region.digitaloceanspaces.com)

**Optional:**
- Plausible analytics variables for production

## Development Notes

### Frontend Routing (App Router)
- `/` → `/overview` (redirect)
- `/overview` - Dashboard with recent plays
- `/insights` - Analytics charts (Nivo)
- `/collection` - Sortable collection table
- `/mostplayed` - Games by play count
- `/topten` - Personal rankings

### Styling
- Tailwind CSS with mobile-first responsive design
- Custom icon font (`/fonts/icons.woff`)
- WebP image optimization for BGG CDN
- Collapsible sidebar navigation

### Data Processing Logic
- **Article removal**: Strips "The", "A" for sorting (`sortableName`)
- **Expansion mapping**: Links expansions to base games
- **Cooperative detection**: Via BGG mechanics metadata
- **Custom metadata**: Parses BGG comments for overrides

### Docker Deployment
Both components have Dockerfiles and are designed for containerized deployment with standalone Next.js output and .NET 9 runtime.