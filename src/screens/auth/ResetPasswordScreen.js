import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    ImageBackground,
    KeyboardAvoidingView
} from "react-native";
import apiClient from "../../services/apiClient";
import { useNavigation } from "@react-navigation/native";
import baseUrl from "../../utils/api";
import { eyeCloseIcon, eyeIcon, lockIcon } from "../../utils/icons";
import { SvgUri } from "react-native-svg";
import MainButton from "../../components/common/MainButton";
import axios from 'axios';

const ResetPasswordScreen = ({ route }) => {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showCPassword, setShowCPassword] = useState(false);
    const navigation = useNavigation();
    const { email, code } = route.params || {};

    const validatePassword = (password) => {
        return password.length >= 12;
    };

    const handlePasswordReset = async () => {
        if (password !== confirmPassword) {
            Alert.alert("Error", "Passwords do not match.");
            return;
        }

        if (!validatePassword(password)) {
            Alert.alert("Error", "Password must be at least 12 characters long.");
            return;
        }

        try {
            const formData = new URLSearchParams();
            formData.append('new_password', password);
            formData.append('confirm_password', confirmPassword);
            formData.append('code', code)
            const response = await axios.put(`${baseUrl}/auth/password/reset/`, formData.toString(),
            {
                headers: 
                {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            });

            Alert.alert("Success", "Password has been reset.");
            navigation.navigate("Login"); // Navigate to login screen after success
        } catch (error) {
            console.error("Password reset failed:", error.response?.data || error.message);
            Alert.alert("Error", "Password reset failed. Please try again.");
        }
    };

    return (
        <KeyboardAvoidingView style={styles.avoidView} behavior="position">
            <ImageBackground
                source={require("../../assets/signup-bg1.png")} // Use the same background image
                style={{ height: "100%", justifyContent: "flex-end" }}
            >
                <View style={styles.container}>
                    <Text style={styles.heading}>Reset Your Password</Text>
                    <Text style={styles.subheading}>
                        The password must be different from previous passwords and at least 12 characters long.
                    </Text>
                    <View style={styles.passwordContainer}>
                        <SvgUri 
                            uri={lockIcon} 
                            width="24"
                            height="18" 
                        />
                        <TextInput
                            style={[styles.input, { flex: 1 }]}
                            placeholder="Enter Password"
                            secureTextEntry={!showPassword}
                            value={password}
                            onChangeText={setPassword}
                            placeholderTextColor="#ABABAB"
                        />
                        <TouchableOpacity
                            onPress={() => setShowPassword(!showPassword)}
                            style={styles.eyeIconButton}
                        >
                            <SvgUri
                            uri={showPassword ? eyeIcon : eyeCloseIcon}
                            width="21"
                        />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.passwordContainer}>
                        <SvgUri 
                            uri={lockIcon} 
                            width="24"
                            height="18" 
                        />
                        <TextInput
                            style={[styles.input, { flex: 1 }]}
                            placeholder="Confirm Password"
                            secureTextEntry={!showCPassword}
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            placeholderTextColor="#ABABAB"
                        />
                        <TouchableOpacity
                            onPress={() => setShowCPassword(!showCPassword)}
                            style={styles.eyeIconButton}
                        >
                            <SvgUri
                                uri={showCPassword ? eyeIcon : eyeCloseIcon}
                                width="21"
                            />
                        </TouchableOpacity>
                    </View>

                    <MainButton 
                        style={styles.mainButton} 
                        onPress={handlePasswordReset} 
                        title="Reset Password" 
                    />
                    {/*
                    <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                        <Text style={styles.loginText}>Already have an account? Login</Text>
                    </TouchableOpacity>
                */}
                </View>
            </ImageBackground>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    avoidView: {
        width: "100%",
        height: "100%",
        maxWidth: "100%",
    },
    container: {
        backgroundColor: "#FFFFFF",
        height: "70%",
        maxHeight: "70%",
        alignItems: "center",
        paddingTop: "9%",
        paddingBottom: "7%",
        paddingHorizontal: "7%",
        marginHorizontal: "4%",
        borderRadius: 40,
    },
    heading: {
        fontSize: 24,
        fontFamily: "Poppins-Bold",
        color: "#FF8D00",
        marginBottom: 10,
        textAlign: "left",
    },
    subheading: {
        fontSize: 13,
        color: "#414141",
        marginBottom: 20,
        textAlign: "left",
        //width: "80%",
        fontFamily: "Inter-Medium",
    },
    input: {
        width: "80%",
        paddingLeft: "2%",
    },
    passwordContainer: {
        flexDirection: "row",
        alignItems: "center",
        borderColor: "#D6D6D6",
        borderWidth: 1,
        borderRadius: 10,
        marginBottom: 20,
        width: '95%',
        height: '10%',
        paddingVertical: "6%", 
        paddingHorizontal: "5%",
    },
    mainButton: {
        width: "95%"
    },
    eyeIconButton: {
        paddingHorizontal: 10,
        justifyContent: 'center',
    },
    loginText: {
        color: "#00A000",
        textAlign: "center",
    },
});

export default ResetPasswordScreen;