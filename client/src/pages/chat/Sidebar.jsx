
// Create a new Sidebar.jsx component
import React, { useMemo } from 'react';
import { IoNotificationsOutline, IoPersonAddOutline, IoSearchOutline } from 'react-icons/io5';
import { useSelector } from 'react-redux';
import UserCard from './UserCard';
import Profile from './Profile'; 

function Sidebar({ searchTerm, setSearchTerm, users, currentChat, selectUser, getStatusColor,setShowFriendRequests,setShowUserSearch,messages }) {
    const filteredUsers = useMemo(() => {
        return users.filter(user =>
            user.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [users, searchTerm]);
    const {
        friendRequests,
    } = useSelector((state) => state.chat);
    return (
        <div className="h-screen border relative">
            {/* Search and controls */}
            <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between mb-3">
                    <h2 className="text-xl font-semibold text-gray-800">Messages</h2>
                    <div className="flex items-center space-x-2">
                        <button
                            onClick={() => setShowFriendRequests(true)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors relative"
                            title="Friend Requests"
                        >
                            <IoNotificationsOutline className="h-5 w-5" />
                            {friendRequests && friendRequests.length > 0 && (
                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                    {friendRequests.length}
                                </span>
                            )}
                        </button>
                        <button
                            onClick={() => setShowUserSearch(true)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Find People"
                        >
                            <IoPersonAddOutline className="h-5 w-5" />
                        </button>
                    </div>
                </div>
                <div className="relative">
                    <IoSearchOutline className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input
                        type="text"
                        placeholder="Search conversations..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
            </div>

            {/* User list */}
            <div className="flex-1 overflow-y-auto">
                {filteredUsers.map((user) => (
                    <UserCard
                        key={user.id}
                        user={user}
                        selectUser={selectUser}
                        currentChat={currentChat}
                        getStatusColor={getStatusColor}
                        messages={messages}
                    />
                ))}
            </div>

            {/* Profile */}
            <div className="absolute bottom-0 left-0 right-0 p-2 bg-white border-gray-200s">
                <Profile />
            </div>
        </div>
    );
}
export default React.memo(Sidebar);