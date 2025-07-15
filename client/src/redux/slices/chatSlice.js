// chatSlice.js
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { Api } from '../../services/api';

// Fetch friends with friendship status
export const fetchFriends = createAsyncThunk(
  'chat/fetchFriends',
  async (_, { rejectWithValue }) => {
    try {
      const response = await Api.getFriends();
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch friends');
    }
  }
);

// Send friend request
export const sendFriendRequest = createAsyncThunk(
  'chat/sendFriendRequest',
  async (receiverId, { rejectWithValue }) => {
    try {
      const response = await Api.sendFriendRequest(receiverId);
      return { receiverId, request: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to send friend request');
    }
  }
);

// Fetch friend requests
export const fetchFriendRequests = createAsyncThunk(
  'chat/fetchFriendRequests',
  async (_, { rejectWithValue }) => {
    try {
      const response = await Api.getFriendRequests();
      console.log("Friend requests response:", response);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch friend requests');
    }
  }
);

// Accept friend request
export const acceptFriendRequest = createAsyncThunk(    
  'chat/acceptFriendRequest',
  async (requestId, { rejectWithValue }) => {
    try {
      const response = await Api.acceptFriendRequest(requestId);
      return { requestId, status: response.data.status };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to accept friend request'); 
    }
  }
);

// Reject friend request
export const rejectFriendRequest = createAsyncThunk(    
  'chat/rejectFriendRequest',
  async (requestId, { rejectWithValue }) => {
    try {
      const response = await Api.rejectFriendRequest(requestId);  
      return { requestId, status: response.data.status };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to reject friend request');
    }
  } 
);

// Fetch messages
export const fetchMessages = createAsyncThunk(
  'chat/fetchMessages',
  async (otherUserId, { rejectWithValue }) => {
    try {
      const response = await Api.getMessages(otherUserId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch messages');
    }
  }
);

const initialState = {
  friends: [],
  currentChat: null,
  messages: [],
  friendRequests: [],
  loading: false,
  error: null,
  messagesLoading: false,
  friendRequestStatus: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  friendRequestsLoading: false,
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setCurrentChat: (state, action) => {
      state.currentChat = action.payload;
    },
    addLocalMessage: (state, action) => {
      state.messages.push(action.payload);
    },
    clearChatState: (state) => {
      state.messages = [];
      state.currentChat = null;
    },
    updateFriendStatus: (state, action) => {
      const { userId, status } = action.payload;
      const friend = state.friends.find(f => f.id === userId);
      if (friend) {
        friend.status = status;
        friend.isFriend = status === 'accepted';
        friend.isPending = status === 'pending';
      }
    },
    removeFriendRequest: (state, action) => {
      state.friendRequests = state.friendRequests.filter(req => req.id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Friends
      .addCase(fetchFriends.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFriends.fulfilled, (state, action) => {
        state.loading = false;
        state.friends = action.payload;
      })
      .addCase(fetchFriends.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Send Friend Request
      .addCase(sendFriendRequest.pending, (state) => {
        state.friendRequestStatus = 'loading';
      })
      .addCase(sendFriendRequest.fulfilled, (state, action) => {
        state.friendRequestStatus = 'succeeded';
        const { receiverId, request } = action.payload;
        const friend = state.friends.find(f => f.id === receiverId);
        if (friend) {
          friend.status = 'pending';
          friend.isPending = true;
        }
      })
      .addCase(sendFriendRequest.rejected, (state, action) => {
        state.friendRequestStatus = 'failed';
        state.error = action.payload;
      })

      // Fetch Friend Requests
      .addCase(fetchFriendRequests.pending, (state) => {
        state.friendRequestsLoading = true;
        state.error = null;
      })
      .addCase(fetchFriendRequests.fulfilled, (state, action) => {
        state.friendRequestsLoading = false;
        state.friendRequests = action.payload;
      })
      .addCase(fetchFriendRequests.rejected, (state, action) => {
        state.friendRequestsLoading = false;
        state.error = action.payload;
      })

      // Accept Friend Request
      .addCase(acceptFriendRequest.pending, (state) => {
        state.friendRequestStatus = 'loading';
      })
      .addCase(acceptFriendRequest.fulfilled, (state, action) => {
        state.friendRequestStatus = 'succeeded';
        const { requestId } = action.payload;
        // Remove from friend requests and add to friends
        state.friendRequests = state.friendRequests.filter(req => req.id !== requestId);
        // Refresh friends list after accepting
      })
      .addCase(acceptFriendRequest.rejected, (state, action) => {
        state.friendRequestStatus = 'failed';
        state.error = action.payload;
      })

      // Reject Friend Request
      .addCase(rejectFriendRequest.pending, (state) => {  
        state.friendRequestStatus = 'loading';
      })
      .addCase(rejectFriendRequest.fulfilled, (state, action) => {
        state.friendRequestStatus = 'succeeded';
        const { requestId } = action.payload;
        // Remove from friend requests
        state.friendRequests = state.friendRequests.filter(req => req.id !== requestId);
      })
      .addCase(rejectFriendRequest.rejected, (state, action) => {
        state.friendRequestStatus = 'failed';
        state.error = action.payload;
      })

      // Fetch Messages
      .addCase(fetchMessages.pending, (state) => {
        state.messagesLoading = true;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.messages = action.payload;
        state.messagesLoading = false;
      })
      .addCase(fetchMessages.rejected, (state) => {
        state.messagesLoading = false;
      });
  },
});

export const { 
  setCurrentChat, 
  addLocalMessage, 
  clearChatState,
  updateFriendStatus,
  removeFriendRequest 
} = chatSlice.actions;

export default chatSlice.reducer;