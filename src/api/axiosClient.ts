// api/axiosClient.js
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import queryString from 'query-string';
import { toast } from 'react-toastify';
import i18n from 'translation/i18n';
// Set up default config for http requests here

const axiosClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'https://freefit.azurewebsites.net/api/v1.0',
  headers: {
    'content-type': 'multipart/form-data',
  },
  paramsSerializer: (params) => queryString.stringify(params),
});
axiosClient.interceptors.request.use(async (config: AxiosRequestConfig) => {
  const { method } = config;
  if (method === 'put' || method === 'post') {
    config.headers = {
      'content-type': 'application/json',
    };
  }
  const jwt = localStorage.getItem('access_token');
  if (jwt) {
    const exp = Number(localStorage.getItem('time_expire'));
    if (exp > Date.now() / 1000) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
      localStorage.removeItem('time_expire');
      toast.warning(i18n.t('login.sectionTimeout'));
      // eslint-disable-next-line no-restricted-globals
      location.href = '/login';
    }
    config.headers.common = { Authorization: `Bearer ${jwt}` };
  }
  return config;
});
axiosClient.interceptors.response.use(
  (response: AxiosResponse) => {
    if (response && response.data) {
      return response.data;
    }
    if (typeof response.data === 'boolean') {
      return response.data;
    }
    if (response.status === 204 && response.config.method === 'get') {
      return {
        pageNumber: 1,
        pageSize: 10,
        results: [],
        totalNumberOfPages: 0,
        totalNumberOfRecords: 0,
      };
    }
    return response;
  },
  (error) => {
    // Handle errors
    throw error;
  }
);
export default axiosClient;
