import axios from 'axios';

export const authApi = axios.create({
    baseURL: 'http://localhost:8000',
    mode: 'no-cors',
    withCredentials: false,
});

export const marketApi = axios.create({
    baseURL: 'http://localhost:8080',
    mode: 'no-cors',
    withCredentials: false,
});

export const userApi = axios.create({
    baseURL: 'http://localhost:8081',
    mode: 'no-cors',
    withCredentials: false,
});