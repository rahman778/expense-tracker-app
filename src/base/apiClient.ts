import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://67d447f5d2c7857431ed1e78.mockapi.io/api/v1/',
});

export default apiClient;