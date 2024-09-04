// src\store\memberSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Member {
  id: number;
  username: string;
}

interface MemberState {
  currentMember: Member | null;
  isAuthenticated: boolean;
}

const initialState: MemberState = {
  currentMember: null,
  isAuthenticated: false,
};

const memberSlice = createSlice({
  name: 'member',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<Member>) => {
      state.currentMember = action.payload;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.currentMember = null;
      state.isAuthenticated = false;
    },
  },
});

export const { login, logout } = memberSlice.actions;
export default memberSlice.reducer;