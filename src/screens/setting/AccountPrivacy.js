import React, { useState, useEffect } from "react";
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Alert,
    ImageBackground,
    Switch,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import baseUrl from "../../utils/api";
import { backArrow, gradientLine } from "../../utils/icons";
import { SvgUri } from "react-native-svg";
import apiClient from "../../services/apiClient";

const AccountPrivacy = () => {
    const [isPrivate, setIsPrivate] = useState(false);
    const navigation = useNavigation();

    // Fetch privacy status when the component mounts
    useEffect(() => {
        const fetchPrivacy = async () => {
            try {
                const token = await AsyncStorage.getItem("AccessToken");

                const response = await apiClient.get(`${baseUrl}/auth/privateuser/`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (response.data) {
                    if (response.data.message === "User is private") {
                        setIsPrivate(true); // Account is private
                    } else {
                        setIsPrivate(false); // Account is public
                    }
                    console.log(response.data);
                } else {
                    console.log("Error: failed to fetch account privacy status");
                }
            } catch (error) {
                console.error("Error fetching account privacy status", error);
            }
        };

        fetchPrivacy();
    }, []); 

    // Toggle privacy setting
    const togglePrivacy = async () => {
        try {
            const token = await AsyncStorage.getItem("AccessToken");

            const response = await apiClient.put(`${baseUrl}/auth/privateuser/`, {}, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.data) {
                if (response.data.message === "User is now private") {
                    setIsPrivate(true);
                } else {
                    setIsPrivate(false);
                }
                console.log(response.data);
                Alert.alert(response.data.message); 
            } else {
                console.log("Error: update your account privacy");
            }
        } catch (error) {
            console.error("Error updating your account privacy", error);
        }
    };
    return (
        <ImageBackground
            source={require('../../assets/main-background.png')}
            style={styles.backgroundImage}
        >
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <SvgUri uri={backArrow} />
                </TouchableOpacity>
                <Text style={styles.headerText}>Account Privacy</Text>
            </View>
            
            <View style={styles.container}>
                <SvgUri uri={gradientLine} />
                <View style={styles.toggleSwitchContainer}>
                    <Text style={styles.privateAccountText}>Private Account</Text>
                    <View style={styles.switcher}>
                        <Switch 
                            trackColor={{ false: "#4d4d4d", true: "#FFA500" }}
                            thumbColor={isPrivate ? '#ffffff' : "#ffffff"}
                            onValueChange={togglePrivacy}
                            value={isPrivate}
                            style={{ transform: [{scaleX: 0.7}, {scaleY: 0.7}]}}
                        />
                    </View>
                </View>
                <View style={styles.infoTextContainer}>
                    <Text style={styles.infoText}>When your account is public, your profile and posts can be seen by anyone.</Text>
                    <Text style={styles.infoText}>When your account is private, only the followers you approve can see what you post.</Text>
                </View>

            </View>
        </ImageBackground>
    );
};
  
const styles = StyleSheet.create({
    backgroundImage: {
        flex: 1,
        width: "100%",
    },
    container: {
        flex: 1,
        padding: 20,
    },
    title: {
        color: '#FF8D00',
        fontSize: 28,
        marginBottom: 20,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
        paddingHorizontal: "5%",
        marginTop: Platform.OS === "android" ? "6%": "15%",
    },
    headerText: {
        color: "#FFE600",
        fontSize: 24,
        fontFamily: "Poppins-Medium",
        paddingLeft: 15,
    },
    toggleSwitchContainer: {
        marginHorizontal: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    privateAccountText: {
        color: '#FFFFFF',
        fontSize: 20,
        fontFamily: "Poppins-Medium",
    },
    infoTextContainer: {
        marginTop: 30,
        marginHorizontal: 10,
    },
    infoText: {
        color: '#A8A8A8',
        fontSize: 14,
        fontFamily: "Inter-Medium",
        marginBottom: 10,
    },
});
  
export default AccountPrivacy;