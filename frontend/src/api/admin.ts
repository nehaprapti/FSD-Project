import axios from './config';

export const getAdminDashboard = async () => {
    const response = await axios.get('/admin/dashboard');
    return response.data;
};

export const getUsers = async (params = {}) => {
    const response = await axios.get('/admin/users', { params });
    return response.data;
};

export const deleteUser = async (userId: string) => {
    const response = await axios.delete(`/admin/users/${userId}`);
    return response.data;
};

export const getDrivers = async () => {
    const response = await axios.get('/admin/drivers');
    return response.data;
};

export const getVerificationQueue = async () => {
    const response = await axios.get('/admin/verification/queue');
    return response.data;
};

export const approveVerification = async (driverId: string) => {
    const response = await axios.patch(`/admin/verification/${driverId}/approve`);
    return response.data;
};

export const rejectVerification = async (driverId: string, reason: string) => {
    const response = await axios.patch(`/admin/verification/${driverId}/reject`, { reason });
    return response.data;
};
