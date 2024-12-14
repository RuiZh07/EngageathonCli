// first sign up screen, modify the handle register later!!!
import React, { useState } from "react";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { useNavigation } from "@react-navigation/native";
import {
    StyleSheet,
    Image,
    Text,
    View,
    TouchableOpacity,
    ImageBackground,
    KeyboardAvoidingView,
} from "react-native";
import MainButton from "../../components/common/MainButton";
import authService from "../../services/authService";

export default function Signup () {
    const navigation = useNavigation();
    const [selectedAccountType, setSelectedAccountType] = useState("");
    const [acceptTerms, setAcceptTerms] = useState(false);
    const handleRegister = async () => {
        if (!selectedAccountType) {
          alert("Please select an account type");
          return;
        }
        if (!acceptTerms) {
            alert("Please accept the terms and conditions");
            return;
        }
        const typeInput = accountTypeInput(selectedAccountType);
        navigation.navigate("AccountTypeSignup", { typeInput })
    };

    const handleLogin = () => {
        navigation.navigate("Login");
    };

    const accountTypeInput = (selectedAccountType) => {
        switch (selectedAccountType) {
            case "Individual":
                return "IN";
            case "Organization":
                return "OR";
            case "Government":
                return "GO";
            case "University":
                return "UN";
            case "Non-Profit":
                return "NO";
            case "Corporation":
                return "CO";
            default:
                return "";
        }
      };

    //console.log("sel", selectedAccountType);
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
                    <Text style={styles.heading}>Sign up</Text>
                    <Text style={styles.createAccountText}>Create Your Account</Text>
                    <Text style={styles.selectAccountText}>Select Account Type</Text>
                    <View style={styles.accountTypeContainer}>
                        {['Individual', 'University', 'Organization', 'Non-Profit', 'Corporation', 'Government'].map(accountType =>
                        <View style={styles.accountTypeSelectionChoice} key={accountType}>
                            <TouchableOpacity
                                style={styles.selectionOuter}
                                onPress={() => setSelectedAccountType(accountType)}
                            >
                                {selectedAccountType === accountType && <View style={styles.selectionInner}></View>}
                            </TouchableOpacity>
                            <Text style={styles.accountTypeText}>{accountType}</Text>
                        </View>)}
                    </View>

                    <View style={styles.agreeContainer}>
                        <BouncyCheckbox 
                            size={20} 
                            iconStyle={{ borderColor: "red" }}
                            onPress={() => setAcceptTerms(!acceptTerms)} />
                        <Text style={styles.agreeText}>I agree to the terms and conditions</Text>
                    </View>
                    
                    <MainButton onPress={handleRegister} title="Continue" />

                    <View style={styles.centeredContainer}>
                        <View style={styles.line} />
                        <Text style={styles.continueText}>Or continue with</Text>
                        <View style={styles.line} />
                    </View>

                    <View style={styles.centeredContainer}>
                        <TouchableOpacity style={styles.googleFacebook}>
                            <Image source={require("../../assets/google-logo.png")}></Image>
                            <Text style={styles.googleFacebookText}>Google</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.googleFacebook}>
                            <Image source={require("../../assets/facebook-logo.png")}></Image>
                            <Text style={styles.googleFacebookText}>Facebook</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.centeredContainer}>
                        <Text style={styles.alreadyText}>Already have an account?</Text>
                        <TouchableOpacity onPress={handleLogin}>
                            <Text style={styles.loginText}>Login</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ImageBackground>
        </KeyboardAvoidingView>
    )
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
        paddingTop: "8%",
        paddingBottom: "7%",
        marginHorizontal: "4%",
        borderRadius: 40,
        paddingHorizontal: "7%",
    },
    heading: {
        alignSelf: "flex-start",
        fontSize: 38,
        fontFamily: "Poppins-Bold",
        color: "#FF8D00",
    },
    createAccountText: {
        alignSelf: "flex-start",
        fontSize: 15,
        color: "#414141",
        fontFamily: "Inter-Medium",
        marginTop: 5, 
        marginBottom: 30
    },
    selectAccountText: {
        alignSelf: "flex-start",
        fontSize: 15,
        color: "#414141",
        fontFamily: "Inter-SemiBold",
        marginBottom: 20,
    },
    accountTypeContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        width: "100%",
    },
    accountTypeSelectionChoice: {
        textAlign: "center",
        flexDirection: "row",
        width: "50%",
        marginBottom: 15,
    },
    selectionOuter: {
        width: 20,
        height: 20,
        borderWidth: 3,
        borderRadius: 8,
        borderColor: "#A3A3A3",
        justifyContent: "center",
        alignItems: "center",
    },
    selectionInner: {
        width: 10,
        height: 10,
        borderRadius: 4,
        backgroundColor: "#A3A3A3",
    },
    accountTypeText: {
        marginLeft: 10,
        fontFamily: "Inter-Regular",
        fontSize: 13,
    },
    agreeContainer: {
        display: "flex",
        flexDirection: "row",
        marginVertical: 30,
    },
    agreeText: {
        fontSize: 16,
        color: "#414141",
        fontSize: 13, 
        marginTop: 2, 
        marginLeft: -5,
        fontFamily: "Inter-Medium",
    },
    centeredContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginVertical: 10,
    },
    continueText: {
        fontSize: 15,
        color: "#ABABAB",
        fontFamily: "Inter-Medium",
    },
    line: {
        backgroundColor: "#C4C4C4",
        height: 1,
        width: "22%",
        marginHorizontal: "2%",
    },
    googleFacebook: {
        width: "45%",
        height: 45,
        backgroundColor: "#F3F3FC",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
        borderRadius: 10,
        marginHorizontal: "3%",
      },
    googleFacebookText: {
        fontSize: 11,
        color: "#1D1C2B",
        marginLeft: "8%",
        fontFamily: "Inter-Medium",
    },
    alreadyText: {
        fontSize: 14,
        color: "#ABABAB",
        fontFamily: "Inter-Medium",
    },
    loginText: {
        fontSize: 14,
        paddingLeft: 10,
        color: "#FF8D00",
        fontFamily: "Inter-Medium",
    }

})