import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import chatReducer from "./slices/chatSlice";
import searchReducer from "./slices/searchUserSlice";
// import cmsReducer from "./slices/cmsSlice";
// import layoutReducer from "./slices/layoutSlice"

const store= configureStore({
    reducer: {  
    auth: authReducer,
    // cms: cmsReducer,
    chat: chatReducer,
    search: searchReducer,
    // layout: layoutReducer,
    },      
});
export default store;