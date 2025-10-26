# Backend - SignalR Chat API

This ASP.NET Core Web API demonstrates SignalR implementation for real-time communication.

## Architecture

### ChatHub (`Hubs/ChatHub.cs`)

The SignalR Hub handles all real-time communication:

- **Connection Management**: Tracks connected users
- **Message Broadcasting**: Sends messages to all clients
- **User Presence**: Notifies when users join/leave
- **Typing Indicators**: Real-time typing status updates

### Key Methods

```csharp
// Called when a user joins the chat
public async Task JoinChat(string username)

// Broadcasts a message to all connected clients
public async Task SendMessage(string message)

// Sends typing indicator to other users
public async Task SendTypingIndicator(bool isTyping)

// Automatic lifecycle methods
public override async Task OnConnectedAsync()
public override async Task OnDisconnectedAsync(Exception? exception)
```

## Configuration

### CORS Setup

The application is configured to accept connections from React development servers:

```csharp
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.WithOrigins("http://localhost:3000", "http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();  // Required for SignalR
    });
});
```

### SignalR Configuration

```csharp
builder.Services.AddSignalR();

// Map the hub endpoint
app.MapHub<ChatHub>("/chatHub");
```

## Running the Application

```bash
cd backend/ChatApi
dotnet restore
dotnet run
```

The API will start on `http://localhost:5000`.

### Health Check

Visit `http://localhost:5000` to verify the API is running. You should see:
```json
{
  "status": "running",
  "message": "Chat API with SignalR is running",
  "hubEndpoint": "/chatHub"
}
```

## SignalR Hub Endpoint

The SignalR hub is available at: `http://localhost:5000/chatHub`

## Development Tips

### Logging

SignalR logging is enabled in `appsettings.Development.json`:
```json
{
  "Logging": {
    "LogLevel": {
      "Microsoft.AspNetCore.SignalR": "Debug",
      "Microsoft.AspNetCore.Http.Connections": "Debug"
    }
  }
}
```

### Testing with Multiple Clients

You can test the SignalR hub with multiple clients:
1. Open the frontend in multiple browser windows
2. Use the SignalR test client (available in Visual Studio)
3. Use Postman with SignalR support

### Production Considerations

For production deployments, consider:
- Using a distributed cache (Redis) for connection tracking
- Implementing authentication and authorization
- Adding rate limiting
- Setting up Azure SignalR Service for better scalability
- Configuring sticky sessions for load-balanced environments

## Dependencies

- **Microsoft.AspNetCore.SignalR** (1.2.0): SignalR library
- **Microsoft.AspNetCore.OpenApi** (9.0.9): OpenAPI support

## Code Structure

```
ChatApi/
├── Hubs/
│   └── ChatHub.cs           # SignalR Hub implementation
├── Program.cs               # Application startup and configuration
├── appsettings.json         # Configuration
└── ChatApi.csproj           # Project file
```
