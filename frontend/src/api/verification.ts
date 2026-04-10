import axios from './config';

export const uploadDocument = async (type: string, file: File) => {
    const formData = new FormData();
    formData.append('document', file);
    formData.append('documentType', type);
    
    const response = await axios.post('/verification/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
    return response.data;
};

export const getVerificationStatus = async () => {
    const response = await axios.get('/verification/status');
    return response.data;
};
