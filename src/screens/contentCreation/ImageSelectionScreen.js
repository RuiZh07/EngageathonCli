import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Image, TouchableOpacity, 
    FlatList, Button, StyleSheet, 
    Modal, ScrollView, ImageBackground } from 'react-native';
import * as ImagePicker from 'react-native-image-picker';
import ImageResizer from 'react-native-image-resizer';
import RNFS from 'react-native-fs';
import { SvgUri } from "react-native-svg";
import LinearGradient from "react-native-linear-gradient";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useRoute } from "@react-navigation/native";
import { backArrow, checkmark, whiteCheckmark } from "../../utils/icons";
import CameraModal from "../../components/common/CameraModal";

const ImageSelectionScreen = () => {
    const [photoList, setPhotoList] = useState(existingPhotoList || []);
    const [modalVisible, setModalVisible] = useState(false);
    const [photoUri, setPhotoUri] = useState(null);
    const navigation = useNavigation();
    const route = useRoute();
    const { multiPhotoList: existingPhotoList } = route.params || {};

    // take picture
    const [isCameraModalVisible, setIsCameraModalVisible] = useState(false);
    const handlePhotoConfirmed = (photo) => {
        const { uri, base64 } = photo;
        setPhotoUri(uri);
        setPhotoList((prevList) => {
            const newPhoto = {
                image_url: `${base64}`,
                cover_image: prevList.length === 0,    
                selected: true,     
            };
    
            return [...prevList, newPhoto];
        });
    
        setIsCameraModalVisible(false);
    };

    // Pick photos from photo library
    const pickImage = async () => {
        try {
            ImagePicker.launchImageLibrary(
                {
                    mediaType: 'photo',
                    includeBase64: false,
                    maxWidth: 1000,
                    maxHeight: 1000,
                    quality: 1,
                },
                async (response) => {
                    if (response.didCancel) {
                        console.log('User cancelled image picker');
                    } else if (response.errorMessage) {
                        console.error('ImagePicker Error: ', response.errorMessage);
                    } else if (response.assets && response.assets.length > 0) {
                        const selectedAsset = response.assets[0];

                        if (selectedAsset && selectedAsset.uri) {
                            const resizedImage = await ImageResizer.createResizedImage(
                                selectedAsset.uri,
                                600,
                                600,
                                'JPEG',
                                80 
                            );

                            const base64Image = await RNFS.readFile(resizedImage.uri, 'base64');
                            setPhotoUri(selectedAsset.uri);
                            setPhotoList((prevList) => {
                                const newPhoto = {
                                    image_url: `${base64Image}`,
                                    cover_image: prevList.length === 0,
                                    selected: true,
                                };

                                return [...prevList, newPhoto];
                            });

                        } else {
                            console.error('No URI found in the selected asset');
                        }
                    }
                }
            );
        } catch (error) {
            console.error('Error picking image:', error);
        }
    };
    // Update state with existingPhotoList, ensuring all items are selected
    useEffect(() => {
        if (existingPhotoList) {
            const updatedPhotoList = existingPhotoList.map((photo) => ({
                ...photo,
                selected: true, // Ensure selected is true for all photos
            }));
            setPhotoList(updatedPhotoList);
        }
    }, [existingPhotoList]);

    // Handle when a photo is added or removed
    const handleImagePress = (index) => {
        setPhotoList((prevList) => 
            prevList.map((photo, idx) => 
                idx === index ? { ...photo, selected: !photo.selected } : photo
            )
        );
    };

    // Only leave the url and cover_image and when the select is true.
    const getSelectedPhotoList = (photoList) => {
        const selectedPhotoDict = photoList
            .filter((photo) => photo.selected) // Include only selected photos
            .map(({ image_url, cover_image }) => ({
                image_url,
                cover_image,
        }));
    
        return selectedPhotoDict;
    };

    return (
        <ImageBackground
            source={require("../../assets/main-background.png")}
            style={styles.backgroundContainer}
        >
            <View style={styles.header}>
            <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => {
                        navigation.goBack();
                    }}
                >
                    <SvgUri uri={backArrow} />
                </TouchableOpacity>
                    <Text style={styles.headerText}>New Event</Text>
                    <TouchableOpacity style={styles.nextButton} onPress={() => {
                        const selectedPhotoDict = getSelectedPhotoList(photoList);
                        navigation.navigate('CreateEventScreen', { multiPhotoList: selectedPhotoDict });
                    }}>
                        <Text style={styles.nextText}>Next</Text>
                    </TouchableOpacity>
            </View>

        <View style={styles.container}>
            <TouchableOpacity style={styles.photos} onPress={() => setModalVisible(true)}>
                <View style={styles.photoContainer}>
                    <Text style={styles.addImageText}>Tap to add images</Text>
                </View>
            </TouchableOpacity>
        </View>
        <View>
            <Text style={styles.recentText}>Recents</Text>
        </View>

        <ScrollView contentContainerStyle={styles.imageGrid}>
            {photoList.map((item, index) => {
                const isSelected = item.selected;
                return (
                    <TouchableOpacity
                        key={index}
                        onPress={()=>handleImagePress(index)}
                        style={styles.imageContainer}
                    >
                        {index < 3 && <View style={styles.imageSeparator} />}
                        
                        <Image 
                            source={{ uri: `data:image/jpeg;base64,${item.image_url}` }}  
                            style={styles.recentImages}
                        />
                        <View style={[
                            styles.imageIndex,
                            isSelected && styles.selectedCircle
                            ]}
                        >
                            {isSelected && (
                                <SvgUri uri={whiteCheckmark} width={15} />
                            )}
  
                        </View>

                        <View style={styles.imageSeparator} />

                        {index % 3 !== 2 && (
                            <View style={styles.imageRightSeparator} />
                        )}
                    </TouchableOpacity>
                );
            })}
        </ScrollView>

        <Modal 
            visible={modalVisible} 
            animationType="slide" 
            transparent={true} 
            onRequestClose={() => setModalVisible(false)}
        >
            <View style={styles.modalOverlay}>
            <LinearGradient
                colors={["#FF8D00", "#FFE600"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.modalContainer}
            >
                <TouchableOpacity style={styles.modalButton} onPress={() => {setModalVisible(false); setIsCameraModalVisible(true)}}>
                <Text style={styles.modalButtonText}>Take Photo</Text>
                </TouchableOpacity>
                <View style={styles.separator} />
                <TouchableOpacity style={styles.modalButton} onPress={() => { setModalVisible(false); pickImage(); }}>
                <Text style={styles.modalButtonText}>Choose from Photo Library</Text>
                </TouchableOpacity>
                <View style={styles.separator} />
                <TouchableOpacity style={styles.modalButton} onPress={() => setModalVisible(false)}>
                <Text style={styles.modalCancelButtonText}>Cancel</Text>
                </TouchableOpacity>
            </LinearGradient>
            </View>
        </Modal>

        {/* Render CameraModal when isCameraModalVisible is true */}
        {isCameraModalVisible && (
            <CameraModal 
                onPhotoConfirmed={handlePhotoConfirmed} 
                onClose={() => setIsCameraModalVisible(false)}
            />
        )}
        </ImageBackground>
    );
    };

