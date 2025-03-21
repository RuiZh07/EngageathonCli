import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ImageBackground,
    Image,
    TextInput,
    KeyboardAvoidingView,
    Alert,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import authService from '../../services/authService';

const InvitationScreen = ({ route }) => {
    const navigation = useNavigation();
    const { userEmail, userData } = route.params;
    const [email, setEmail] = useState("");

    const handleInvite = async () => {
        try {
            if (!email) {
                Alert.alert("Fill in All Fields", "Please fill in the boxes.");
                return;
            }

            await authService.invite(userEmail, email);
            console.log(`Invitation sent successfully from ${userEmail} to ${email}`);
            Alert.alert("Invitation Sent.", "Thank you for inviting!");
        } catch (error) {
            console.error("Invitation failed:", error.message);
            Alert.alert("Invitation Failed.", error.response.data.error);
        }
    };
    return (
        <KeyboardAvoidingView
            style={styles.avoidView}
            behavior="position"
        >
            <ImageBackground
                source={require("../../assets/main-background.png")}
                style={styles.backgroundImage}
            >                
                <View style={styles.invitationMainComponent}>
                    <Text style={styles.invitationText}>Would you like to invite others to sign up and join ENGAGEATHON?</Text>
                    <Image
                        style={{ width: 127, height: 127, marginVertical: 45 }}
                        source={require('../../assets/icons/Vector.png')}
                    />
                    <View style={styles.inputComponent}>
                        <TextInput
                            style={styles.invitationInput}
                            placeholder="Enter their Email"
                            value={email}
                            onChangeText={setEmail}
                            placeholderTextColor="#ABABAB"
                        />

                        <LinearGradient
                            colors={["#FF8D00", "#FFBA00", "#FFE600"]}
                            locations={[0.72, 0.86, 1]}  
                            start={{ x: 0, y: 0 }}      
                            end={{ x: 1, y: 0 }}
                            style={styles.inviteButtonGradient}
                        >
                            <TouchableOpacity
                                style={styles.inputSubmit}
                                onPress={handleInvite}
                            >
                                <Text style={styles.submitText}>Send Invite</Text>
                            </TouchableOpacity>
                        </LinearGradient>

                    </View>
                    <TouchableOpacity style={styles.skipButton} onPress={() => navigation.navigate('Tabs', { userData: userData })}>
                        <Text style={styles.skipButtonText}>Skip for now</Text>
                    </TouchableOpacity>
                </View>
            </ImageBackground>
        </KeyboardAvoidingView>

    );
};

const styles = StyleSheet.create({
    avoidView: {
        width: "100%",
        height: "100%",
    },
    backgroundImage: {
        height: "100%",
        alignItems: "center",
    },
    invitationMainComponent: {
        height: "100%",
        width: "80%",
        textAlign: "center",
        alignItems: "center",
        justifyContent: "center",
    },
    invitationText: {
        fontSize: 24,
        color: "#F1ECE6",
        textAlign: "center",
        marginBottom: 64,
        fontFamily: "Poppins-Medium",
        lineHeight: 36,
    },
    inputComponent: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
        height: "auto",
        marginTop: 84,
    },
    invitationInput: {
        backgroundColor: "white",
        borderRadius: 8,
        borderWidth: 0.5,
        width: "70%",
        paddingHorizontal: 12,

    },
    inviteButtonGradient: {
        borderRadius: 8,
        borderWidth: 0.5,
    },
    inputSubmit: {
        width: 90,
        fontSize: 12,
        height: 40,
        justifyContent: "center",
        alignItems: "center",
    },
    submitText: {
        color: "white",
        fontFamily: "Poppins-SemiBold",
    },
    skipButton: {
        marginTop: 24,
    },
    skipButtonText: {
        color: "#F1ECE6",
        fontSize: 16,
        fontFamily: "Inter-Regular",
        lineHeight: 18,
    },
});

export default InvitationScreen;