import React from 'react';

function UserCard({ user, selectUser, currentChat, getStatusColor, messages }) {
  const getInitials = (name = "") =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();

  // Get the last message for this user
  const getLastMessage = () => {
    if (!messages || messages.length === 0) return null;
    
    // Filter messages for this conversation
    const userMessages = messages.filter(
      msg => msg.senderId === user.id || msg.receiverId === user.id
    );
    
    if (userMessages.length === 0) return null;
    
    // Sort by timestamp and get the most recent
    const sortedMessages = [...userMessages].sort((a, b) => 
      new Date(b.timestamp) - new Date(a.timestamp)
    );
    
    return sortedMessages[0];
  };

  const lastMessage = getLastMessage();
  const isActiveChat = currentChat?.id === user.id;

  return (
    <div
      onClick={() => selectUser(user)}
      className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
        isActiveChat ? 'bg-blue-200 border-l-4 border-blue-500' : ''
      }`}
    >
      <div className="flex items-center space-x-3">
        <div className="relative">
          <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
            {getInitials(user?.name || "U")}
          </div>
          <div className={`absolute bottom-0 right-0 w-3 h-3 ${
            getStatusColor(user.status || 'offline')
          } rounded-full border-2 border-white`}></div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start">
            <h3 className="font-medium text-gray-900 truncate">{user.name}</h3>
            {lastMessage && (
              <span className="text-xs text-gray-500">
                {new Date(lastMessage.timestamp).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            )}
          </div>
          <p className="text-sm text-gray-600 truncate">
            {lastMessage?.content || "No messages yet"}
          </p>
        </div>
      </div>
    </div>
  );
}

export default React.memo(UserCard);