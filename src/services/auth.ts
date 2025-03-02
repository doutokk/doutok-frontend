import http from '../utils/http';

interface LoginParams {
  email: string;
  password: string;
}

interface LoginResponse {
  token: string;
  roles: string[];
}

export const setToken = (token: string) => {
  localStorage.setItem('token', token);
};

export const setRoles = (roles: string[]) => {
  localStorage.setItem('roles', JSON.stringify(roles));
};

export const getRoles = (): string[] => {
  const rolesStr = localStorage.getItem('roles');
  return rolesStr ? JSON.parse(rolesStr) : [];
};

export const hasRole = (role: string): boolean => {
  const roles = getRoles();
  return roles.includes(role);
};

export const login = async (params: LoginParams): Promise<LoginResponse> => {
  const response = await http.post(`/user/login`, params).then(res => res.data);
  setToken(response.token);
  setRoles(response.roles);
  return response;
};

interface RegisterParams {
  email: string;
  password: string;
}

export const register = (params: RegisterParams): Promise<void> => {
  return http.post(`/user/register`, params).then(res => res.data);
};
