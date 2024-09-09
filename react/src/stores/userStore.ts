// src/stores/userStore.ts

import create from 'zustand';

interface UserState {
  userKey: string;
  userId: number;
  setUser: (key: string, id: number) => void;
}

export const useUserStore = create<UserState>((set) => ({
  userKey: 'tester',
  userId: 0,  // 임의의 ID 값
  setUser: (key, id) => set({ userKey: key, userId: id }),
}));