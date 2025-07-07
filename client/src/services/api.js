// src/api/authApi.js
import axios from 'axios';
import { sendFriendRequest } from '../redux/slices/chatSlice';

const API = axios.create({
  baseURL: 'http://localhost:5000', // your backend URL
  withCredentials: true, // send cookies
});

export const Api = {
    //auth related APIs
  register: (data) => API.post('/auth/register', data),
  login: (data) => API.post('/auth/login', data),
  getProfile: () => API.get('/user/profile'),
  logout: () => API.get('/auth/logout'),
  checkAuth: () => API.get('/auth/check'),
  
  //chat related APIs
    getFriends: () => API.get('/friend'),
  getMessages: (otherUserId) => API.get(`/chat/messages/${otherUserId}`),
  sendFriendRequest: (receiverId) => API.post(`/friend/send/${receiverId}`,),
  getFriendRequests: () => API.get('/friend/requests'),
  acceptFriendRequest: (requestId) => API.post(`/friend/accept/${requestId}`),
  rejectFriendRequest: (requestId) => API.post(`/friend/reject/${requestId}`),

  //search user
  searchUsers: (query) => API.get(`/user/search?query=${query}`),

};
