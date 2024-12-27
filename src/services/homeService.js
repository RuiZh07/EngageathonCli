import AsyncStorage from "@react-native-async-storage/async-storage";
import { endpoints } from "./endPoints";
import baseUrl from "../utils/api";
import apiClient from "./apiClient";

const getHomeFeed = async () => {
    const token = await AsyncStorage.getItem("AccessToken");
    if (!token) {
        console.error("No token found");
        return;
    }
    try {
        const response = await apiClient.get(`${baseUrl}${endpoints.homeFeed}?content_types=event&content_types=post`, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        });
        return response;
    } catch (error) {
        throw error;
    }
};

const getFilteredFeed = async (contentType) => {
    const token = await AsyncStorage.getItem("AccessToken");
    if (!token) {
        console.error("No token found");
        return;
    }
    try {
        const response = await apiClient.get(`${baseUrl}${endpoints.homeFeed}?content_types=${contentType}`, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        });
        return response;
    } catch (error) {
        throw error;
    }
};

const likePost = async (postId) => {
    const token = await AsyncStorage.getItem("AccessToken");
    if (!token) {
        console.error("No token found");
        return;
    }
    try {
        const response = await apiClient.put(`${baseUrl}/like/EV/${postId}/`, null, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        });
        return response;
    } catch (error) {
        throw error;
    }
};

const bookmarkPost = async (postId) => {
    const token = await AsyncStorage.getItem("AccessToken");
    if (!token) {
        console.error("No token found");
        return;
    }
    try {
        const response = await apiClient.put(`${baseUrl}/bookmark/EV${postId}/`, null, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        });
        return response;
    } catch (error) {
        throw error;
    }
};

const getUserEvents = async () => {
    const token = await AsyncStorage.getItem("AccessToken");
    if (!token) {
        console.error("No token found");
        return;
    }
    try {
        const response = await apiClient.get(`${baseUrl}/events/user/`, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        });
        return response;
    } catch (error) {
        throw error;
    }
};

export default {
    getHomeFeed,
    getFilteredFeed,
    likePost,
    bookmarkPost,
    getUserEvents, // Add the new function to the export
};
