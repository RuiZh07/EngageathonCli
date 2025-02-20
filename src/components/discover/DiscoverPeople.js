import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import baseUrl from "../../utils/api";
import apiClient from "../../services/apiClient";
import LinearGradient from "react-native-linear-gradient";

const DiscoverPeople = ({ profilePicture, userID, name, onPress, followingStatus, requestStatus, privateAccount }) => {
    const [clicked, setClicked] = useState(followingStatus);
    const [buttonTitle, setButtonTitle] = useState(followingStatus ? 'Following' : 'Add + ');
    const [buttonChange, setButtonChange] = useState(followingStatus ? true : false);
    const [buttonDisabled, setButtonDisabled] = useState(false);

    useEffect(() => {
        const loadButtonState = async () => {
            const savedStatus = await AsyncStorage.getItem(`followStatus_${userID}`);
            if (savedStatus !== null) {
                const status = JSON.parse(savedStatus);
                setClicked(status);
                setButtonTitle(status ? 'Following' : 'Add +');
                setButtonChange(status ? true : false);
            } else {
                setClicked(followingStatus);
                setButtonTitle(followingStatus ? 'Following' : 'Add +');
                setButtonChange(followingStatus ? true : false);
            }
        };
        loadButtonState();
    }, [userID, followingStatus]);

    const sendRequest = async (userID) => {
        const token = await AsyncStorage.getItem("AccessToken");
        if (!token) {
            console.error("No token found");
            return;
        }
    
        try {
            const response = await apiClient.post(`${baseUrl}/follow-user/${userID}/`, null, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            });
            console.log("Response message:", response.data.message);
            return response.data;
        } catch (error) {
            console.log("Failed to follow/unfollow user: ", error.message);
            throw error;
        }
    };

    const handleButtonPress = async () => {
        if (clicked) {
            setButtonTitle('Add +');
            setButtonChange(false); 
            setClicked(false);
        } else {
            if (privateAccount) {
                setButtonTitle('Request Sent!');
                setButtonDisabled(true);
                setButtonChange(true);
            } else {
                setButtonTitle('Following');
                setClicked(true);
                setButtonChange(true); 
            }
        }

        const response = await sendRequest(userID);
        if (response && response.status === 200 && response.data.message === "User followed successfully") {
            console.log("User followed successfully.");
            await AsyncStorage.setItem(`followStatus_${userID}`, JSON.stringify(true));
        }
    };
    
    return(
        <View style={styles.container}>
            <TouchableOpacity onPress={onPress}>
                <View style={styles.post}>
                    <View style={styles.postHeader}>
                        <Image
                            source={profilePicture}
                            style={styles.pfp}
                        />
                    </View>

                    <View style={styles.postUser}>
                        <Text style={styles.userNameText} numberOfLines={2}>{name}</Text>
                    </View>
                    <TouchableOpacity 
                        onPress={handleButtonPress} 
                        style={styles.buttonContainer}
                        disabled={buttonDisabled}
                    >
                        <LinearGradient
                            colors={buttonChange ? ["#2BAB47", "#2BAB47"] : ["#FF8D00", "#FFB900", "#FFE600"]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.button}
                        >
                            <Text style={styles.buttonText}>{buttonTitle}</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
        </View>
    );

};

export default DiscoverPeople;

const styles = StyleSheet.create({
    container: {
        marginBottom: 10,
    },
    post: {
        backgroundColor: "#fff",
        width: 150,
        borderRadius: 40,
        paddingVertical: 16,
        marginLeft: 15,
        alignItems: 'center',
    },
    postHeader: {
        alignItems: "center",
        borderColor: '#2BAB47',
        borderWidth: 2,
        borderRadius: 40,
        paddingHorizontal: 2,
        paddingVertical: 2,
    },
    pfp: { 
        width: 44, 
        height: 44, 
        borderRadius: 22,
        resizeMode: "cover",
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#2BAB47',
    },
    postUser: {
        alignItems: "center",
        justifyContent: 'center',
        marginVertical: 10,
        height: 40,
    },
    userNameText: {
        fontSize: 16,
        fontFamily: 'Poppins-Medium',
        lineHeight: 19,
    },
    buttonContainer: {
        alignItems: "center",
        marginHorizontal: 10, 
        marginVertical: 10, 
    },
    button: {
        width: 110,
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
    },
    buttonText: {
        fontFamily: "Poppins-SemiBold",
        fontSize: 13,
        lineHeight: 22,
        letterSpacing: 0.4,
        color: "#F5F4F4",
    },
  })