import React, { useState } from "react";
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    ImageBackground,
    KeyboardAvoidingView,
    ActivityIndicator,
    Platform,
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import authService from "../../services/authService";
import Alert from "../../components/common/Alert";
import { userRoundedIcon, lockIcon, eyeCloseIcon, eyeIcon } from "../../utils/icons";
import { SvgUri } from "react-native-svg";
import MainButton from "../../components/common/MainButton";

export default function Login() {
    const [loginInfo, setLoginInfo] = useState({
        email: "",
        password: "",
    });
    const navigation = useNavigation();
    const [showPassword, setShowPassword] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [isLoading, setLoading] = useState(false);

    useFocusEffect(
        React.useCallback(() => {
            // Clear email and password fields when the screen is focused
            setLoginInfo({ email: "", password: "" });
            setLoading(false); // Ensure loading state is reset when screen is focused
        }, [])
    );

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleLogin = async () => {
        if (!loginInfo.email || !loginInfo.password) {
            setAlertMessage("Please enter your credentials.");
            return;
        }
        if (validateEmail(loginInfo.email)) {
            setAlertMessage("");
        } else if (isNaN(loginInfo.email)) {
            setAlertMessage("Please enter a valid email address or phone number.");
            return;
        }
        try {
            setLoading(true);
            const { userData } = await authService.login(
                //loginInfo.email.toLowerCase(),
                loginInfo.email,
                loginInfo.password
            );
            setLoading(false);
            navigation.navigate("InvitationScreen", {
                userEmail: loginInfo.email,
                userData: userData,
            });
        } catch (error) {
            setLoading(false);
            if (error.response && error.response.data) {
                setAlertMessage(error.response.data.error);
            } else {
                setAlertMessage("Failed to login!");
            }
        }
    };

    const closeAlert = () => {
        setAlertMessage("");
    };

    function handleSignUp() {
        navigation.navigate("Signup");
    }

    function handleForgotPassword() {
        navigation.navigate("ForgotPassword");
    }

    return (
        <KeyboardAvoidingView style={styles.avoidView} behavior="position">
            <ImageBackground
                source={require("../../assets/signup-bg1.png")}
                style={{ height: "100%", justifyContent: "flex-end" }}
            >
                <View style={styles.container}>
                    {alertMessage ? (
                        <Alert message={alertMessage} onClose={closeAlert} />
                    ) : null}
                    <Text style={styles.heading}>Login</Text>
                    <Text style={styles.subheadingLeft}>
                        Please login to continue
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
                                setLoginInfo((prevLoginInfo) => ({
                                ...prevLoginInfo,
                                email: e.toLowerCase(),
                                }))
                            }
                            value={loginInfo.email}
                            placeholder="Enter Phone or Email"
                            placeholderTextColor="#ABABAB"
                        />
                    </View>
                    <View style={styles.passwordContainer}>
                        <SvgUri 
                            uri={lockIcon} 
                            width="24"
                            height="18" 
                        />
                        <TextInput
                            secureTextEntry={!showPassword}
                            style={styles.passwordInput}
                            onChangeText={(e) =>
                                setLoginInfo((prevLoginInfo) => ({
                                ...prevLoginInfo,
                                password: e,
                                }))
                            }
                            value={loginInfo.password}
                            placeholder="Enter Password"
                            placeholderTextColor="#ABABAB"
                        />
                        <TouchableOpacity
                            style={styles.eyeIcon}
                            onPress={() => setShowPassword(!showPassword)}
                        >
                        <SvgUri
                            uri={showPassword ? eyeIcon : eyeCloseIcon}
                            width="21"
                        />
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity
                        onPress={handleForgotPassword}
                        style={{ alignItems: "flex-end", width: "100%" }}
                    >
                        <Text style={styles.forgotPasswordText}>
                            Forgot Password?
                        </Text>
                    </TouchableOpacity>
                    <MainButton
                        style={styles.mainButton}
                        onPress={handleLogin}
                        title={!isLoading ? 'Login' : 'Loading...'}
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
        position: "relative",
    },
    backButton: {
        alignSelf: "flex-start",
        marginLeft: "9%",
        marginTop: 5,
        marginBottom: 10,
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        borderWidth: 1,
        borderColor: "#D6D6D6",
        borderRadius: 10,
        paddingVertical: Platform.OS === "android" ? 8 : "6%",
        paddingHorizontal: Platform.OS === "android" ? 15 : "5%",
        marginBottom: 15,
        width: '95%',
    },
    input: {
        fontFamily: "Inter-Medium",
        width: "90%",
        paddingLeft: "2%",
        color: "#000000",
        fontSize: 15,
    },
    passwordContainer: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#D6D6D6",
        borderRadius: 10,
        paddingVertical: Platform.OS === "android" ? 8 : "6%",
        paddingHorizontal: Platform.OS === "android" ? 15 : "5%",
        position: "relative",
        marginBottom: 10,
        width: '95%',
    },
    passwordInput: {
        fontFamily: "Inter-Medium",
        width: "80%",
        paddingLeft: "2%",
        color: "#000000",
        fontSize: 15,
    },
    centeredContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginTop: 30,
    },
    heading: {
        alignSelf: "flex-start",
        fontSize: 40,
        fontFamily: "Poppins-Bold",
        color: "#FF8D00",
        marginBottom: Platform.OS === "android" ? -5 : 5,
    },
    subheadingLeft: {
        fontFamily: "Inter-Medium",
        alignSelf: "flex-start",
        fontSize: 16,
        color: "#414141",
        marginBottom: Platform.OS === "android" ? 20 : 40,
    },
    subheadingCenter: {
        fontFamily: "Inter-Medium",
        fontSize: 16,
        color: "#ABABAB",
    },
    forgotPasswordText: {
        color: "#445BC1",
        textDecorationLine: "underline",
        fontFamily: "Inter-Medium",
        marginBottom: 30,
        marginRight: 10,
    },
    mainButton: {
        width: "95%"
    },
    line: {
        backgroundColor: "#C4C4C4",
        height: 1,
        width: "22%",
        marginHorizontal: "2%",
    },
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
    googleFacebookText: {
        fontSize: 12,
        color: "#1D1C2B",
        marginLeft: "8%",
    },
});
