import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { endpoints } from "./endPoints";
import baseUrl from "../utils/api";
import {
    Alert,
  } from "react-native";

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
        const { account_type, email, first_name, last_name, id, access, refresh } = response.data;
        //console.log("Login successful:", response.data);
        await AsyncStorage.setItem("AccessToken", access);
        await AsyncStorage.setItem("RefreshToken", refresh);
        const storedAccessToken = await AsyncStorage.getItem("AccessToken");
        const storedRefreshToken = await AsyncStorage.getItem("RefreshToken");
        
        return {
            userData: { account_type, email, first_name, last_name, id },
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
        console.log("payload",payload);
        const headers = {
            "Content-Type": isFormUrlEncoded
                ? "application/x-www-form-urlencoded"
                : "application/json",
            };

        const response = await axios.post(`${baseUrl}${endpoints.register}`, payload, {
            headers,
        });
        
        console.log("response data:", response.data);
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
        const response = await axios.post(`${baseUrl}${endpoints.invite}`, data, {
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
            await axios.post(`${baseUrl}${endpoints.logout}`, `refresh=${refreshToken}`, {
                headers: { 
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/x-www-form-urlencoded", 
                },
            });
            await AsyncStorage.removeItem("AccessToken"); 
        }
    } catch (error) {
        throw error;
    }
};

export default {
    login,
    signup,
    invite,
    resetPassword,
    logout,
};