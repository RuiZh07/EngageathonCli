import React, { useState, useRef } from "react";
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
import MainButton from "../../components/common/MainButton";
import baseUrl from "../../utils/api";
import authService from "../../services/authService";

const CodeVerificationScreen = ({ route }) => {
    const [code, setCode] = useState(["", "", "", "", ""]);
    const inputs = useRef([]);
    const navigation = useNavigation();
    const { email } = route.params || {};

    if (!email) {
        console.error("Email is undefined.");
        return null;
    }

    const handleCodeChange = (index, value) => {
        if (/^\d$/.test(value)) { // Ensure the value is a digit
            const newCode = [...code];
            newCode[index] = value;
            setCode(newCode);

            // Move focus to the next input if not the last one
            if (index < 4 && value !== "") {
                inputs.current[index + 1].focus();
            }
        } else {
            if (value === "") { // Allow clearing of inputs
                const newCode = [...code];
                newCode[index] = value;
                setCode(newCode);
            }
        }
    };

    const handleVerifyCode = async () => {
        const verificationCode = code.join(""); // Join code array into a single string
    
        if (verificationCode.length !== 5) {
            Alert.alert("Error", "Please enter a 5-digit code.");
            return;
        }
    
       // console.log("Submitting reset password request with email:", email);
        //console.log("Sending verification code:", verificationCode); // Log the joined code
    
        try {
            const payload = new URLSearchParams();
            payload.append('verification_code', verificationCode);


            const response = await apiClient.post(`${baseUrl}/auth/password/reset/verify/`, `verification_code=${verificationCode}`, {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            });
            console.log("response",response);

            if (response.status === 200) {
                Alert.alert("Success", "Verification successful.");
                navigation.navigate("ResetPasswordScreen", { email, code: verificationCode }); // Pass the code here
            } else {
                Alert.alert("Error", "Verification failed. Please try again.");
                setCode(["", "", "", "", ""]); // Clear the code input
                inputs.current[0].focus(); // Focus the first input
            }
        } catch (error) {
            console.error("Verification failed:", error.response ? error.response.data : error.message);
            Alert.alert("Error", error.response?.data?.error || "Verification failed. Please try again.");
            setCode(["", "", "", "", ""]); // Clear the code input
            inputs.current[0].focus(); // Focus the first input
        }
    };
    const handleResendCode = async () => {
        try {
            await authService.resetPassword(email);
            Alert.alert("Success", "A new code has been sent to your email. Please check your inbox.");
        } catch (error) {
            Alert.alert("Error", "Failed to resend code. Please try again.");
        }
    }

    
    return (
        <KeyboardAvoidingView
            style={styles.avoidView}
            behavior="position"
        >
            <ImageBackground
                source={require("../../assets/signup-bg1.png")}
                style={{ height: "100%", justifyContent: "flex-end" }}
            >
                <View style={styles.container}>
                    <Text style={styles.heading}>Enter Verification Code</Text>
                    <Text style={styles.subheading}>
                        We have sent a code to <Text style={styles.boldText}>{email}</Text>
                    </Text>

                    <View style={styles.codeInputContainer}>
                        {code.map((digit, index) => (
                            <TextInput
                                key={index}
                                style={styles.codeInput}
                                maxLength={1}
                                keyboardType="numeric"
                                value={digit}
                                onChangeText={(value) => handleCodeChange(index, value)}
                                ref={ref => inputs.current[index] = ref}
                                onKeyPress={({ nativeEvent }) => {
                                    if (nativeEvent.key === 'Backspace' && index > 0 && code[index] === '') {
                                        inputs.current[index - 1].focus();
                                    }
                                }}
                            />
                        ))}
                    </View>
                    <MainButton  onPress={handleVerifyCode} title="Verify Now" />
                    <View style={styles.resendContainer}>
                        <Text style={styles.didnotText}>Didn't receive a code?</Text>
                        <TouchableOpacity onPress={handleResendCode}>
                            <Text style={styles.resendText}>Resend Code</Text>
                        </TouchableOpacity>
                    </View>
                    
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
        color: "#FF8D00",
        fontFamily: "Poppins-Bold",
        lineHeight: 43,
        marginBottom: 5,
    },
    subheading: {
        fontSize: 15,
        color: "#414141",
        marginBottom: 20,
        fontFamily: "Inter-Medium"
    },
    boldText: {
        fontWeight: 'bold',
    },
    codeInputContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 20,
    },
    codeInput: {
        fontSize: 24,
        textAlign: "center",
        borderColor: "#D6D6D6",
        borderWidth: 1,
        borderRadius: 10,
        width: 45, // Adjusted for individual input boxes
        height: 50, // Adjusted for input height
        marginHorizontal: 5, // Spacing between input boxes
        marginBottom: 50,

    },
    resendContainer: {
        flexDirection: 'row',
        marginTop: 20,
    },
    didnotText: {
        fontSize: 13,
        color: "#ABABAB",
        fontFamily: "Inter-Medium",
        paddingRight: 5,
    },
    resendText: {
        fontSize: 13,
        color: "#2BAB47",
        fontFamily: "Inter-Bold",
        textDecorationLine: "underline"

    },
});

export default CodeVerificationScreen;