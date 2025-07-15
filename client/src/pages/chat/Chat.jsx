import React, { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { IoSearchOutline, IoPersonAddOutline, IoNotificationsOutline } from "react-icons/io5";
import Sidebar from "./Sidebar";
import ChatSection from "./ChatSection";
import UserSearchModal from "./UserSearchModal";
import FriendRequestModal from "./FriendRequestNotification";
import { io } from "socket.io-client";
import { useDispatch, useSelector } from "react-redux";
import { fetchFriends, fetchMessages, setCurrentChat } from "../../redux/slices/chatSlice";

function Chat() {
    const [socket, setSocket] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
    const [showUserSearch, setShowUserSearch] = useState(false);
    const [showFriendRequests, setShowFriendRequests] = useState(false);
    const messagesEndRef = useRef(null);
    const dispatch = useDispatch();
    
    const {
        friends: users,
        messages: chatMessages,
        currentChat,
        friendRequests,
        loading,
        error
    } = useSelector((state) => state.chat);
    
    // Debounce search term
    useEffect(() => {
        const timerId = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
        }, 300);
        
        return () => {
            clearTimeout(timerId);
        };
    }, [searchTerm]);
    
    // Filter users with memoization
    const filteredUsers = useMemo(() => {
        if (!Array.isArray(users)) return [];
        return users.filter(user =>
            user.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
        );
    }, [users, debouncedSearchTerm]);
    
    // Memoized callbacks
    const selectUser = useCallback(async (user) => {
        dispatch(setCurrentChat(user));
    }, [dispatch]);
    
    const getStatusColor = useCallback((status) => {
        switch (status) {
            case 'online': return 'bg-green-500';
            case 'away': return 'bg-yellow-500';
            case 'offline': return 'bg-gray-400';
            default: return 'bg-gray-400';
        }
    }, []);
    
    const sendMessage = useCallback((e) => {
        e.preventDefault();
        if (newMessage.trim() && currentChat && socket) {
            const messageData = {
                to: currentChat.id,
                content: newMessage
            };
            
            console.log('Sending message:', messageData);
            socket.emit('send_message', messageData);
            
            // Add optimistic update (temporary message)
            const tempMessage = {
                id: `temp-${Date.now()}`, // Temporary ID
                receiverId: currentChat.id,
                senderId: 'me', // Or get from auth state
                content: newMessage,
                timestamp: new Date().toISOString(),
                isOptimistic: true, // Flag to identify optimistic updates
            };
            
            setMessages(prev => [...prev, tempMessage]);
            setNewMessage('');
        }
    }, [newMessage, currentChat, socket]);
    
    // Socket and data fetching effects
    useEffect(() => {
        dispatch(fetchFriends());
        
        const newSocket = io('http://localhost:5000', {
            withCredentials: true
        });
        
        newSocket.on('connect', () => {
            console.log('Connected to server');
        });
        
        newSocket.on('disconnect', () => {
            console.log('Disconnected from server');
        });
        
        // Listen for incoming messages
        newSocket.on('receive_message', (message) => {
            console.log('Received message:', message);
            // Only add to messages if it's for the current chat
            if (currentChat && message.from === currentChat.id) {
                setMessages(prev => [...prev, message]);
            }
        });
        
        // Listen for sent message confirmations
        newSocket.on('message_sent', (message) => {
            console.log('Message sent confirmation:', message);
            // Update the local message with server data
            setMessages(prev => 
                prev.map(msg => 
                    msg.id === message.id || 
                    (msg.timestamp === message.timestamp && msg.content === message.content)
                        ? { ...msg, id: message.id, timestamp: message.timestamp }
                        : msg
                )
            );
        });
        
        setSocket(newSocket);
        
        return () => {
            newSocket.close();
        };
    }, [dispatch]); // Removed currentChat dependency to prevent reconnections
    
    // Update messages when receiving new ones for current chat
    useEffect(() => {
        if (socket && currentChat) {
            const handleReceiveMessage = (message) => {
                console.log('Received message for current chat:', message);
                if (message.from === currentChat.id) {
                    setMessages(prev => [...prev, message]);
                }
            };
            
            // Remove old listener and add new one
            socket.off('receive_message');
            socket.on('receive_message', handleReceiveMessage);
            
            return () => {
                socket.off('receive_message', handleReceiveMessage);
            };
        }
    }, [socket, currentChat]);
    
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        if (currentChat) {
            dispatch(fetchMessages(currentChat.id));
        }
    }, [currentChat, dispatch]);
    
    useEffect(() => {
        if (chatMessages) {
            setMessages(chatMessages);
        }
    }, [chatMessages]);
    
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };
    
    return (
        <div className="h-screen bg-gray-100 flex">
            <Sidebar 
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                users={filteredUsers}
                currentChat={currentChat}
                selectUser={selectUser}
                getStatusColor={getStatusColor}
                friendRequests={friendRequests}
                setShowFriendRequests={setShowFriendRequests}
                setShowUserSearch={setShowUserSearch}
                messages={messages}
            />
            
            <ChatSection
                messages={messages}
                newMessage={newMessage}
                setNewMessage={setNewMessage}
                sendMessage={sendMessage}
                currentChat={currentChat}
                messagesEndRef={messagesEndRef}
                getStatusColor={getStatusColor}
            />
            
            <UserSearchModal 
                isOpen={showUserSearch}
                onClose={() => setShowUserSearch(false)}
                currentUserId={1}
            />
            
            <FriendRequestModal 
                isOpen={showFriendRequests}
                onClose={() => setShowFriendRequests(false)}
            />
        </div>
    );
}

export default React.memo(Chat);