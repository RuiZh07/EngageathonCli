import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
} from "react-native";
import DiscoverPeopleAddButton from "./DiscoverPeopleAddButton";
import AsyncStorage from '@react-native-async-storage/async-storage';
import baseUrl from "../../utils/api";
import apiClient from "../../services/apiClient";

const DiscoverPeople = ({ profilePicture, userID, name, onPress }) => {
    const [clicked, setClicked] = useState(false);

    useEffect(() => {
        const fetchClickedState = async () => {
            try {
                const savedState = await AsyncStorage.getItem(`buttonClicked_${userID}`);
                if (savedState === "true") {
                    setClicked(true);
                }
            } catch (error) {
                console.error("Failed to load button state:", error);
            }
        };
        fetchClickedState();
    }, [userID]);

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
            console.log("Failed to follow user: ", error.message);
            throw error;
        }
    };

    const handleButtonPress = async () => {
        setClicked(true);
        await AsyncStorage.setItem(`buttonClicked_${userID}`, "true");

        try {
            await sendRequest(userID);
        } catch (error) {
            console.error("Error during API call:", error.message);
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
                    <DiscoverPeopleAddButton onPress={handleButtonPress} title="Add + " clicked={clicked} />
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
        paddingVertical: 20,
        marginLeft: 15,
        marginRight: -5,
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
  })