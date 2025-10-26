# Web Development Week 7: WebSockets, SignalR & Progressive Web Apps

This repository contains a comprehensive sample application demonstrating real-time communication using **SignalR** (ASP.NET Core) with **WebSockets** and **Progressive Web App (PWA)** features. This is designed as a teaching tool for web development courses covering React (frontend) and .NET (backend).

## 🎯 What This Application Demonstrates

### SignalR & WebSockets
- **Real-time bi-directional communication** between server and multiple clients
- **Persistent connections** using WebSockets (with fallback mechanisms)
- **Automatic reconnection** handling
- **Hub-based architecture** for managing connections and broadcasting messages
- **Typed events** for structured communication
- **Typing indicators** and user presence tracking

### Progressive Web App (PWA)
- **Installable** on desktop and mobile devices
- **Service Worker** for offline capabilities
- **App manifest** with proper metadata and icons
- **Responsive design** that works across devices
- **Native-like experience** when installed

## 📁 Project Structure

```
├── backend/
│   └── ChatApi/          # ASP.NET Core Web API with SignalR
│       ├── Hubs/
│       │   └── ChatHub.cs       # SignalR Hub for chat functionality
│       ├── Program.cs            # Application configuration
│       └── ChatApi.csproj        # Project file
├── frontend/
│   └── src/
│       ├── ChatApp.tsx           # Main chat component with SignalR client
│       ├── PWAInfo.tsx           # PWA installation prompt
│       └── vite.config.ts        # Vite config with PWA plugin
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- **.NET 9.0 SDK** or later
- **Node.js 18+** and npm
- A modern web browser (Chrome, Edge, Firefox, or Safari)

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend/ChatApi
```

2. Restore dependencies:
```bash
dotnet restore
```

3. Run the backend:
```bash
dotnet run
```

