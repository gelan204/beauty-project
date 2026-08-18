import { configureStore, createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '@elaris/shared-ui';

export const fetchMe = createAsyncThunk('auth/me', async () => (await api.get('/auth/me')).data.data.user);
export const login = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/auth/login', credentials);
    if (data.data.user.role !== 'admin') throw new Error('Admin access only');
    return data.data.user;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || err.message);
  }
});
export const logout = createAsyncThunk('auth/logout', async () => { await api.post('/auth/logout'); });

const authSlice = createSlice({
  name: 'auth',
  initialState: { user: null, loading: true, error: null },
  reducers: { clearError: (s) => { s.error = null; } },
  extraReducers: (b) => {
    b.addCase(fetchMe.pending, (s) => { s.loading = true; })
      .addCase(fetchMe.fulfilled, (s, a) => { s.loading = false; s.user = a.payload; })
      .addCase(fetchMe.rejected, (s) => { s.loading = false; s.user = null; })
      .addCase(login.fulfilled, (s, a) => { s.user = a.payload; })
      .addCase(login.rejected, (s, a) => { s.error = a.payload; })
      .addCase(logout.fulfilled, (s) => { s.user = null; });
  },
});
export const { clearError } = authSlice.actions;
export const store = configureStore({ reducer: { auth: authSlice.reducer } });
