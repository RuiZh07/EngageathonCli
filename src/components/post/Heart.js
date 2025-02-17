import React, { useState } from "react";
import { TouchableOpacity } from "react-native";
import { SvgUri } from "react-native-svg";
import { heartIconFilled, heartIconOutline } from "../../utils/icons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import baseUrl from "../../utils/api";
import apiClient from "../../services/apiClient";
const Heart = ({ postId, like, contentType}) => {
    const [liked, setLiked] = useState(like);
  
    const handleLikePress = async () => {
        try {
            const token = await AsyncStorage.getItem('AccessToken');
            if (!token) {
                console.error('No token found');
                return;
            }
            const url = contentType === 'EV' 
            ? `${baseUrl}/like/EV/${postId}/`  
            : `${baseUrl}/like/PO/${postId}/`;

            const response = await apiClient.put(url, {}, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
        
            if (response.status === 200 || response.status === 201) {
                console.log(response.data.message);
                setLiked((prev) => !prev);
            } else {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
        } catch (error) {
            console.error('Error handling like:', error);
        }
    };
  
    const heartIcon = liked ? heartIconFilled : heartIconOutline;
  
    return (
        <TouchableOpacity onPress={handleLikePress}>
            <SvgUri
                uri={heartIcon}
                width="16" 
                height="14" 
            />
        </TouchableOpacity>
    );
};
  
export default Heart;