# Take Microsoft's dotnet SDK Base
FROM mcr.microsoft.com/dotnet/sdk:6.0
# Setup the working directory
WORKDIR /src
# Copy over all of our existing files to build inside the container
COPY . .
# Restore the dependencies of the project
RUN dotnet restore
# Build the release build of the project
RUN dotnet publish -c release -o ./bin/release/webserver --no-self-contained --no-restore
# Expose 8080 for web-server traffic
EXPOSE 8080

# Execute the web-server
CMD ["./bin/release/webserver/ElmRemoting"]