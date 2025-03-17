import React, { useState } from "react";
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    Alert,
    ImageBackground,
    Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import baseUrl from "../../utils/api";
import { backArrow, eyeIcon, eyeCloseIcon, lockIcon, gradientLine } from "../../utils/icons";
import { SvgUri } from "react-native-svg";
import MainButton from "../../components/common/MainButton";
import apiClient from "../../services/apiClient";

const ChangePasswordScreen = () => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const navigation = useNavigation();
  
    const handleChangePassword = async () => {
        if (newPassword !== confirmPassword) {
            Alert.alert("Error", "Passwords do not match!");
            return;
        }

        if (newPassword.length < 12) {
            Alert.alert("Password too short", "Your password must be at least 12 characters long.");
            return;
        }
  
        try {
            const token = await AsyncStorage.getItem('AccessToken');
            const response = await apiClient.put(`${baseUrl}/auth/password/change/`,
                { old: currentPassword, new: newPassword },
                {
                    headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    },
                }
            );
  
            Alert.alert('Success', 'Password changed successfully!');
            navigation.goBack();
        } catch (error) {
            console.error('Error changing password:', error);
            Alert.alert('Error', 'Failed to change password. Please try again.');
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
                <Text style={styles.headerText}>Change Password</Text>
            </View>
            
            <View style={styles.container}>
            <SvgUri uri={gradientLine} />
                {/*<Text style={styles.emailText}>{email}</Text>*/}
                
                <Text style={styles.passwordTitle}>Current Password</Text>
                <View style={styles.inputContainer}>
                    <SvgUri 
                        uri={lockIcon} 
                        width="26"
                        height="20" 
                    />
                    <TextInput
                        style={styles.input}
                        value={currentPassword}
                        onChangeText={setCurrentPassword}
                        placeholder="Current Password"
                        placeholderTextColor="#ABABAB"
                        secureTextEntry={!showCurrentPassword}
                    />
                    <SvgUri 
                        uri={showCurrentPassword ? eyeIcon : eyeCloseIcon}
                        width="26"
                        height="20"
                        onPress={() => setShowCurrentPassword(!showCurrentPassword)}
                    />
                </View>
                <Text style={styles.passwordTitle}>New Password</Text>
                <View style={styles.inputContainer}>
                    <SvgUri 
                        uri={lockIcon} 
                        width="26"
                        height="20" 
                    />
                    <TextInput
                        style={styles.input}
                        value={newPassword}
                        onChangeText={setNewPassword}
                        placeholder="New Password"
                        placeholderTextColor="#ABABAB"
                        secureTextEntry={!showNewPassword}
                    />
                    <SvgUri 
                        uri={showNewPassword ? eyeIcon : eyeCloseIcon}
                        width="26"
                        height="20"
                        onPress={() => setShowNewPassword(!showNewPassword)}
                    />
                </View>
                <Text style={styles.passwordTitle}>Confirm Password</Text>
                <View style={styles.inputContainer}>
                    <SvgUri 
                        uri={lockIcon} 
                        width="26"
                        height="20" 
                    />
                    <TextInput
                        style={styles.input}
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        placeholder="Confirm Password"
                        placeholderTextColor="#ABABAB"
                        secureTextEntry={!showConfirmPassword}
                    />
                    <SvgUri 
                        uri={showConfirmPassword ? eyeIcon : eyeCloseIcon}
                        width="26"
                        height="20"
                        onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                    />
                </View>
                <MainButton
                        style={styles.mainButton}
                        onPress={handleChangePassword}
                        title="Update"
                    />
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
        //justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    emailText: {
        color: '#F5F4F4',
        fontSize: 20,
        marginBottom: 10,
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
    passwordTitle: {
        color: "#FFFFFF",
        textAlign: "left",
        fontFamily: "Inter-Medium",
        fontSize: 19,
        paddingVertical: 10,
        paddingLeft: 10,
        width: "100%",
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth:1,
        borderColor: '#D6D6D6',
        borderRadius: 12,
        marginBottom: 20,
        paddingHorizontal: 15,
        paddingVertical: 7,
        width: '95%',
        backgroundColor: '#1E1E1E',
    },
    input: {
        flex: 1,
        color: '#FFFFFF',
        fontSize: 16,
        padding: 10,
        fontFamily: "Inter-Medium",
    },
    
    updateButton: {
        backgroundColor: "#FF8D00",
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 20,
        alignItems: 'center',
    },
    updateButtonText: {
        color: '#F5F4F4',
        fontSize: 18,
    },
    updateButtonGradient: {
        borderRadius: 30,
    },
    updateButton: {
        alignItems: "center",
        justifyContent: "center",
        width: 107,
        height: 28,
        borderRadius: 30,
    },
    updateButtonText: {
        color: "#FFFFFF",
        fontSize: 13,
        fontWeight: "600",
    },
    mainButton: {
        marginTop: 30,
        width: "75%",
    },
});
  
export default ChangePasswordScreen;