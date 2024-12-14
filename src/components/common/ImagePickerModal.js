import React, { useState } from 'react';
import { View, Button, StyleSheet } from 'react-native';
import * as ImagePicker from 'react-native-image-picker';
import ImageResizer from 'react-native-image-resizer';
import RNFS from 'react-native-fs';

const ImagePickerModal = ({ onImagePicked, onClose }) => {
    const [isPickingImage, setIsPickingImage] = useState(false);

    const pickImage = async () => {
        try {
            setIsPickingImage(true);

            ImagePicker.launchImageLibrary(
                {
                    mediaType: 'photo',
                    includeBase64: false, // get the base64 after manipulation
                    maxWidth: 1000,
                    maxHeight: 1000,
                    quality: 1,
                },
                async (response) => {
                    if (response.didCancel) {
                        console.log('User cancelled image picker');
                        setIsPickingImage(false);
                    } else if (response.error) {
                        console.error('ImagePicker Error: ', response.error);
                        setIsPickingImage(false);
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

                            onImagePicked(base64Image);

                            setIsPickingImage(false);
                            onClose(); 
                        } else {
                            console.error('No URI found in the selected asset');
                            setIsPickingImage(false);
                        }
                    }
                }
            );
        } catch (error) {
            console.error('Error picking image:', error);
            setIsPickingImage(false);
        }
    };

    return (
        <View style={styles.container}>
            <Button title="Pick an Image" onPress={pickImage} disabled={isPickingImage} />
            <Button title="Close" onPress={onClose} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default ImagePickerModal;