// src/api.ts
import axios, { AxiosInstance } from 'axios';

// 기본 Axios 인스턴스 설정
const api: AxiosInstance = axios.create({
  baseURL: 'http://localhost:3000', // Flask 서버 URL로 변경
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // CORS 요청 시 쿠키와 인증 정보를 포함
});

// 사용자 관련 API
export const login = async (key: string) => {
  try {
    const response = await api.post('/login', { key });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const logout = async () => {
  try {
    const response = await api.get('/logout');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createUser = async (key: string) => {
  try {
    const response = await api.post('/user', { key });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateUser = async (userId: number, key: string) => {
  try {
    const response = await api.put(`/user/${userId}`, { key });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 캐릭터 관련 API
export const createCharacter = async (characterData: {
  charJob: string;
  charName: string;
  charClass: string;
  charLevel: number;
}) => {
  try {
    const response = await api.post('/character', characterData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getCharacter = async (charId: number) => {
  try {
    const response = await api.get(`/character/${charId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateCharacter = async (charId: number, characterData: Partial<{
  charJob: string;
  charName: string;
  charClass: string;
  charLevel: number;
}>) => {
  try {
    const response = await api.put(`/character/${charId}`, characterData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 레이드 관련 API
export const createRaid = async (raidData: {
  raidName: string;
  raidType: string;
  raidTime: string;
}) => {
  try {
    const response = await api.post('/raid', raidData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getRaid = async (raidId: number) => {
  try {
    const response = await api.get(`/raid/${raidId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateRaid = async (raidId: number, raidData: Partial<{
  raidName: string;
  raidType: string;
  raidTime: string;
}>) => {
  try {
    const response = await api.put(`/raid/${raidId}`, raidData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteRaid = async (raidId: number) => {
  try {
    const response = await api.delete(`/raid/${raidId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default api;