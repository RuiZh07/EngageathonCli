import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { endpoints } from "./endPoints";
import baseUrl from "../utils/api";
import authService from "../services/authService";

const apiClient = axios.create({
    baseURL: baseUrl,
});

const logout = async () => {
    try {
        const token = await AsyncStorage.getItem("AccessToken");
        const refreshToken = await AsyncStorage.getItem("RefreshToken")
        if (token) {
            await apiClient.post(`${baseUrl}${endpoints.logout}`, `refresh=${refreshToken}`, {
                headers: { 
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/x-www-form-urlencoded", 
                },
            });
            await AsyncStorage.removeItem("AccessToken"); 
            await AsyncStorage.removeItem("RefreshToken");
        }
    } catch (error) {
        throw error;
    }
};

const refreshAccessToken = async () => {
    try {
        const refreshToken = await AsyncStorage.getItem("RefreshToken");
        console.log(refreshToken);
        if (!refreshToken) {
            throw new Error("no refresh token found.");
        }
    
        const response = await axios.post(`${baseUrl}${endpoints.refresh}`, `refresh=${refreshToken}`, {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
        });
        const { access } = response.data;
        await AsyncStorage.setItem("AccessToken", access);
        return access;
    } catch (error) {
        console.error("Error Refreshing Token", error);

        if(error.response && error.response.status === 401) {
            try {
                console.error("Refresh token is expired or invalid");
                await logout();
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'Login' }],
                });
            } catch (error) {
                console.log("logout failed: ", error.message);
            }
            
        }
        return null;
    }
};

apiClient.interceptors.response.use(
    (response) => response, // Pass through successful responses
    async (error) => {
        if (error.response?.status === 401) {
            if (!error.config._retry) {
                error.config._retry = true;
                try {
                    const newAccessToken = await refreshAccessToken();
                    if (newAccessToken) {
                        // Retry the original request with the new token
                        error.config.headers["Authorization"] = `Bearer ${newAccessToken}`;
                        return apiClient.request(error.config);
                    }
                } catch (refreshError) {
                console.error("Failed to refresh token:", refreshError);
                throw refreshError;
                }
            }
        }
        return Promise.reject(error); 
    }
);
  
export default apiClient;
