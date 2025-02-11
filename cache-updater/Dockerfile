FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src
COPY ["GamesCacheUpdater.csproj", "./"]
RUN dotnet restore "GamesCacheUpdater.csproj"
COPY . .
RUN dotnet build "GamesCacheUpdater.csproj" -c Release -o /app/build
RUN dotnet publish "GamesCacheUpdater.csproj" -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/runtime:9.0
WORKDIR /app
COPY --from=build /app/publish .

# Required environment variables:
# - BGG_USERNAME: Your BGG username
# - CACHE_STORAGE: Azure Storage connection string
# Optional environment variables:
# - BGG_PASSWORD: Your BGG password
# - UPDATE_INTERVAL_MINUTES: How often to update the cache (default: 15 minutes)

ENTRYPOINT ["dotnet", "GamesCacheUpdater.dll"]
