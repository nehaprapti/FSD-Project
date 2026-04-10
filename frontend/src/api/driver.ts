import axios from './config';

export const getProfile = async () => {
    const response = await axios.get('/drivers/me');
    return response.data;
};

export const updateProfile = async (data: any) => {
    const response = await axios.patch('/drivers/me/profile', data);
    return response.data;
};

export const updateAvailability = async (isOnline: boolean) => {
    const response = await axios.patch('/drivers/me/availability', { isOnline });
    return response.data;
};
