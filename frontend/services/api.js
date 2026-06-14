'use client';

import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 30000,
});

export const analyzeData = async (file, target, context = '') => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('target', target);
  formData.append('context', context);

  try {
    const response = await apiClient.post('/api/analyze', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    if (error.response?.data?.detail) {
      throw new Error(error.response.data.detail);
    }
    throw new Error('Erro ao conectar com a API');
  }
};
