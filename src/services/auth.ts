import http from '../utils/http';

interface LoginParams {
  email: string;
  password: string;
}

interface LoginResponse {
  token: string;
}

export const setToken = (token: string) => {
  localStorage.setItem('token', token);
};

export const login = async (params: LoginParams): Promise<LoginResponse> => {
  const response = await http.post(`/user/login`, params).then(res => res.data);
  setToken(response.token);
  return response;
};

interface RegisterParams {
  email: string;
  password: string;
}

export const register = (params: RegisterParams): Promise<void> => {
  return http.post(`/user/register`, params).then(res => res.data);
};
