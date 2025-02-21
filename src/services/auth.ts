import http from '../utils/http';

interface LoginParams {
  email: string;
  password: string;
}

interface LoginResponse {
  token: string;
}

export const login = (params: LoginParams): Promise<LoginResponse> => {
  return http.post(`/login`, params).then(res => res.data);
};

interface RegisterParams {
  email: string;
  password: string;
}

export const register = (params: RegisterParams): Promise<void> => {
  return http.post(`/register`, params).then(res => res.data);
};
