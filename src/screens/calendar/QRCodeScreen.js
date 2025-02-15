import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import SvgQRCode from 'react-native-qrcode-svg';
import QRCode from 'react-native-qrcode-svg';
import { backArrow } from '../../utils/icons';
import { SvgUri } from "react-native-svg";
import LinearGradient from "react-native-linear-gradient";
import MainButton from '../../components/common/MainButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiClient from '../../services/apiClient';
import baseUrl from '../../utils/api';
const QRCodeScreen = () => {
    const [qrCodeToken, setQrCodeToken] = useState(null);
    const navigation = useNavigation();
    const route = useRoute();
    const { event } = route.params;

    useEffect(() => {
        const fetchQrCode = async () => {
            try {
                const token = await AsyncStorage.getItem("AccessToken");

                const response = await apiClient.get(`${baseUrl}/events/qrcode/${event.id}/`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                console.log(response.data);
                if (response.data) {
                    setQrCodeToken(response.data["QR Code"]);
                    console.log("Fetched QR Code Token:", response.data);
                } else {
                    console.log("Error: QR Code not found.");
                }
            } catch (error) {
                console.error("Error fetching QR code:", error);
            }
        };
        fetchQrCode();
    }, []);

    return (
        <ImageBackground source={require('../../assets/main-background.png')} style={styles.backgroundImage}>
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <SvgUri uri={backArrow} />
                </TouchableOpacity>
                <Text style={styles.headerText}>Great!</Text>
            </View>
            <View style={styles.container}>
                <Text style={styles.instructions}>Show this QR code to the{"\n"}coordinator to check in.</Text>
                <View style={styles.qrCodeContainer}>
                    <LinearGradient
                        colors={["#FF8D00", "#FFBA00", "#FFE600"]}
                        locations={[0.72, 0.86, 1]}  
                        start={{ x: 0, y: 0 }}      
                        end={{ x: 1, y: 0 }}
                        style={styles.qrCodeLinearGradient}
                    >
                        <View style={styles.qrCodeOutline}>
                            {qrCodeToken ? (
                                <QRCode 
                                    value={qrCodeToken}
                                    size={250}
                                />
                            ) : (
                                <SvgQRCode value={event.qr_code} size={250} />
                            )}
                        </View>
                    </LinearGradient>
                </View>
                <MainButton 
                    onPress={() => navigation.navigate('EventHubScreen', { event })}
                    title="Event Hub"
                />
            </View>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    backgroundImage: {
        flex: 1,
        width: '100%',
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        width: '100%',
        paddingHorizontal: '5%',
        marginTop: 20, 
        marginBottom: 20,
        marginTop: '15%',
    },
    headerText: {
        color: '#FFE600',
        fontSize: 24,
        fontFamily: "Poppins-Medium",
        marginLeft: 20,
    },
    container: {
        flex: 1,
        alignItems: 'center',
    },
    instructions: {
        color: '#FFFFFF',
        fontSize: 18,
        marginVertical: 20,
        textAlign: 'left',
        paddingHorizontal: 45,
        width: "100%",
        fontFamily: "Poppins-Medium",
    },
    qrCodeContainer: {
        marginTop: 60,
        marginBottom: 40,
    },
    qrCodeOutline: {
        padding: 20,
        borderRadius: 20,
        backgroundColor: '#FFFFFF',
    },
    qrCodeLinearGradient: {
        borderRadius: 20,
        padding: 4,
    },
    eventHubButton: {
        backgroundColor: '#FF8D00',
        paddingVertical: 15,
        paddingHorizontal: 75,
        borderRadius: 10,
        marginTop: 20,
    },
    eventHubButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default QRCodeScreen;