The API will start at `http://localhost:5000` by default.

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:3000`.

## 🔌 SignalR & WebSockets Deep Dive

### What is SignalR?

SignalR is a library for ASP.NET Core that simplifies adding real-time web functionality to applications. It enables server-side code to push content to clients instantly.

### How It Works

1. **Connection Establishment**: When a client connects, SignalR negotiates the best transport method:
   - WebSockets (preferred)
   - Server-Sent Events
   - Long Polling (fallback)

2. **Hub Pattern**: The `ChatHub` class acts as a high-level pipeline for communication:
   ```csharp
   public class ChatHub : Hub
   {
       public async Task SendMessage(string message)
       {
           // Server can call client methods
           await Clients.All.SendAsync("ReceiveMessage", message);
       }
   }
   ```

3. **Client Connection**: The React frontend establishes a connection:
   ```typescript
   const connection = new signalR.HubConnectionBuilder()
       .withUrl('http://localhost:5000/chatHub')
       .withAutomaticReconnect()
       .build();
   ```

### Key Features Demonstrated

- **Broadcasting**: Messages sent to all connected clients
- **Targeted messaging**: Send to specific users or groups
- **Connection lifecycle**: Handling connect/disconnect events
- **Automatic reconnection**: Graceful handling of network interruptions
- **Typing indicators**: Real-time presence information

### WebSockets vs. Other Technologies

| Feature | WebSockets | HTTP Polling | Server-Sent Events |
|---------|------------|--------------|-------------------|
| Bi-directional | ✅ Yes | ❌ No | ❌ No (one-way) |
| Real-time | ✅ Yes | ⚠️ Simulated | ✅ Yes |
| Overhead | ✅ Low | ❌ High | ⚠️ Medium |
| Browser Support | ✅ Excellent | ✅ Universal | ⚠️ Good |

## 📱 Progressive Web Apps (PWA) Explained

### What is a PWA?

A Progressive Web App is a web application that uses modern web capabilities to deliver an app-like experience to users. It's installable, works offline, and provides native-like functionality.

### Benefits of PWAs

1. **Installation**: 
   - Users can install the app on their device without going through an app store
   - Appears in the app drawer/home screen like a native app
   - Launches in its own window without browser UI

2. **Offline Capability**:
   - Service workers cache assets and data
   - Works without internet connection
   - Background sync when connection is restored

3. **Performance**:
   - Faster load times with caching
   - Reduced server load
   - Better user experience on slow networks

4. **Engagement**:
   - Push notifications (when implemented)
   - Full-screen mode
   - Native app feel

5. **Cross-Platform**:
   - Single codebase works on all platforms
   - No separate iOS/Android development needed
   - Automatic updates

### Drawbacks of PWAs

1. **Limited iOS Support**:
   - Some features restricted on iOS/Safari
   - Push notifications not available on iOS
   - Installation less prominent

2. **Hardware Access**:
   - Limited access to device hardware compared to native apps
   - Some sensors and APIs may not be available

3. **App Store Presence**:
   - Not discoverable in app stores (unless manually submitted)
   - Users may prefer downloading from stores

4. **Storage Limitations**:
   - Browser-imposed storage limits
   - Can be cleared by user/system

### PWA vs. Native Apps vs. Traditional Web Apps

| Feature | PWA | Native App | Traditional Web |
|---------|-----|------------|----------------|
| Installation Required | Optional | Required | No |
| Offline Work | ✅ Yes | ✅ Yes | ❌ No |
| App Store | Optional | Required | N/A |
| Update Process | Automatic | Manual | Automatic |
| Development Cost | $ | $$$ | $ |
| Cross-Platform | ✅ Yes | ❌ No | ✅ Yes |
| Hardware Access | ⚠️ Limited | ✅ Full | ❌ Very Limited |
| Performance | ⚠️ Good | ✅ Excellent | ⚠️ Good |

### How PWA Works in This App

1. **Manifest File** (`manifest.webmanifest`):
   ```json
   {
     "name": "SignalR Chat App - PWA Demo",
     "short_name": "Chat PWA",
     "display": "standalone",
     "icons": [...]
   }
   ```

2. **Service Worker** (`sw.js`):
   - Caches application files
   - Serves cached content when offline
   - Handles background sync

3. **Install Prompt**:
   - Detects when the app is installable
   - Shows custom installation UI
   - Handles installation flow

## 🎓 Teaching Points

### For SignalR Discussion:

1. **When to Use SignalR**:
   - Chat applications
   - Live dashboards
   - Real-time notifications
   - Collaborative editing
   - Gaming

2. **Scalability Considerations**:
   - Use Redis backplane for multiple servers
   - Connection management
   - Message queuing

3. **Security**:
   - Authentication/Authorization
   - CORS configuration
   - Input validation

### For PWA Discussion:

1. **When to Build a PWA**:
   - Need offline functionality
   - Want cross-platform reach
   - Limited budget for native apps
   - Frequent updates needed

2. **Best Practices**:
   - Always use HTTPS
   - Optimize for performance
   - Design mobile-first
   - Test offline scenarios

## 🧪 Testing the Application

### Test SignalR Features:
1. Open the app in multiple browser tabs/windows
2. Join chat with different usernames
3. Send messages and observe real-time updates
4. Start typing to see typing indicators
5. Close a tab and watch disconnect notifications
6. Verify automatic reconnection (disable/enable network)

### Test PWA Features:
1. Open DevTools → Application → Manifest (verify manifest)
2. Check Service Workers registration
3. Simulate offline mode and verify cached content
4. Click install prompt and test installed version
5. Test on mobile device for full PWA experience

## 📚 Additional Resources

- [SignalR Documentation](https://docs.microsoft.com/aspnet/core/signalr/)
- [Progressive Web Apps (MDN)](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)
- [WebSocket Protocol](https://datatracker.ietf.org/doc/html/rfc6455)
- [Service Workers API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)

## 🛠️ Customization Ideas

- Add user authentication
- Implement chat rooms/channels
- Add file sharing capability
- Include message persistence (database)
- Add push notifications
- Implement message reactions
- Add video/audio calling

## 📄 License

This project is intended for educational purposes.
