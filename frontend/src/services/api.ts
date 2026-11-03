// src/services/api.ts
import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
import { ACCESS_TOKEN, EMAIL, NAME, REFRESH_TOKEN, SURNAME } from "../constants/Token";
import { API_HOST } from "../constants/Host";
import { getCookie } from "../tools/Tools";

const api = axios.create({
    baseURL: API_HOST,
    withCredentials: true,
});

api.defaults.xsrfCookieName = 'csrftoken';
api.defaults.xsrfHeaderName = 'X-CSRFToken';

api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem(ACCESS_TOKEN);

        if (token && config.headers && !config.headers.Authorization) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        const csrfToken = getCookie('csrftoken');

        if (csrfToken && config.headers && config.method !== 'get') {
            config.headers['X-CSRFToken'] = csrfToken;
        }

        return config;
    },
    error => Promise.reject(error)
);

let isRefreshing = false;
let failedQueue: Array<{
    resolve: (value?: unknown) => void;
    reject: (error: any) => void;
    config: InternalAxiosRequestConfig;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach(prom => {
        if (error) prom.reject(error);
        else {
            if (token) prom.config.headers!["Authorization"] = `Bearer ${token}`;
            prom.resolve(api(prom.config));
        }
    });
    failedQueue = [];
};

api.interceptors.response.use(
    response => response,
    async (error: AxiosError) => {
        const originalRequest = error.config!;
        if (
            !error.response ||
            error.response.status !== 401 ||
            (originalRequest as any)._retry
        ) {
            return Promise.reject(error);
        }

        (originalRequest as any)._retry = true;

        if (isRefreshing) {
            return new Promise((resolve, reject) => {
                failedQueue.push({ resolve, reject, config: originalRequest });
            });
        }

        isRefreshing = true;

        try {
            const refreshToken = localStorage.getItem(REFRESH_TOKEN);
            if (!refreshToken) throw new Error("Refresh token ausente");

            const res = await axios.post(`${API_HOST}token/refresh/`, {
                refresh: refreshToken,
            });

            const newAccessToken = res.data.access;

            localStorage.setItem(ACCESS_TOKEN, newAccessToken);

            processQueue(null, newAccessToken);

            originalRequest.headers!["Authorization"] = `Bearer ${newAccessToken}`;
            return api(originalRequest);
        } catch (refreshErr) {
            processQueue(refreshErr, null);
            localStorage.removeItem(ACCESS_TOKEN);
            localStorage.removeItem(REFRESH_TOKEN);
            localStorage.removeItem(EMAIL);
            localStorage.removeItem(NAME);
            localStorage.removeItem(SURNAME);

            if (! (["/infinix", "/infinix/", "/register"].includes(window.location.pathname))) {
                window.location.href = "/infinix/";
            }

            return Promise.reject(refreshErr);
        } finally {
            isRefreshing = false;
        }
    }
);

export default api;
