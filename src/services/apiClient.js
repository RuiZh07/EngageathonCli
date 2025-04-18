import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { endpoints } from "./endPoints";
import baseUrl from "../utils/api";
import authService from "../services/authService";
import { createNavigationContainerRef } from "@react-navigation/native";

// Create a global navigation reference
export const navigationRef = createNavigationContainerRef();

// Create an instance of axios with the base URL
const apiClient = axios.create({
    baseURL: baseUrl,
});

// This function logs the user out and reset the navigation
const performLogout = async () => {
    try {
        await authService.logout();
        if (navigationRef.isReady()) {
            // Navigates the user back to the Login screen
            navigationRef.reset({
                index: 0,
                routes: [{ name: 'Login' }],
            });
        }
    } catch (error) {
        console.error("Error logging out:", error);
    }
};

// Refresh the token when the access token has expired
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

        // If the refresh token is invalid/expired, Log the user out
        if(error.response && error.response.status === 401) {
            try {
                console.error("Refresh token is expired or invalid");
                await performLogout();
            } catch (error) {
                console.log("logout failed: ", error.message);
            }
            
        }
        return null;
    }
};

// Axios Interceptor
// Runs automatically on every response
apiClient.interceptors.response.use(
    (response) => response, // Pass through successful responses
    async (error) => {
        if (error.response?.status === 401) {
            if (!error.config._retry) {
                error.config._retry = true;
                try {
                    // If response has unauthorized status, try to get a new access token
                    const newAccessToken = await refreshAccessToken();
                    if (newAccessToken) {
                        // Update the original request with the new token
                        error.config.headers["Authorization"] = `Bearer ${newAccessToken}`;
                        return apiClient.request(error.config); // Retry the request
                    }
                } catch (refreshError) {
                    console.error("Failed to refresh token:", refreshError);
                    throw refreshError;
                }
            }
        }
        return Promise.reject(error); // Reject any other error.
    }
);

export default apiClient;
