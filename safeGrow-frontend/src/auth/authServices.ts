import axios from "axios";
import { USER_ENDPOINTS } from "./authRoutes";

const axiosInstance = axios.create({
    withCredentials: true
});

// BROKER LOGIN SERVICE
export const brokerloginService = async () => {
    const response = await axiosInstance.get(
        USER_ENDPOINTS.BROKER_LOGIN,
    );
    return response.data;
}

// BROKER CALLBACK SERVICE
export const brokerCallbackService = async (authCode: string) => {
    const response = await axiosInstance.get(USER_ENDPOINTS.BROKER_CALLBACK, {
        params: {
            auth_code: authCode,
        },
    });

    return response.data;
};

//check auth api
export const checkAuthService = async () => {
    const response = await axiosInstance.get(
        `${USER_ENDPOINTS.CHECK_AUTH}`
    );
    return response.data;
};


// LOGOUT ( /api/auth/logout )
export const logoutService = async () => {
    const response = await axiosInstance.post(
        `${USER_ENDPOINTS.LOGOUT}`
    );
    return response.data;
};
