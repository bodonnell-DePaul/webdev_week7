using Microsoft.AspNetCore.SignalR;

namespace ChatApi.Hubs;

public class ChatHub : Hub
{
    // Store connected users (in production, use a distributed cache like Redis)
    private static readonly Dictionary<string, string> ConnectedUsers = new();

    public override async Task OnConnectedAsync()
    {
        await base.OnConnectedAsync();
        
        // Notify all clients that someone connected
        await Clients.All.SendAsync("UserConnected", Context.ConnectionId);
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        if (ConnectedUsers.ContainsKey(Context.ConnectionId))
        {
            var username = ConnectedUsers[Context.ConnectionId];
            ConnectedUsers.Remove(Context.ConnectionId);
            
            // Notify all clients that someone disconnected
            await Clients.All.SendAsync("UserDisconnected", username);
        }
        
        await base.OnDisconnectedAsync(exception);
    }

    public async Task JoinChat(string username)
    {
        ConnectedUsers[Context.ConnectionId] = username;
        
        // Notify all clients that a user joined
        await Clients.All.SendAsync("UserJoined", username);
        
        // Send the list of online users to the newly joined user
        var onlineUsers = ConnectedUsers.Values.ToList();
        await Clients.Caller.SendAsync("OnlineUsers", onlineUsers);
    }

    public async Task SendMessage(string message)
    {
        if (ConnectedUsers.TryGetValue(Context.ConnectionId, out var username))
        {
            var messageData = new
            {
                Username = username,
                Message = message,
                Timestamp = DateTime.UtcNow
            };
            
            // Broadcast message to all clients
            await Clients.All.SendAsync("ReceiveMessage", messageData);
        }
    }

    public async Task SendTypingIndicator(bool isTyping)
    {
        if (ConnectedUsers.TryGetValue(Context.ConnectionId, out var username))
        {
            // Notify all clients except the sender
            await Clients.Others.SendAsync("UserTyping", username, isTyping);
        }
    }
}
