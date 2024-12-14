import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import SvgQRCode from 'react-native-qrcode-svg';
import { backArrow } from '../../utils/icons';
import { SvgUri } from "react-native-svg";


const QRCodeScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { event } = route.params;

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
                <Text style={styles.instructions}>Show this QR code to the coordinator to check in.</Text>
                <View style={styles.qrCodeContainer}>
                <View style={styles.qrCodeOutline}>
                    <SvgQRCode value={event.qr_code} size={200} />
                </View>
                </View>
                <TouchableOpacity 
                    style={styles.eventHubButton} 
                    onPress={() => navigation.navigate('EventHubScreen', { event })}
                >
                <Text style={styles.eventHubButtonText}>Event Hub</Text>
                </TouchableOpacity>
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
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        paddingHorizontal: '5%',
        marginTop: '15%',
    },
    backButton: {
        marginTop: '-1%',
    },
    headerText: {
        color: '#FFE600',
        fontSize: 32,
        position: 'absolute',
        left: '20%',
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: -85,
    },
    instructions: {
        color: '#FFFFFF',
        fontSize: 18,
        marginVertical: 20,
        textAlign: 'left',
        paddingHorizontal: 45,
    },
    qrCodeContainer: {
        marginVertical: 20,
    },
    qrCodeOutline: {
        padding: 10,
        borderWidth: 2,
        borderColor: '#FF8D00',
        borderRadius: 10,
        backgroundColor: '#FFFFFF',
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