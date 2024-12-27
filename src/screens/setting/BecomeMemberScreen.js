import React, { useState, useRef } from "react";
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
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import baseUrl from "../../utils/api";
import { backArrow, gradientLine } from "../../utils/icons";
import { SvgUri } from "react-native-svg";
import LinearGradient from "react-native-linear-gradient";

const BecomeMemberScreen = () => {
    const [organizationName, setOrganizationName] = useState("");
    const [industry, setIndustry] = useState("");
    const [code, setCode] = useState(["", "", "", "", ""]);
    const inputs = useRef([]);
    const navigation = useNavigation();

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
                <Text style={styles.headerText}>Become a Member</Text>
            </View>
            <SvgUri uri={gradientLine} style={styles.gradientLine} />
            <View style={styles.container}>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        value={organizationName}
                        onChangeText={setOrganizationName}
                        placeholder="Organization Name"
                        placeholderTextColor="#ABABAB"
                    />
                </View>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        value={industry}
                        onChangeText={setIndustry}
                        placeholder="Industry"
                        placeholderTextColor="#ABABAB"
                    />
                </View>
                <Text style={styles.textStyle}>Enter your verification code to gain access to private events for your corporation!</Text>
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
        marginTop: "15%",
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
        width: '90%',
        backgroundColor: '#1E1E1E',
    },
    input: {
        flex: 1,
        color: '#FFFFFF',
        fontSize: 16,
        padding: 10,
        fontFamily: "Inter-Medium",
    },
    headerText: {
        color: "#FFE600",
        fontSize: 24,
        fontFamily: "Poppins-Medium",
        paddingLeft: 15,
    },
    textStyle: {
        color: "#FFFFFF",
        fontFamily: "Poppins-Medium",
        marginHorizontal: 20,
    },
    gradientLine: {
        marginTop: 10,
        alignSelf: "center",
        marginBottom: 10,
    },
    codeInputContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 20,
        marginTop: 30,
    },
    codeInput: {
        fontSize: 24,
        textAlign: "center",
        borderColor: "#D6D6D6",
        borderWidth: 1,
        borderRadius: 10,
        width: 45, // Adjusted for individual input boxes
        height: 50, // Adjusted for input height
        marginHorizontal: 10, // Spacing between input boxes
        marginBottom: 50,
    },
});
  
export default BecomeMemberScreen;