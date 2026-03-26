import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import chatbotApi from '../../api/chatbotApi';

export const sendChatMessage = createAsyncThunk('chat/sendMessage', async (data, { rejectWithValue }) => {
  try {
    return await chatbotApi.sendMessage(data);
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    messages: [],
    sessionId: null,
    isOpen: false,
    loading: false,
  },
  reducers: {
    toggleChat: (state) => { state.isOpen = !state.isOpen; },
    openChat: (state) => { state.isOpen = true; },
    closeChat: (state) => { state.isOpen = false; },
    addUserMessage: (state, action) => {
      state.messages.push({ role: 'user', content: action.payload, timestamp: new Date().toISOString() });
    },
    clearChat: (state) => { state.messages = []; state.sessionId = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendChatMessage.pending, (state) => { state.loading = true; })
      .addCase(sendChatMessage.fulfilled, (state, action) => {
        state.loading = false;
        state.sessionId = action.payload.sessionId;
        state.messages.push({ role: 'assistant', content: action.payload.message, timestamp: new Date().toISOString() });
      })
      .addCase(sendChatMessage.rejected, (state) => {
        state.loading = false;
        state.messages.push({ role: 'assistant', content: 'Sorry, I\'m having trouble responding. Please try again.', timestamp: new Date().toISOString() });
      });
  },
});

export const { toggleChat, openChat, closeChat, addUserMessage, clearChat } = chatSlice.actions;
export default chatSlice.reducer;