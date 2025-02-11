# BGG Cache Updater

This application periodically fetches data from BoardGameGeek (BGG) and updates Azure Storage blobs with the results. It runs as a containerized application that updates the cache at configurable intervals.

## Configuration

The application uses the following environment variables:

- `BGG_USERNAME`: Your BGG username (required)
- `BGG_PASSWORD`: Your BGG password (optional)
- `CACHE_STORAGE`: Azure Storage connection string (required)
- `UPDATE_INTERVAL_MINUTES`: How often to update the cache (default: 15 minutes)

## Building and Running with Docker

1. Build the container:
```bash
docker build -t bgg-cache-updater .
```

2. Run the container:
```bash
docker run -d \
  -e BGG_USERNAME=your_username \
  -e BGG_PASSWORD=your_password \
  -e CACHE_STORAGE=your_storage_connection_string \
  -e UPDATE_INTERVAL_MINUTES=15 \
  bgg-cache-updater
```

## Features

- Fetches BGG collection, plays, and top 10 data
- Updates game details for all games in collection and plays
- Processes and enriches data with additional information
- Stores results in Azure Storage blobs
- Triggers frontend cache refresh after updates
- Automatically retries on errors
- Configurable update interval
- Respects BGG API rate limits
