// src/stores/userStore.ts

import create from 'zustand';

interface UserState {
  userId: string;
  setUser: (id: string) => void;
}

export const useUserStore = create<UserState>((set) => ({
  userId: 'tester',  // 기본값으로 'tester' 설정
  setUser: (id) => set({ userId: id }),
}));