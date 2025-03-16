import { ResponseM, ResponseS } from "./apiTypes";
import apiClient from "./apiClient";

function apiFactory<T>(baseURL: string) {
  return {
    create: (data: Partial<T>, params?: any): Promise<ResponseS<T>> => {
      return apiClient.post(baseURL, data, { params });
    },
    getAll: (params?: any): Promise<ResponseM<T>> => {
      return apiClient.get(baseURL, { params });
    },
    getOne: (id: number, params?: any): Promise<ResponseS<T>> => {
      return apiClient.get(`${baseURL}/${id}`, { params });
    },
    update: (
      id: number,
      data: Partial<T>,
      params?: any
    ): Promise<ResponseS<T>> => {
      return apiClient.put(`${baseURL}/${id}`, data, { params });
    },
    delete: (id: number, params?: any): Promise<{ data: number }> => {
      return apiClient.delete(`${baseURL}/${id}`, { params });
    },
  };
}

export default apiFactory;