const styles = StyleSheet.create({
    backgroundContainer: {
        flex: 1,
    }, 
    container: {
       // flex: 1,
        padding: 16,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
        paddingHorizontal: "5%",
        marginTop: "15%",
    },  
    headerText: {
        color: "#FFE600",
        fontSize: 26,
        fontFamily: "poppins-regular",
        paddingLeft: 20,
    },
    nextButton: {
        position: 'absolute',
        right: 20,
    },
    nextText: {
        color: '#2BAB47',
        fontSize: 24,
        fontFamily: "poppins-regular",
    },
    recentText:{
        color: "#FFE600",
        fontSize: 26,
        fontFamily: "poppins-regular",
        paddingLeft: 20,
        paddingBottom: 20,
    },
    permissionContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    photos: {
        marginTop: 2,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
    },
    coverImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    placeholderText: {
        fontSize: 18,
        color: '#666',
    },
    imageGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent:'flex-start',
    },
    imageContainer: {
        width: "33.33%",
        aspectRatio: 1,
        position: 'relative',
    },
    recentImages: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
        margin: 0,
    },
    imageSeparator: {
        width: '100%',
        height: 1,
        backgroundColor: 'white',
    },
    imageRightSeparator: {
        width: 1,
        height: '100%',
        backgroundColor: 'white',
        position: 'absolute',
        right: 0,
        top: 0,
    },
    imageIndex: {
        position: 'absolute',
        top: 10,
        right: 10,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#FFF',
        zIndex: 10,
        width: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: "#FFF"
    },
    selectedCircle: {
        backgroundColor: "#2BAB47",
    },
    selectedOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    selectedText: {
        color: '#fff',
        fontSize: 24,
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        width: 220,
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 10,
        alignItems: 'center',
    },
    modalButton: {
        paddingVertical: 5,
        width: '100%',
        alignItems: 'center',
    },
    modalButtonText: {
        fontSize: 16,
        color: 'black',
    },
    modalCancelButtonText: {
        fontSize: 15,
        color: 'black',
        marginVertical: -5,
    },
    separator: {
        height: 1,
        backgroundColor: '#ddd',
        marginVertical: 10,
        width: '100%',
    },
    takePhotoContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 15,
        marginVertical: 60,
    },
    fullScreenCamera: {
        flex: 1,
        width: '100%',
        height: '100%',
        borderRadius: 30,
        overflow: 'hidden',
        position: 'relative',
    },
    camera: {
        flex: 1,
        justifyContent: 'space-between',
    },
    buttonContainer: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
    },
    cancelButton: {
        paddingTop: 10
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
    capturedImageContainer:{
        width: 350,
        height: 230,
        marginTop: 7,
        borderRadius: 20,
        //marginBottom: 0,
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
    },
    capturedImage: {
        alignSelf: 'center',
        marginTop: 6,
        width: '100%',
        height: '100%',
        borderRadius: 20,
        resizeMode: 'cover',
    },
    photoContainer: {
        width: '100%',
        alignItems: 'center',
        justifyContent: "center",
        borderWidth: 1,
        borderRadius: 20,
        marginTop: 20,
        marginBottom: 10,
        overflow: 'hidden',
        backgroundColor: 'white',
        height: 200,
    },
    addImageText:{
        fontSize: 18,
    },
});

export default ImageSelectionScreen;

