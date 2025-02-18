import React, { useEffect, useState,useRef } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Modal} from 'react-native';
import {
    Camera,
    useCameraDevice,
    useCodeScanner,
} from "react-native-vision-camera";
import { cameraCancel } from "../../utils/icons";
import { SvgUri } from "react-native-svg";

const QRCodeScannerModal = ({ isVisible, onClose, onScanSuccess }) => {
    const [cameraPermission, setCameraPermission] = useState(null);
    const camera = useRef(null);

    const backDevice = useCameraDevice('back');
  
    // Get the qr code token
    const codeScanner = useCodeScanner({
        codeTypes: ['qr'],
        onCodeScanned: (codes) => {
          if (codes.length > 0 && codes[0].value) {
            onScanSuccess(codes[0].value);
            console.log('Scanned QR code:', codes[0].value);
            onClose();
          }
        },
    });

    const checkCameraPermission = async () => {
        const status = await Camera.getCameraPermissionStatus();
        if (status === 'granted') {
            setCameraPermission(true);
        } else if (status === 'notDetermined') {
            const permission = await Camera.requestCameraPermission();
            setCameraPermission(permission === 'authorized');
        } else {
            setCameraPermission(false);
        }
    };

    useEffect(() => {
        checkCameraPermission();
    }, []);

    if (cameraPermission === null) {
        return <Text>Checking camera permission...</Text>;
    } else if (!cameraPermission) {
        return <Text>Camera permission not granted</Text>;
    }

    if (!backDevice) {
        return null;
        //return <Text>No camera device available</Text>;
    }

    return (
        <Modal
            visible={isVisible} 
            transparent={true} 
            animationType="slide" 
            onRequestClose={onClose} 
        >
            <View style={styles.modalContainer}>
                <View style={styles.cameraContainer}>
                    <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                        <SvgUri uri={cameraCancel} size={40} color="white" />
                    </TouchableOpacity>
                    <Camera
                        style={{ flex: 1 }}
                        device={backDevice}
                        isActive={true} 
                        ref={camera}
                        codeScanner={codeScanner}
                    />
                </View>
            </View>
        </Modal>
    );
};

export default QRCodeScannerModal;

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 14,
        paddingVertical: 40,
        backgroundColor: '#1E1E1E',
    },
    cameraContainer: {
        width: '100%',
        height: '100%',
        borderRadius: 20, 
        position: 'relative',
    },
    cancelButton: {
        position: 'absolute',
        top: 20,
        left: 20,
        zIndex: 1,
    },

})