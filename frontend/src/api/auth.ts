import api from './config';

export const login = async (credentials: any) => {
  const response = await api.post('/auth/login', credentials);
  return response.data;
};

export const adminLogin = async (credentials: any) => {
  const response = await api.post('/auth/admin/login', credentials);
  return response.data;
};

export const signupPassenger = async (data: any) => {
  const response = await api.post('/auth/signup/passenger', data);
  return response.data;
};

export const signupDriver = async (data: any) => {
  const response = await api.post('/auth/signup/driver', data);
  return response.data;
};
