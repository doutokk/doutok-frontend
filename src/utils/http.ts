import axios from 'axios';
import { API_BASE_URL } from '../config/api';

const http = axios.create({
  baseURL: API_BASE_URL
});

http.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    // config.headers.Authorization = `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjo3LCJpc3MiOiJEb3VUb2siLCJleHAiOjE3NDAyMDg0NzcsImlhdCI6MTc0MDEyMjA3N30.Hwvu6uSvZJOha-wISQ795-a891qOVyBjN4CP6C6lexg`;
  }
  return config;
});

export default http;