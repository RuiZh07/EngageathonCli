import React, { useEffect, useState, useRef } from "react";
import {
    StatusBar,
    StyleSheet,
    Image,
    Text,
    View,
    ScrollView,
    TouchableOpacity,
    ImageBackground,
    Alert,
    Animated,
    Platform
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from "@react-navigation/native";
import { backArrow } from "../../utils/icons";
import axios from "axios";
import { SvgUri } from "react-native-svg";
import { 
    greenPencilIcon, 
    pencilIcon, 
    rightArrowIcon, 
    becomeMemberIcon, 
    privacyPolicyIcon, 
    inviteIcon, 
    accountPrivacyIcon,
    gradientLine } from "../../utils/icons";
import authService from "../../services/authService";
import baseUrl from "../../utils/api";
import * as ImagePicker from 'react-native-image-picker';
import ImageResizer from 'react-native-image-resizer';
import RNFS from 'react-native-fs';

export default function SettingScreen () {
    const [profileImage, setProfileImage] = useState(null);
    const navigation = useNavigation();

    const handleLogout = () => {
        Alert.alert(
            "Confirm Logout",
            "Are you sure you want to log out?",
            [
                {
                text: "Cancel",
                style: "cancel",
                },
                {
                text: "Logout",
                style: "destructive",
                onPress: performLogout,
                },
            ],
            { cancelable: false }
        );
    };

    const performLogout = async () => {
        try {
            await authService.logout();
            navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
            });
        } catch (error) {
            console.error("Error logging out:", error);
        }
    };

    const uploadProfileImage = async (uri) => {
        try {
            const token = await AsyncStorage.getItem("AccessToken");
            if (!token) {
                console.error("No token found");
                return;
            }

            const base64Image = await RNFS.readFile(uri, 'base64');
        
            const data = {
                image: base64Image,
            };
            await axios.put(`${baseUrl}/profile_image/`, data, {
                headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                },
            });
        
            console.log('Profile image uploaded successfully');
        } catch (error) {
            console.error("Error uploading profile image:", error);
            Alert.alert("Error", "Failed to upload profile image");
        }
    };

    const handleImagePick = async () => {
        try {
            ImagePicker.launchImageLibrary(
                {
                    mediaType: 'photo',
                    includeBase64: false,
                    maxWidth: 1000,
                    maxHeight: 1000,
                    quality: 1,
                },
                async (response) => {
                    if (response.didCancel) {
                        console.log('User cancelled image picker');
                    } else if (response.errorMessage) {
                        console.error('ImagePicker Error: ', response.errorMessage);
                    } else if (response.assets && response.assets.length > 0) {
                        const selectedAsset = response.assets[0];

                        if (selectedAsset && selectedAsset.uri) {
                            const resizedImage = await ImageResizer.createResizedImage(
                                selectedAsset.uri,
                                600,
                                600,
                                'JPEG',
                                80 
                            );
                            setProfileImage(resizedImage.uri);
                            await uploadProfileImage(resizedImage.uri);

                        } else {
                            console.error('No URI found in the selected asset');
                        }
                    }
                }
            );
        } catch (error) {
            console.error('Error picking image:', error);
        }
    };

    return (
        <ImageBackground
            source={require("../../assets/main-background.png")}
            style={styles.backgroundImage}
        >
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <SvgUri uri={backArrow} /> 
                </TouchableOpacity>
                <Text style={styles.headerText}>Settings</Text>

                <View style={styles.headerRight}>
                    <LinearGradient
                        colors={["#FF8D00", "#FFBA00", "#FFE600"]}
                        locations={[0.7204, 0.8602, 1]} 
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.updateButtonGradient}
                    >
                        <TouchableOpacity
                            style={styles.updateButton}
                        >
                            <Text style={styles.updateButtonText}>Update</Text>
                        </TouchableOpacity>
                    </LinearGradient>
                </View>
            </View>

            <TouchableOpacity onPress={handleImagePick} style={styles.circle}>
                <Image
                    source={profileImage ? { uri: profileImage } : require("../../assets/default_profile.png")}
                    style={styles.pfp}
                />
                <Image 
                    source={require("../../assets/icons/green-pencil.png")} 
                    style={styles.greenPencilIcon} 
                />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.changePasswordButton} onPress={() => navigation.navigate('ChangePasswordScreen', { email: userData.email })}>
                <Text style={styles.changePasswordButtonText}>Change Password</Text>
                <SvgUri uri={pencilIcon} />
            </TouchableOpacity>
            <SvgUri uri={gradientLine} style={styles.gradientLine} /> 

            <View style={styles.actionContainer}>
                <TouchableOpacity style={styles.actionButton}>
                    <SvgUri uri={inviteIcon} width={28} />
                    <Text style={styles.actionButtonText}>Invite Contacts</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate("PrivacyPolicyScreen")}>
                    <SvgUri uri={privacyPolicyIcon} width={26}/>
                    <Text style={styles.actionButtonText}>Read Privacy Policy</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                    <SvgUri uri={becomeMemberIcon} />
                    <Text style={styles.actionButtonText}>Become a Member</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                    <SvgUri uri={accountPrivacyIcon} />
                    <Text style={styles.actionButtonText}>Account Privacy</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.bottomContainer}>
                <SvgUri uri={gradientLine} style={styles.gradientLine} /> 
                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                    <Text style={styles.logoutButtonText}>Logout</Text>
                    <SvgUri uri={rightArrowIcon} />
                </TouchableOpacity>
                <SvgUri uri={gradientLine} style={styles.gradientLine} /> 
                <TouchableOpacity style={styles.deleteAccountButton} onPress={() => navigation.navigate('DeleteAccountScreen')}>
                    <Text style={styles.deleteAccountButtonText}>Delete Account</Text>
                    <SvgUri uri={rightArrowIcon} />
                </TouchableOpacity>
                <SvgUri uri={gradientLine} style={styles.gradientLine} /> 
            </View>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    backgroundImage: {
        flex: 1,
        width: "100%",
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
        paddingHorizontal: "5%",
        marginTop: "14%",
        position: "relative",
    },
    headerText: {
        color: "#FFE600",
        fontSize: 26,
        fontFamily: "Poppins-Medium",
        paddingLeft: 15,
    },
    headerRight: {
        position: "absolute",
        right: 20,
    },
    updateButtonGradient: {
        borderRadius: 30,
    },
    updateButton: {
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 8,
        paddingHorizontal: 26,
        borderRadius: 30,
    },
    updateButtonText: {
        color: "#FFFFFF",
        fontSize: 13,
        fontWeight: "Inter-Medium",
    },
    circle: {
        alignSelf: "center",
        marginTop: "10%",
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 3,
        borderColor: "#ABABAB",
        position: 'relative',
        marginBottom: 25,
    },
    pfp: {
        width: '100%', 
        height: '100%', 
        borderRadius: 50, 
        resizeMode: 'cover', 
    },
    greenPencilIcon: {
        position: 'absolute',
        bottom: -18,
        right: -5,
    },
    changePasswordButton: {
        flexDirection: 'row',
        justifyContent: "space-between",
        marginHorizontal: 35,
        paddingTop: 16,
        paddingBottom: 8,
        paddingHorizontal: 2,
    },
    changePasswordButtonText: {
        color: "#FFFFFF",
        fontSize: 18,
        fontFamily: "Inter-Regular",
    },
    actionContainer: {
        marginTop: 10,
        marginBottom: 30,
    },
    actionButton: {
        flexDirection: 'row',
        marginHorizontal: 20,
        paddingVertical: 16,
        paddingHorizontal: 2,
    },
    actionButtonText:{
        color: "#FFFFFF",
        fontSize: 20,
        fontFamily: "Inter-Regular",
        paddingLeft: 15,
    },

    gradientLine: {
        alignSelf: "center",
        
    },
    deleteAccountButton: {
        flexDirection: 'row',
        justifyContent: "space-between",
        marginHorizontal: 35,
        paddingVertical: 16,
        paddingHorizontal: 2,
    },
    deleteAccountButtonText: {
        color: 'red',
        fontSize: 20,
        fontFamily: "Inter-Regular",
    },
    logoutButton: {
        flexDirection: 'row',
        justifyContent: "space-between",
        marginHorizontal: 35,
        paddingVertical: 16,
        paddingHorizontal: 2,
    },
    logoutButtonText: {
        color: "#FFFFFF",
        fontSize: 20,
        fontFamily: "Inter-Regular",
    },
})