export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const USER_ENDPOINTS = {

    //broker login
    BROKER_LOGIN: `${API_BASE_URL}/auth/login`,
    BROKER_CALLBACK: `${API_BASE_URL}/auth/callback`,

    CHECK_AUTH: `${API_BASE_URL}/auth/me`,
    LOGOUT: `${API_BASE_URL}/auth/logout`,

};