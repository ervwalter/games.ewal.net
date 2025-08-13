# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Application Overview

This is a **BoardGameGeek (BGG) Cache Updater** - a long-running containerized service that synchronizes data between BoardGameGeek's XML API and a Next.js frontend at games.ewal.net. It acts as a data pipeline: **BGG XML API → Cache Updater → S3-Compatible Storage → Next.js Frontend**.

The service runs in an infinite loop (default 15-minute intervals), downloading board game data, processing it, storing it as JSON in S3-compatible storage, and triggering frontend cache refreshes.

## Build and Development Commands

```bash
# Build the project
dotnet build GamesCacheUpdater.csproj

# Run locally (requires environment variables)
dotnet run

# Docker build and run
docker build -t bgg-cache-updater .
docker run -d -e BGG_USERNAME=your_username -e CACHE_STORAGE=your_connection_string bgg-cache-updater

# Clean build artifacts
sudo rm -rf obj bin  # Use sudo if permission denied
```

## Architecture and Data Flow

### Core Components
- **Program.cs**: Entry point with infinite loop, custom logging, environment configuration
- **CacheUpdater.cs**: Main orchestration engine managing the complete data pipeline
- **BggClient.cs**: BGG API integration with rate limiting (5.1s between requests) and retry logic
- **Models.cs**: Rich data models with computed fields and relationships

### Data Pipeline Process
1. **Collection Phase**: Download plays, collection, top-10, and game details from BGG API
2. **Processing Phase**: Enrich data with mechanics, ratings, expansion relationships, statistics
3. **Storage Phase**: Serialize to JSON and upload to S3-compatible storage (only if changed)
4. **Integration Phase**: Trigger Next.js ISR cache refresh by hitting specific frontend URLs

### Key Data Files Generated
- `game-details.json` - Shared BGG game metadata cache
- `plays-{username}.json` - Complete play history
- `recent-plays-{username}.json` - Last 100 plays
- `collection-{username}.json` - Owned games with expansions
- `stats-{username}.json` - Aggregated statistics
- `top10-{username}.json` - Personal rankings

## Configuration

The application uses **environment variables only** (no config files):

**Required:**
- `BGG_USERNAME` - BoardGameGeek username
- `S3_ENDPOINT` - S3-compatible storage endpoint URL
- `S3_BUCKET_NAME` - S3 bucket name
- `S3_ACCESS_KEY` - S3 access key
- `S3_SECRET_KEY` - S3 secret key

**Optional:**
- `BGG_PASSWORD` - For accessing private BGG data
- `S3_REGION` - S3 region (default: us-east-1)
- `UPDATE_INTERVAL_MINUTES` - Update frequency (default: 15)

## BGG API Integration Patterns

### Rate Limiting Strategy
- Uses semaphore-based throttling with 5.1-second delays between requests
- Handles BGG's HTTP 202 "processing" responses with exponential backoff
- Automatically retries failed requests up to 5 times

### Authentication
- Cookie-based login for accessing private collection data
- Falls back to anonymous access if password not provided
- Maintains session cookies across requests

### Data Processing Logic
- **Article Removal**: Strips "The", "A", etc. for proper sorting
- **Expansion Mapping**: Links expansions to base games via BGG relationships
- **Cooperative Detection**: Identifies co-op games via mechanics metadata
- **Custom Metadata**: Parses private comments for overrides (descriptions, play times)

## Integration with Frontend

The service maintains tight integration with the Next.js frontend:
- **Change Detection**: Only uploads modified data to minimize storage costs
- **ISR Triggering**: Hits specific frontend URLs to invalidate Next.js ISR cache
- **60-Second Delay**: Waits for frontend ISR cache expiration before triggering refresh
- **JSON Contract**: Produces camelCase JSON matching frontend TypeScript interfaces

## Development Notes

### Resource Management
- Implements IDisposable pattern for HttpClient and S3 clients
- Uses `using` statements in Program.cs for proper cleanup in the infinite loop

### Error Handling
- Comprehensive try-catch with 5-minute retry delays on failures
- Graceful fallback to cached collection data if BGG API fails
- Extensive logging for debugging API issues

### Data Enrichment
- Backfills missing game data from multiple BGG API endpoints
- Calculates statistics (collection size, play counts, ratings)
- Processes complex relationships between base games and expansions
- Handles edge cases like duplicate games and missing metadata