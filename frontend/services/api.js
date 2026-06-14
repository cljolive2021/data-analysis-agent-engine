'use client';

import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
});

export const analyzeData = async (file, target, context = '') => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('target', target);
  formData.append('context', context);

  try {
    const response = await apiClient.post('/analyze', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    if (error.response) {
      const message = error.response.data?.detail || 'Erro ao processar análise';
      throw new Error(message);
    } else if (error.request) {
      throw new Error('Servidor não respondeu. A API pode estar em manutenção.');
    } else {
      throw new Error(error.message);
    }
  }
};

export const healthCheck = async () => {
  try {
    const response = await apiClient.get('/health');
    return response.data;
  } catch (error) {
    throw new Error('API não está disponível');
  }
};
