import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import baseUrl from "../utils/api";

const fetchComments = async (postId) => {
    const token = await AsyncStorage.getItem("authToken");
    if (!token) {
        console.error("No token found");
        return;
    }
    try {
        const response = await axios.get(`${baseUrl}/comments/EV/${postId}/`, {
            headers: {
                'Authorization': `Token ${token}`,
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error fetch comments:", error);
        throw error;
    }
};

const postComment = async (postId, content) => {
    const token = await AsyncStorage.getItem("authToken");
    if (!token) {
        console.error("No token found");
        return;
    }
    try {
        const response = await axios.post(`${baseUrl}/comments/`, {
            content_object_id: postId,
            content: content,
            content_type: "EV",
        }, {
            headers: {
                'Authorization': `Token ${token}`,
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        console.log("Error posting comment:", error);
        throw error;
    }
};

export default {
    fetchComments,
    postComment,
};