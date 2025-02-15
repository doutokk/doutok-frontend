import axios from 'axios';
import { API_BASE_URL } from '../config/api';

interface LoginParams {
  email: string;
  password: string;
}

interface LoginResponse {
  token: string;
}

export const login = (params: LoginParams): Promise<LoginResponse> => {
  return axios.post(`${API_BASE_URL}/login`, params).then(res => res.data);
};

interface RegisterParams {
  email: string;
  password: string;
}

export const register = (params: RegisterParams): Promise<void> => {
  return axios.post(`${API_BASE_URL}/register`, params).then(res => res.data);
};
