import React, { useEffect, useState } from "react";
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    ImageBackground,
    KeyboardAvoidingView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import authService from "../../services/authService";
import { Alert } from "react-native";
import MainButton from "../../components/common/MainButton";
import { userRoundedIcon } from "../../utils/icons";
import { SvgUri } from "react-native-svg";
export default function ForgotPassword() {
    const [userEmail, setUserEmail] = useState({
        email: "",
    });

    const navigation = useNavigation();

    function handleSignUp() {
        navigation.navigate("Signup");
    }

    const handleForgotPassword = async () => {
        console.log("Reset pass req:", userEmail.email);
        if (!userEmail.email) {
            Alert.alert("Error", "Please enter your email.");
            return;
        }
        console.log("Submitting reset password request with email:", userEmail.email);
        try {
            await authService.resetPassword(userEmail.email.toLowerCase());
            Alert.alert(
                "Password Reset Successful!",
                "Please check your email for further instructions. \nNote: It may take a few minutes for the email to arrive."
            );
            navigation.navigate("CodeVerificationScreen", {email: userEmail.email.toLowerCase() });
        } catch (error) {
            Alert.alert("Password Reset Failed", "Please try again.");
        }
    };

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
                    <Text style={styles.heading}>Forgot Password?</Text>
                    <Text style={styles.subheadingLeft}>
                       Enter your email to reset your password.
                    </Text>

                    <View style={styles.inputContainer}>
                    <SvgUri 
                        uri={userRoundedIcon} 
                        width="24"
                        height="22" 
                    />
                        <TextInput
                            style={styles.input}
                            onChangeText={(e) =>
                                setUserEmail((prevEmailInfo) => ({
                                    ...prevEmailInfo,
                                    email: e,
                                }))
                            }
                            value={userEmail.email}
                            placeholder="Enter Phone or Email"
                        />
                    </View>

                    <MainButton
                        onPress={handleForgotPassword}
                        title="Send Link"
                    />

                    <View style={styles.centeredContainer}>
                        <Text style={styles.subheadingCenter}>Don’t have an account? </Text>
                        <TouchableOpacity onPress={handleSignUp}>
                            <Text style={[styles.subheadingCenter, { color: "#FF8D00" }]}>
                                Sign up
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ImageBackground>
        </KeyboardAvoidingView>

    );
}

const styles = StyleSheet.create({
    // Prevent keyboard from moving styling components up on Android devices
    avoidView: {
        width: "100%",
        height: "100%",
        maxWidth: "100%",
    },
    // White rectangle
    container: {
        backgroundColor: "#FFFFFF",
        height: "70%",
        maxHeight: "70%",
        alignItems: "center",
        paddingTop: "9%",
        paddingBottom: "7%",
        paddingHorizontal: "9%",
        marginHorizontal: "4%",
        borderRadius: 40,
    },

    // Icon + TextInput container
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
        borderWidth: 1,
        borderColor: "#D6D6D6",
        borderRadius: 10,
        paddingVertical: "6%",
        paddingHorizontal: "5%",
        marginVertical: 30,
        width: '95%',
    },

    // TextInput components
    input: {
        width: "90%",
        paddingLeft: "2%",
        fontFamily: "Inter-Medium",
        color: "#000000",
        fontSize: 15,
    },

    // Container
    centeredContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginTop: 30,
    },

    // "Forgot Password" text
    heading: {
        alignSelf: "flex-start",
        fontSize: 40,
        color: "#FF8D00",
        fontFamily: "Poppins-Bold",
        lineHeight: 43,
        marginBottom: 10,
    },

    subheadingLeft: {
        alignSelf: "flex-start",
        fontSize: 15,
        color: "#414141", 
        fontFamily: "Inter-Medium"
    },

    // "Or continue with" and "Already have an account? Login"
    subheadingCenter: {
        fontSize: 16,
        color: "#ABABAB",
    },

    // Lines surrounding "Or continue with"
    line: {
        backgroundColor: "#C4C4C4",
        height: 1,
        width: "22%",
        marginHorizontal: "2%",
    },

    // "Google" and "Facebook" buttons
    googleFacebook: {
        width: "38%",
        height: 45,
        backgroundColor: "#F3F3FC",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
        borderRadius: 10,
        marginHorizontal: "2.5%",
    },

    // "Google" and "Facebook" text
    googleFacebookText: {
        fontSize: 12,
        color: "#1D1C2B",
        marginLeft: "8%",
    },
});
