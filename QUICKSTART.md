# Quick Start Guide

Get the SignalR Chat PWA app running in 5 minutes!

## Prerequisites

- [.NET 9 SDK](https://dotnet.microsoft.com/download)
- [Node.js 18+](https://nodejs.org/)

## Step 1: Start the Backend (Terminal 1)

```bash
cd backend/ChatApi
dotnet restore
dotnet run
```

✅ Wait for: `Now listening on: http://localhost:5000`

## Step 2: Start the Frontend (Terminal 2)

```bash
cd frontend
npm install
npm run dev
```

✅ Wait for: `Local: http://localhost:3000/`

## Step 3: Open the App

1. Open your browser to **http://localhost:3000**
2. Enter a username
3. Click "Join Chat"
4. Start chatting!

## Test Real-Time Features

### Multiple Users
Open http://localhost:3000 in multiple browser tabs or windows and join with different usernames. You'll see:
- ✅ Users appear in the online list
- ✅ Messages appear instantly in all windows
- ✅ Join/leave notifications
- ✅ Typing indicators

### Connection Status
- Look for the green "● Connected" indicator
- Try disabling/enabling network to see reconnection

### PWA Features
To test PWA installation:

```bash
cd frontend
npm run build
npm run preview
```

Then visit the preview URL and look for the install prompt!

## Troubleshooting

### Backend won't start
- Check if port 5000 is already in use
- Verify .NET 9 SDK is installed: `dotnet --version`

### Frontend won't start
- Delete `node_modules` and `package-lock.json`, then run `npm install` again
- Check if port 3000 is already in use

### SignalR not connecting
- Ensure backend is running first
- Check browser console for errors
- Verify CORS settings allow http://localhost:3000

## What to Demonstrate

### For SignalR/WebSockets:
1. **Real-time updates**: Send messages, see them appear instantly
2. **Presence**: Join/leave with multiple users
3. **Typing indicators**: Start typing in one window, see indicator in others
4. **Reconnection**: Disable network, re-enable, watch auto-reconnect
5. **WebSocket in DevTools**: Network tab → WS filter

### For PWA:
1. **Build the app**: `npm run build && npm run preview`
2. **Install prompt**: Look for install banner
3. **Manifest**: DevTools → Application → Manifest
4. **Service Worker**: DevTools → Application → Service Workers
5. **Offline mode**: Install app, enable offline, app still loads

## Next Steps

- Read the main [README.md](../README.md) for detailed documentation
- Check [backend/README.md](../backend/README.md) for SignalR details
- Check [frontend/README.md](../frontend/README.md) for React/PWA details
- Customize the chat features for your needs!
