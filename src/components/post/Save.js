import React, { useState, useEffect } from "react";
import { TouchableOpacity } from "react-native";
import { SvgUri } from "react-native-svg";
import { saveIconFilled, saveIconOutline } from "../../utils/icons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import baseUrl from "../../utils/api";
import apiClient from "../../services/apiClient";

const Save = ({ postId, bookmark }) => {
    const [saved, setSaved] = useState(bookmark);
    useEffect(() => {
        console.log(`Initial bookmark state for postId ${postId}:`, bookmark);
    }, [bookmark, postId]);

    const handleBookmarkPress = async () => {
        try {
            const token = await AsyncStorage.getItem('AccessToken');
        
            if (!token) {
                console.error('No token found');
                return;
            }
            console.log(`Toggling bookmark for postId ${postId}. Current state:`, saved);
            const response = await apiClient.put(`${baseUrl}/bookmark/EV/${postId}/`, {}, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
        
            if (response.status === 200 || response.status === 201) {
                console.log(response.data.message);
                setSaved((prev) => {
                    const newSavedState = !prev;
                    console.log(`Updated local bookmark state for postId ${postId}:`, newSavedState);
                    return newSavedState;
                });
            } else {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
        
        } catch (error) {
            console.error('Error handling bookmark:', error);
        }
    };
    const saveIcon = saved ? saveIconFilled : saveIconOutline;

    return (
        <TouchableOpacity onPress={handleBookmarkPress}>
            <SvgUri
                uri={saveIcon}
                width="16" 
                height="14" 
            />
        </TouchableOpacity>
    );
};
  
export default Save;