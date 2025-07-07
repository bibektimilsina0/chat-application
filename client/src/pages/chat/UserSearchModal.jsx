import React, { useState, useEffect } from 'react';
import {
  IoSearchOutline,
  IoCloseOutline,
  IoPersonAddOutline,
  IoChatbubbleOutline,
  IoCheckmarkCircleOutline,
  IoPersonOutline
} from 'react-icons/io5';
import { useDispatch, useSelector } from 'react-redux';
import { searchUsers, clearSearchResults, updateSearchQuery, updateSearchResults } from '../../redux/slices/searchUserSlice';
import { sendFriendRequest, setCurrentChat } from "../../redux/slices/chatSlice";
const UserSearchModal = ({ isOpen, onClose, currentUserId }) => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [localQuery, setLocalQuery] = useState(''); // Add local state for immediate UI response
  const dispatch = useDispatch();
  const { results, loading, error, query } = useSelector((state) => state.search);
    console.log("inside user search modal");
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setLocalQuery(value); // Update local state immediately
    dispatch(updateSearchQuery(value)); // Update Redux state

    if (value.length > 2) {
        console.log('Searching for:', value);
      dispatch(searchUsers(value));
    } else {
      dispatch(clearSearchResults());
    }
  };

  // Reset local query when modal closes
  useEffect(() => {
    if (!isOpen) {
      setLocalQuery('');
      dispatch(clearSearchResults());
    }
  }, [isOpen, dispatch]);

  const sendFriendReq = async (userId) => {
    try {

      dispatch(sendFriendRequest(userId));
      
      // Optimistic update
      dispatch(updateSearchResults(
        results.map(user => 
          user.id === userId 
            ? { ...user, friendRequestSent: true }
            : user
        )
      ));
      console.log('Friend request sent to user:', userId);
    } catch (error) {
      console.error('Error sending friend request:', error);
    }
  };

  const startChat = (user) => {
    console.log('Starting chat with:', user);
    
    // Set the current chat in Redux
    dispatch(setCurrentChat(user));
    
    // Close the modal
    onClose();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'away': return 'bg-yellow-500';
      case 'offline': return 'bg-gray-400';
      default: return 'bg-gray-400';
    }
  };

  const showUserProfile = (user) => {
    setSelectedUser(user);
  };

  const closeProfile = () => {
    setSelectedUser(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl mx-4 h-[80vh] flex flex-col">
        {!selectedUser ? (
          <>
            {/* Header */}
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-800">Find People</h2>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <IoCloseOutline className="h-6 w-6 text-gray-600" />
              </button>
            </div>

            {/* Search Input */}
            <div className="p-4 border-b border-gray-200">
              <div className="relative">
                <IoSearchOutline className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search by name or username..."
                  value={localQuery}
                  onChange={handleSearchChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  autoFocus
                />
              </div>
            </div>

            {/* Search Results */}
            <div className="flex-1 overflow-y-auto p-4">
              {loading ? (
                <div className="flex items-center justify-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                </div>
              ) : error ? (
                <div className="text-center py-8 text-red-500">
                  Error: {error}
                </div>
              ) : results.length > 0 ? (
                <div className="space-y-3">
                  {results.map((user) => (
                    <div key={user.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="relative">
                            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                              {user.avatar || user.name.charAt(0)}
                            </div>
                            <div className={`absolute bottom-0 right-0 w-3 h-3 ${getStatusColor(user.status)} rounded-full border-2 border-white`}></div>
                          </div>
                          <div 
                            className="flex-1 cursor-pointer"
                            onClick={() => showUserProfile(user)}
                          >
                            <h3 className="font-medium text-gray-900">{user.name}</h3>
                            <p className="text-sm text-gray-600">@{user.username}</p>
                            <p className="text-xs text-gray-500 mt-1 capitalize">{user.status}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          {user.isFriend ? (
                            <button
                              onClick={() => startChat(user)}
                              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
                            >
                              <IoChatbubbleOutline className="h-4 w-4" />
                              <span>Message</span>
                            </button>
                          ) : user.friendRequestSent ? (
                            <button
                              disabled
                              className="bg-gray-300 text-gray-600 px-4 py-2 rounded-lg font-medium cursor-not-allowed flex items-center space-x-2"
                            >
                              <IoCheckmarkCircleOutline className="h-4 w-4" />
                              <span>Sent</span>
                            </button>
                          ) : (
                            <button
                              onClick={() => sendFriendReq(user.id)}
                              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
                            >
                              <IoPersonAddOutline className="h-4 w-4" />
                              <span>Add Friend</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : localQuery.length > 2 ? (
                <div className="text-center py-8">
                  <IoPersonOutline className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No users found for "{localQuery}"</p>
                </div>
              ) : (
                <div className="text-center py-8">
                  <IoSearchOutline className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Type at least 3 characters to search for people</p>
                </div>
              )}
            </div>
          </>
        ) : (
          <UserProfileView 
            user={selectedUser} 
            onClose={closeProfile} 
            onSendFriendRequest={sendFriendReq}
            onStartChat={startChat}
          />
        )}
      </div>
    </div>
  );
};

const UserProfileView = ({ user, onClose, onSendFriendRequest, onStartChat }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'away': return 'bg-yellow-500';
      case 'offline': return 'bg-gray-400';
      default: return 'bg-gray-400';
    }
  };

  return (
    <>
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-800">Profile</h2>
        <button 
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <IoCloseOutline className="h-6 w-6 text-gray-600" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="text-center mb-6">
          <div className="relative inline-block">
            <div className="w-24 h-24 bg-blue-500 rounded-full flex items-center justify-center text-white text-3xl font-semibold mx-auto mb-4">
              {user.avatar || user.name.charAt(0)}
            </div>
            <div className={`absolute bottom-4 right-0 w-6 h-6 ${getStatusColor(user.status)} rounded-full border-4 border-white`}></div>
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-1">{user.name}</h1>
          <p className="text-gray-600 mb-2">@{user.username}</p>
          <p className="text-sm text-gray-500 capitalize">{user.status}</p>
        </div>

        {user.bio && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">About</h3>
            <p className="text-gray-700">{user.bio}</p>
          </div>
        )}

        <div className="flex flex-col space-y-3">
          {user.isFriend ? (
            <button
              onClick={() => onStartChat(user)}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
            >
              <IoChatbubbleOutline className="h-5 w-5" />
              <span>Send Message</span>
            </button>
          ) : user.friendRequestSent ? (
            <button
              disabled
              className="w-full bg-gray-300 text-gray-600 py-3 rounded-lg font-medium cursor-not-allowed flex items-center justify-center space-x-2"
            >
              <IoCheckmarkCircleOutline className="h-5 w-5" />
              <span>Friend Request Sent</span>
            </button>
          ) : (
            <button
              onClick={() => onSendFriendRequest(user.id)}
              className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
            >
              <IoPersonAddOutline className="h-5 w-5" />
              <span>Send Friend Request</span>
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default UserSearchModal;