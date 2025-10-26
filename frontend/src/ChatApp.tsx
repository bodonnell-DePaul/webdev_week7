import { useState, useEffect, useRef } from 'react';
import * as signalR from '@microsoft/signalr';
import './ChatApp.css';

interface Message {
  username: string;
  message: string;
  timestamp: Date;
}

export default function ChatApp() {
  const [connection, setConnection] = useState<signalR.HubConnection | null>(null);
  const [username, setUsername] = useState('');
  const [isJoined, setIsJoined] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Create SignalR connection
    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl('http://localhost:5000/chatHub')
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Information)
      .build();

    setConnection(newConnection);
  }, []);

  useEffect(() => {
    if (connection) {
      connection.start()
        .then(() => {
          console.log('Connected to SignalR hub');
          setIsConnected(true);

          // Set up event handlers
          connection.on('ReceiveMessage', (data: Message) => {
            setMessages(prev => [...prev, {
              ...data,
              timestamp: new Date(data.timestamp)
            }]);
          });

          connection.on('UserJoined', (user: string) => {
            setMessages(prev => [...prev, {
              username: 'System',
              message: `${user} joined the chat`,
              timestamp: new Date()
            }]);
          });

          connection.on('UserDisconnected', (user: string) => {
            setMessages(prev => [...prev, {
              username: 'System',
              message: `${user} left the chat`,
              timestamp: new Date()
            }]);
            setOnlineUsers(prev => prev.filter(u => u !== user));
          });

          connection.on('OnlineUsers', (users: string[]) => {
            setOnlineUsers(users);
          });

          connection.on('UserTyping', (user: string, isTyping: boolean) => {
            setTypingUsers(prev => {
              if (isTyping) {
                return [...prev, user];
              } else {
                return prev.filter(u => u !== user);
              }
            });
          });
        })
        .catch(err => {
          console.error('Error connecting to SignalR hub:', err);
          setIsConnected(false);
        });

      connection.onclose(() => {
        setIsConnected(false);
        console.log('Disconnected from SignalR hub');
      });

      connection.onreconnecting(() => {
        setIsConnected(false);
        console.log('Reconnecting to SignalR hub...');
      });

      connection.onreconnected(() => {
        setIsConnected(true);
        console.log('Reconnected to SignalR hub');
      });
    }
  }, [connection]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const joinChat = async () => {
    if (connection && username.trim()) {
      try {
        await connection.invoke('JoinChat', username);
        setIsJoined(true);
      } catch (err) {
        console.error('Error joining chat:', err);
      }
    }
  };

  const sendMessage = async () => {
    if (connection && currentMessage.trim()) {
      try {
        await connection.invoke('SendMessage', currentMessage);
        setCurrentMessage('');
        
        // Stop typing indicator
        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
        }
        await connection.invoke('SendTypingIndicator', false);
      } catch (err) {
        console.error('Error sending message:', err);
      }
    }
  };

  const handleTyping = async () => {
    if (connection) {
      try {
        await connection.invoke('SendTypingIndicator', true);
        
        // Clear existing timeout
        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
        }
        
        // Set timeout to stop typing indicator
        typingTimeoutRef.current = setTimeout(async () => {
          await connection.invoke('SendTypingIndicator', false);
        }, 2000);
      } catch (err) {
        console.error('Error sending typing indicator:', err);
      }
    }
  };

  if (!isJoined) {
    return (
      <div className="join-container">
        <div className="join-card">
          <h1>💬 SignalR Chat</h1>
          <p className="subtitle">Real-time messaging with WebSockets</p>
          <div className="connection-status">
            {isConnected ? (
              <span className="connected">● Connected</span>
            ) : (
              <span className="disconnected">● Disconnected</span>
            )}
          </div>
          <input
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && joinChat()}
            className="username-input"
            disabled={!isConnected}
          />
          <button 
            onClick={joinChat} 
            className="join-button"
            disabled={!isConnected || !username.trim()}
          >
            Join Chat
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-container">
      <div className="chat-sidebar">
        <h3>Online Users ({onlineUsers.length})</h3>
        <ul className="user-list">
          {onlineUsers.map((user, index) => (
            <li key={index} className="user-item">
              <span className="user-status">●</span> {user}
            </li>
          ))}
        </ul>
      </div>
      
      <div className="chat-main">
        <div className="chat-header">
          <h2>💬 Chat Room</h2>
          <div className="connection-status">
            {isConnected ? (
              <span className="connected">● Connected</span>
            ) : (
              <span className="disconnected">● Reconnecting...</span>
            )}
          </div>
        </div>
        
        <div className="messages-container">
          {messages.map((msg, index) => (
            <div 
              key={index} 
              className={`message ${msg.username === 'System' ? 'system-message' : ''} ${msg.username === username ? 'own-message' : ''}`}
            >
              {msg.username !== 'System' && (
                <div className="message-header">
                  <span className="message-username">{msg.username}</span>
                  <span className="message-time">
                    {msg.timestamp.toLocaleTimeString()}
                  </span>
                </div>
              )}
              <div className="message-text">{msg.message}</div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        
        {typingUsers.length > 0 && (
          <div className="typing-indicator">
            {typingUsers.join(', ')} {typingUsers.length === 1 ? 'is' : 'are'} typing...
          </div>
        )}
        
        <div className="message-input-container">
          <input
            type="text"
            placeholder="Type a message..."
            value={currentMessage}
            onChange={(e) => {
              setCurrentMessage(e.target.value);
              handleTyping();
            }}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            className="message-input"
            disabled={!isConnected}
          />
          <button 
            onClick={sendMessage} 
            className="send-button"
            disabled={!isConnected || !currentMessage.trim()}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
