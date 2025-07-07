
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { Api } from '../../services/api';

export const searchUsers = createAsyncThunk(
  'search/users',
  async (query, {rejectWithValue }) => {
    try {
      const response = await Api.searchUsers(query);
      console.log("Search response:", query,response);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Search failed');
    }
  }
);

const initialState = {
  results: [],
  loading: false,
  error: null,
  query: ''
};

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    clearSearchResults: (state) => {
      state.results = [];
      state.query = '';
    },
    updateSearchQuery: (state, action) => {
      state.query = action.payload;
    },
    updateSearchResults: (state, action) => {
    state.results = action.payload;
  }
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.results = action.payload;
      })
      .addCase(searchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearSearchResults, updateSearchQuery,updateSearchResults } = searchSlice.actions;
export default searchSlice.reducer;