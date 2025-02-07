import React, { useEffect, useState,useRef } from 'react';
import Svg, { Circle } from "react-native-svg";
import { Text, View ,Button,Image, StyleSheet, TouchableOpacity, Modal} from 'react-native';
import { Camera, useCameraDevice } from 'react-native-vision-camera';
import ImageResizer from 'react-native-image-resizer';
import RNFS from 'react-native-fs';
import { SvgUri } from "react-native-svg";
import { cameraCancel, flipCamera } from "../../utils/icons";

// Custom take photo icon
const CustomCameraIcon = () => (
    <Svg width="60" height="60" viewBox="0 0 24 24" fill="none">
        <Circle cx="12" cy="12" r="10" stroke="white" strokeWidth="2" />
        <Circle cx="12" cy="12" r="8" fill="white" />
    </Svg>
);

const CameraModal = ({ isVisible, onPhotoConfirmed, onClose }) => {
    const [cameraPermission, setCameraPermission] = useState(null);
    const backDevice = useCameraDevice('back');
    const frontDevice = useCameraDevice('front');
    const [device, setDevice] = useState(backDevice);
    const camera = useRef(null);
    const [capturedPhoto, setCapturedPhoto] = useState(null);
    const [showPreview, setShowPreview] = useState(false);
    const [base64Image, setBase64Image] = useState(null);
  
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

    if (!device) {
        return null;
        //return <Text>No camera device available</Text>;
    }

    const flipCameras = () => {
        if (device?.position === 'back') {
            setDevice(frontDevice); 
        } else {
            setDevice(backDevice);
        }
    };

    const takePhoto = async () => {
        try {
            if (!camera.current) {
                console.error('Camera reference not available.', camera);
                return;
            }

            const photo = await camera.current.takePhoto({
                qualityPrioritization: 'balanced',
            });
            console.log('Captured photo:', photo);
        
            if (photo && photo.path) {
                // Manipulate image (resize and compress)
                const resizedImage = await ImageResizer.createResizedImage(
                    photo.path,
                    600,
                    600,
                    'JPEG',
                    80 // Compression quality
                );

                // Convert the resized image to base64 format
                const base64Image = await RNFS.readFile(resizedImage.uri, 'base64');

                setCapturedPhoto(resizedImage.uri); 
                setBase64Image(base64Image);
                setShowPreview(true);
            } else {
                console.error('No URI found in the captured photo');
            }
        } catch (error) {
            console.error('Error capturing photo:', error);
        }
    };

    const confirmPhoto = () => {
        if (base64Image && capturedPhoto) {
            onPhotoConfirmed({
                uri: capturedPhoto,  
                base64: base64Image  
            });
            onClose(); // Close the modal
        }
        console.log('Photo confirmed:', capturedPhoto);
        setShowPreview(false); 
    };

    const retakePhoto = () => {
        setCapturedPhoto(null); 
        setShowPreview(false); 
    };

    return (
        <Modal
            visible={isVisible} 
            transparent={true} 
            animationType="slide" 
            onRequestClose={onClose} 
        >
            <View style={styles.modalContainer}>
                {showPreview ? (
                // Render the full-screen preview image only
                <View style={styles.previewContainer}>
                    <Image
                        source={{ uri: capturedPhoto }}
                        style={styles.capturedPhoto}
                    />
                    <View style={styles.previewButtonContainer}>
                        <Button title="Retake" onPress={retakePhoto} />
                    <View style={{ width: 20 }} />
                        <Button title="Confirm" onPress={confirmPhoto} />
                    </View>
                </View>
                ) : (
                // Render the Camera only when `showPreview` is false
                <View style={styles.cameraContainer}>
                    <Camera
                        style={{ flex: 1 }}
                        device={device}
                        isActive={!showPreview} 
                        ref={camera}
                        photo={true}
                    />
                    <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                        <SvgUri uri={cameraCancel} size={40} color="white" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.captureButton} onPress={takePhoto}>
                        <CustomCameraIcon size={40} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.flipButton} onPress={flipCameras}>
                        <SvgUri uri={flipCamera} size={40} />
                    </TouchableOpacity>
                    </View>
                </View>
                )}
            </View>
        </Modal>
    );
};

export default CameraModal;

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
        overflow: 'hidden', 
    },
    previewContainer: {
        flex: 1,
        justifyContent: 'center',  
        alignItems: 'center',
        width: '100%',
        height: '100%',
    },
    previewButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        width: '100%',
        paddingVertical: 10,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
    },
    capturedPhoto: {
        width: '100%', 
        height: '90%', 
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    buttonContainer: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
    },
    cancelButton: {
        paddingTop: 10,
        paddingRight: 30,
    },
    captureButton: {
        position: 'absolute',
        bottom: 20,
        alignSelf: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
    },
    flipButton: {
        position: 'absolute',
        top: 20,
        right: 20,
    }
})