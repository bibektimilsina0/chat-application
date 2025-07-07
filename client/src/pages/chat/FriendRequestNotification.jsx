import { useState, useEffect } from 'react';
import { IoPersonAddOutline, IoCheckmarkCircleOutline, IoCloseCircleOutline, IoClose, IoNotificationsOutline } from 'react-icons/io5';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFriendRequests, acceptFriendRequest, rejectFriendRequest, fetchFriends} from '../../redux/slices/chatSlice';
import toast from 'react-hot-toast';

const FriendRequestModal = ({ isOpen, onClose }) => {
    const dispatch = useDispatch();
    const { friendRequests, friendRequestsLoading, friendRequestStatus } = useSelector((state) => state.chat);
    console.log("inside FriendRequestModal component");
    // Fetch friend requests when modal opens
    useEffect(() => {
        if (isOpen) {
            dispatch(fetchFriendRequests());
        }
    }, [isOpen, dispatch]);

    const handleAcceptRequest = async (requestId) => {
        try {
            await dispatch(acceptFriendRequest(requestId)).unwrap();
            toast.success('Friend request accepted successfully');
            console.log('Friend request accepted successfully');
            // Refresh friends list after accepting
            dispatch(fetchFriends());
        } catch (error) {
            toast.error(error.message || 'Failed to accept friend request');
            console.error('Failed to accept friend request:', error);
        }
    };

    const handleRejectRequest = async (requestId) => {
        try {
            await dispatch(rejectFriendRequest(requestId)).unwrap();
            toast.success('Friend request rejected successfully');
            console.log('Friend request rejected successfully');
        } catch (error) {
            toast.error(error.message || 'Failed to reject friend request');
            console.error('Failed to reject friend request:', error);
        }
    };

    const formatTimeAgo = (timestamp) => {
        const now = new Date();
        const time = new Date(timestamp);
        const diffInSeconds = Math.floor((now - time) / 1000);
        
        if (diffInSeconds < 60) {
            return 'Just now';
        } else if (diffInSeconds < 3600) {
            const minutes = Math.floor(diffInSeconds / 60);
            return `${minutes}m ago`;
        } else if (diffInSeconds < 86400) {
            const hours = Math.floor(diffInSeconds / 3600);
            return `${hours}h ago`;
        } else {
            const days = Math.floor(diffInSeconds / 86400);
            return `${days}d ago`;
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 max-h-[80vh] flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-800">
                        Friend Requests
                        {friendRequests.length > 0 && (
                            <span className="ml-2 bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded-full">
                                {friendRequests.length}
                            </span>
                        )}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <IoClose className="h-5 w-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-4">
                    {friendRequestsLoading ? (
                        <div className="text-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                            <p className="text-gray-500 mt-2">Loading friend requests...</p>
                        </div>
                    ) : friendRequests.length === 0 ? (
                        <div className="text-center py-8">
                            <IoPersonAddOutline className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                            <p className="text-gray-500 mb-2">No friend requests</p>
                            <p className="text-sm text-gray-400">When someone sends you a friend request, it will appear here.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {friendRequests.map((request) => (
                                console.log("Request:", request),
                                <div key={request.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                                    <div className="flex items-center space-x-3 mb-3">
                                        <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                                            {request.senderName?.charAt(0)?.toUpperCase() || 'U'}
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-gray-900">
                                                {request.senderName || 'Unknown User'}
                                            </h3>
                                            <p className="text-sm text-gray-600">
                                                {request.senderEmail ||  ''}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {formatTimeAgo(request.CreatedAt)}
                                            </p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => handleAcceptRequest(request.id)}
                                            disabled={friendRequestStatus === 'loading'}
                                            className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-green-500 text-white text-sm rounded-lg hover:bg-green-600 disabled:bg-green-300 transition-colors"
                                        >
                                            <IoCheckmarkCircleOutline className="h-4 w-4" />
                                            <span>Accept</span>
                                        </button>
                                        <button
                                            onClick={() => handleRejectRequest(request.id)}
                                            disabled={friendRequestStatus === 'loading'}
                                            className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-gray-500 text-white text-sm rounded-lg hover:bg-gray-600 disabled:bg-gray-300 transition-colors"
                                        >
                                            <IoCloseCircleOutline className="h-4 w-4" />
                                            <span>Decline</span>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FriendRequestModal;