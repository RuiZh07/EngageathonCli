import AsyncStorage from "@react-native-async-storage/async-storage";
import { endpoints } from "./endPoints";
import baseUrl from "../utils/api";
import {
    Alert,
} from "react-native";
import apiClient from "./apiClient";
import axios from 'axios';

const login = async (email, password) => {
    //console.log(baseUrl);
    const data = {
        email,
        password,
    };
    try {
        const response = await axios.post(`${baseUrl}${endpoints.login}`, data, {
            headers: {
                "Content-Type": "application/json",
            },
        });
        console.log("Login successful:", response.data);
        const { account_type, email, first_name, last_name, id, profile_photo, access, refresh } = response.data;
        //console.log("Login successful:", response.data);
        await AsyncStorage.setItem("AccessToken", access);
        await AsyncStorage.setItem("RefreshToken", refresh);
        const storedAccessToken = await AsyncStorage.getItem("AccessToken");
        const storedRefreshToken = await AsyncStorage.getItem("RefreshToken");
        
        return {
            userData: { account_type, email, first_name, last_name, id, profile_photo },
            accessToken: storedAccessToken,
            refreshToken: storedRefreshToken,
        };
        
    } catch (error) {
        console.error("Login error:", error);
        throw error;
    }
};

const signup = async (userData) => {
    const { account_type: accountType } = userData;
    
    const data = {
        ...userData,
    };

    try {
        const isFormUrlEncoded = accountType === 'IN';
        const payload = isFormUrlEncoded
            ? new URLSearchParams(userData).toString()
            : data;

        const headers = {
            "Content-Type": isFormUrlEncoded
                ? "application/x-www-form-urlencoded"
                : "application/json",
            };
        console.log(payload);

        const response = await axios.post(`${baseUrl}${endpoints.register}`, payload, {
            headers,
        });

        return response.data;
    } catch (error) {
        if (error.response?.status === 400 && error.response?.data?.email) {
            Alert.alert("Error", "Email already exists. Please use a different email.");
        } else {
            Alert.alert("Error", "Signup failed. Please try again.");
        }

        console.error("Error in signup:", error.response?.data || error.message);
        throw error;
    }
};

const invite = async (user_email, invitee_email) => {
    const data = {
        user_email,
        invitee_email,
    };
    try {
        const response = await apiClient.post(`${baseUrl}${endpoints.invite}`, data, {
            headers: {
                "Content-Type": "application/json",
            },
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

const resetPassword = async (user_email) => {
    const data = {
        email: user_email,
    };
    try {
        const response = await axios.post(`${baseUrl}${endpoints.passwordReset}`, data, {
            headers: {
                "Content-Type": "application/json",
            },
        });
        return response.data;
    } catch (error) {
        console.error("Reset Password Error:", error.response ? error.response.data : error.message);
        throw error;
    }
};


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

const updateUserMission = async (token) => {
    try {
        const causesString = await AsyncStorage.getItem('selectedCauses');
        const causeStringStorage = JSON.parse(causesString);
        console.log('getCause', causeStringStorage);
        console.log('cause', causesString);
        
        if (!causesString) {
            console.log('No selected causes found.');
            return;
        }

        const selectedCauseIds = JSON.parse(causesString);

        const data = {
            "categories": selectedCauseIds,
        }
        console.log('Data being sent to the server:', data);
        const response = await axios.put(`${baseUrl}/missions/categories/user/`, data, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        console.log('Successfully updated user missions:', response.data);

    } catch (error) {
        console.error("Error updating the mission categories:", error.message);
    }
};

export default {
    login,
    signup,
    invite,
    resetPassword,
    logout,
    updateUserMission,
};
