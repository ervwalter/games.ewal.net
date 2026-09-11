FROM mcr.microsoft.com/dotnet/sdk:10.0.401@sha256:2fa828c68761b1b8c23d7662dc134421b9d3b59fe1425fdbc80804e390cdb24d AS build
WORKDIR /src
COPY ["GamesCacheUpdater.csproj", "./"]
RUN dotnet restore "GamesCacheUpdater.csproj"
COPY . .
RUN dotnet build "GamesCacheUpdater.csproj" -c Release -o /app/build
RUN dotnet publish "GamesCacheUpdater.csproj" -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/runtime:10.0.12@sha256:8a153b5889d796b6450295b383596b13308c24c230515f8a7770ce1b94e0c460
WORKDIR /app
COPY --from=build /app/publish .

# Only define non-sensitive environment variables with defaults
ENV UPDATE_INTERVAL_MINUTES="60"
ENV DO_SPACES_REGION="nyc3"

# Document required environment variables
# BGG_USERNAME - Your BGG username (required)
# BGG_PASSWORD - Your BGG password (optional)
# BGG_API_TOKEN - Your BGG API Bearer token (optional, but recommended for API authentication)
# DO_SPACES_KEY - Your Digital Ocean Spaces access key (required, keep secret!)
# DO_SPACES_SECRET - Your Digital Ocean Spaces secret key (required, keep secret!)
# DO_SPACES_BUCKET - Your Digital Ocean Spaces bucket name (required)
# DO_SPACES_REGION - Your Digital Ocean Spaces region (optional, defaults to nyc3)

ENTRYPOINT ["dotnet", "GamesCacheUpdater.dll"]
