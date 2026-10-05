import { CurrentUserResponse } from '@/types';
import axios from '../axios';

const getMe = async (): Promise<CurrentUserResponse> => {
  const response = await axios.get<CurrentUserResponse>(`/users/me`);
  return response.data;
};

const logout = async (): Promise<{ message?: string }> => {
  const response = await axios.post<{ message?: string }>(`/users/logout`);
  return response.data;
};

const login = async (credentials: { email: string; password: string }): Promise<CurrentUserResponse> => {
  const response = await axios.post<CurrentUserResponse>(`/users/login`, credentials);
  return response.data;
};

export const users = {
  getMe,
  logout,
  login,
};

export default users;
