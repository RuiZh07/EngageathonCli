import React, { useEffect, useState, useRef } from "react";
import {
    StyleSheet,
    Image,
    Text,
    View,
    TouchableOpacity,
    ImageBackground,
    Alert,
    TextInput,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from "@react-navigation/native";
import { SvgUri } from "react-native-svg";
import {  
    backArrow,
    checkmark,
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
import { useRoute } from "@react-navigation/native";
import apiClient from "../../services/apiClient";

export default function SettingScreen () {
    const [userData, setUserData] = useState("");
    const [profileImage, setProfileImage] = useState(null);
    const [fullName, setFullName] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setLoading] = useState(false);
    const navigation = useNavigation();
    const inputRef = useRef(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = await AsyncStorage.getItem("AccessToken");
                if(!token) {
                    console.error("no token found");
                    return;
                }

                const response = await apiClient.get(`${baseUrl}/user-content/?content_types=event`, {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                    },
                });
    
                setUserData(response.data[0]);
            } catch (error) {
                console.error("error to fetch recommended users", error);
            } finally {
              setLoading(false); 
            }
        };
          fetchUserData();
    }, []);

    const updateName = async () => {
        try {
            const token = await AsyncStorage.getItem("AccessToken");
            if(!token) {
                console.error("no token found");
                return;
            }
            const [firstName='', lastName=''] = fullName.split(' ', 2);

            const data = {
                first_name: firstName.trim(),
                last_name: lastName.trim(),
            }
            const response = await apiClient.put(`${baseUrl}/users/update_name/`, data, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
            });

            if (response.status === 200) {
                console.log(response.data.message);
            } else {
                console.error("Failed to update name:", response.status);
                Alert.alert("Error", "Failed to update name. Please try again.")
            }
        } catch (error) {
            console.error("error to update name", error);
        }
    };

    const handleEditStart = () => {
        setIsEditing(true);
        
        setTimeout(() => {
            inputRef.current?.focus();
        }, 0);
    };

    const handleSave = () => {
        updateName();
        setIsEditing(false);
    }

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

    const uploadProfileImage = async (base64) => {
        try {
            const token = await AsyncStorage.getItem("AccessToken");
            if (!token) {
                console.error("No token found");
                return;
            }
            console.log(base64);
            //const base64Image = await RNFS.readFile(uri, 'base64');
            //const urlEncodedImage = encodeURIComponent(base64Image);
            //const data = {image: base64Image};

            await apiClient.put(`${baseUrl}/profile_image/`, `image=${base64}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            });
            Alert.alert('Profile image uploaded successfully');
        } catch (error) {
            console.error("Error uploading profile image:", error);
            Alert.alert("Error", "Failed to upload profile image");
        }
    };
    console.log(profileImage);

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
                            const base64Image = await RNFS.readFile(resizedImage.uri, 'base64');
                            setProfileImage(base64Image);
                            await uploadProfileImage(base64Image);

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
                {/*
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
                */}
            </View>

            <TouchableOpacity onPress={handleImagePick} style={styles.circle}>
                <Image
                    source={userData.profile_photo ? { uri: userData.profile_photo } : require("../../assets/default_profile.png")}
                    style={styles.pfp}
                />
                <Image 
                    source={require("../../assets/icons/green-pencil.png")} 
                    style={styles.greenPencilIcon} 
                />
            </TouchableOpacity>
            <View style={styles.changeNameContainer}> 
                {isEditing ? (
                    <TextInput 
                        ref={inputRef}
                        style={styles.changeNameButtonText}
                        value={fullName}
                        onChangeText={setFullName}
                        onBlur={handleSave}
                    />
                ) : (
                    <Text style={styles.changeNameButtonText}>{`${userData.first_name} ${userData.last_name}`}</Text>
                )}
                
                <TouchableOpacity style={styles.changePasswordButton} onPress={isEditing? handleSave : handleEditStart}>
                    <SvgUri uri={isEditing? checkmark : pencilIcon} />
                </TouchableOpacity>
            </View>
            <SvgUri uri={gradientLine} style={styles.gradientLine} /> 
            <TouchableOpacity style={styles.changePasswordButton} onPress={() => navigation.navigate('ChangePasswordScreen', { email: userData.email })}>
                <Text style={styles.changePasswordButtonText}>Change Password</Text>
                <SvgUri uri={pencilIcon} />
            </TouchableOpacity>
            <SvgUri uri={gradientLine} style={styles.gradientLine} /> 

            <View style={styles.actionContainer}>
                <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate("InviteContactScreen")}>
                    <SvgUri uri={inviteIcon} width={28} />
                    <Text style={styles.actionButtonText}>Invite Contacts</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate("PrivacyPolicyScreen")}>
                    <SvgUri uri={privacyPolicyIcon} width={26}/>
                    <Text style={styles.actionButtonText}>Read Privacy Policy</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate("BecomeMemberScreen")}>
                    <SvgUri uri={becomeMemberIcon} />
                    <Text style={styles.actionButtonText}>Become a Member</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate("AccountPrivacy")}>
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
        marginTop: Platform.OS === "android" ? "6%": "15%",
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
    changeNameContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: "space-between",
        marginLeft: 35,
        paddingTop: 16,
        paddingBottom: 8,
        paddingHorizontal: 2,
    },
    changeNameButtonText: {
        color: "#FFFFFF",
        fontSize: 18,
        fontFamily: "Inter-Regular",
        paddingTop: 18,
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