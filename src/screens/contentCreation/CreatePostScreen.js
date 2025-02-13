import { React, useState, useEffect, useContext, useRef, useCallback } from "react";
import { 
    TouchableOpacity, 
    View, 
    Image, 
    Modal, 
    StyleSheet, 
    TextInput, 
    Text,
    FlatList,
    ImageBackground,
    TouchableWithoutFeedback, 
    Keyboard,
    Alert,
    Platform
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from 'react-native-image-picker';
import ImageResizer from 'react-native-image-resizer';
import RNFS from 'react-native-fs';
import LinearGradient from "react-native-linear-gradient";
import { SvgUri } from "react-native-svg";
import MainButton from "../../components/common/MainButton";
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiClient from "../../services/apiClient";
import { CategoryContext } from "../../components/contentCreation/CategoryContext";
import { addCameraIcon, backArrow } from "../../utils/icons";
import CameraModal from "../../components/common/CameraModal";
import baseUrl from "../../utils/api";

const CreatePostScreen = () => {
    const { categoryIdPost, setCategoryIdPost } = useContext(CategoryContext);
    const { setSavePost } = useContext(CategoryContext);
    const [caption, setCaption] = useState('');
    const [location, setLocation] = useState('');
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState([]);
    const [dropdownData, setDropdownData] = useState([]);
    const [taggedUsers, setTaggedUsers] = useState([]);

    const [photoUri, setPhotoUri] = useState(null);
    const [photoList, setPhotoList] = useState([]);
    const [base64Image, setBase64Image] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [token, setToken] = useState(null);
    const [searchQuery, setSearchQuery] = useState(''); 
    const navigation = useNavigation();

    const [isCameraModalVisible, setIsCameraModalVisible] = useState(false);
    const handlePhotoConfirmed = (photo) => {
        const { uri, base64 } = photo;
        const newPhoto = {
            image_url: `${base64}`,
            cover_image: true,
        };
        setBase64Image(base64);
        setPhotoList([newPhoto]);
        setIsCameraModalVisible(false); 
    };
    
    const validateInputs = () => {
        if (!caption) return {
            valid: false, error: "Caption is required"
        }
        if (!base64Image) return { 
            valid: false, error: "Image is required"
        };
        if (!location) return {
            valid: false, error: "Location is required"
        };

        return { valid: true, error: null };
    };

    const navToTagCause = () => {
        const validation = validateInputs();
        if (!validation.valid) {
            Alert.alert('Validation Error', validation.error);
            return;
        };
        navigation.navigate('TagCausePost')
    };

    useEffect(() => {
    }, [categoryIdPost]);

    useEffect(() => {
        setSavePost(() => handleSavePost);
    }, [categoryIdPost]);

    useEffect(() => {
    }, [taggedUsers]);

    useEffect(() => {
        const getToken = async () => {
            const storedToken = await AsyncStorage.getItem("AccessToken");
            setToken(storedToken);
        };
        getToken();
    }, []);
    
    const resetForm = () => {
        setCaption('');
        setLocation('');
        setTaggedUsers([]);
        setSelectedUser([]);
        setPhotoList([]);
        setPhotoUri(null); 
        setBase64Image(null);
        setCategoryIdPost(null);
    };

    const createPost = async (postData) => {
        if (!token) {
            console.error("No token found");
            return;
        }
        try {
            //console.log("Creating post with data", postData);
            const response = await apiClient.post(`${baseUrl}/posts/`, postData, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            });
            console.log("Post created:", response.data);
            return response.data;
        } catch (error) {
            console.log("Failed to create post: ", error.message);
            throw error;
        }
    };

    const handleSavePost = async () => {
        try {
            console.log("handleSavePost called");
            // Post data
            const postData = {
                caption: caption,
                categories: categoryIdPost,
                location: location,
                tagged_users: taggedUsers,
                image_urls: Object.entries(photoDict).map(([imageUrl, isCoverImage]) => ({
                    image_url: imageUrl,
                    cover_image: Boolean(isCoverImage),
                })),
            };
            console.log("post data",postData)
            const response = await createPost(postData);
            navigation.navigate('Home');
            resetForm();
        } catch (error) {
            console.log("Failed to save post: ", error.message);
        }
    };

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                if (!token) {
                    console.log("no token found");
                    return;
                }
                const searchKey ='search';
                const searchValue = 'r';
                const url = new URL(`${baseUrl}/search/profiles/?`);
                url.searchParams.append(searchKey, searchValue);

                const response = await apiClient.get(url.toString(), {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                    },
                });

                const userInfo = await response.data;
                setUsers(userInfo);
            } catch (error) {
                console.log("Error fetching user data", error);
            }
        };
        fetchUserData();
    }, [token]);

    useEffect(() => {
        if (searchQuery) {
            const lowercasedQuery = searchQuery.toLowerCase();
            const filtered = users.filter(user => 
                user.first_name.toLowerCase().includes(lowercasedQuery) ||
                user.last_name.toLowerCase().includes(lowercasedQuery)
            );
            //console.log('Filtered users:', filtered);
            setDropdownData(filtered.map(user => ({
                label: `${user.first_name} ${user.last_name}`,
                value: user.id
            })));
            //console.log('Dropdown Data:', dropdownData);
           // setDropdownData(dropdownData);
        } else {
            setDropdownData([]);
        }
    }, [searchQuery, users]);

    const handleSelectUser = (value) => {
        Keyboard.dismiss();
        const user = users.find(user => user.id === value);
        //console.log('Selected user:', user);
    
        if (user) {
            setTaggedUsers(prevTaggedUsers => {
                const taggedUsersArray = Array.isArray(prevTaggedUsers) ? prevTaggedUsers : [];
                const userAlreadyTagged = taggedUsersArray.some(taggedUser => taggedUser.user === user.id);

                if (!userAlreadyTagged) {
                    return [...taggedUsersArray, { user: user.id }];
                }
                return taggedUsersArray;
            });
    
            // Update selectedUser state
            setSelectedUser(prevSelectedUser => {
                const selectedUsersArray = Array.isArray(prevSelectedUser) ? prevSelectedUser : [];
                const userAlreadySelected = selectedUsersArray.some(selected => selected.id === user.id);

                if (!userAlreadySelected) {
                    return [...selectedUsersArray, user];
                }
                return selectedUsersArray;
            });
    
            setSearchQuery('');
            setDropdownData([]);
        }
    };
    
    const handleRemoveTag = (id) => {
        setSelectedUser(prevUsers => prevUsers.filter(user => user.id !== id));
        setTaggedUsers(prevTaggedUsers => prevTaggedUsers.filter(taggedUser => taggedUser.user !== id));
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
                            //console.log('base', base64Image);
                            setBase64Image(base64Image);
                            // Create a new photo object with the base64 image and mark it as the cover image
                            const newPhoto = {
                                image_url: `${base64Image}`,
                                cover_image: true,
                            };
    
                            // Update the photo list
                            setPhotoList([newPhoto]);
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
    console.log(photoList);
    // Create a dict from photoList
    const photoDict = photoList.reduce((dict, photo) => {
        dict[photo.image_url] = photo.cover_image;
        return dict;
    }, {});

    return (
        <ImageBackground
            source={require("../../assets/main-background.png")}
            style={styles.container}
        >
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => {
                        resetForm();
                        navigation.goBack();
                    }}
                >
                    <SvgUri uri={backArrow} />
                </TouchableOpacity>
                <Text style={styles.headerText}>New Post</Text>
            </View>
           
            <KeyboardAwareScrollView
                contentContainerStyle={{ flexGrow: 1 }}
                enableOnAndroid={true}
                keyboardShouldPersistTaps="always"
                enableAutomaticScroll={true}
                extraScrollHeight={Platform.OS === 'ios' ? 120 : 0}
                //keyboardDismissMode="on-drag"
            >
                <View style={styles.box}>
                    <TextInput 
                        value={caption}
                        onChangeText={setCaption}
                        style={styles.captionInput}
                        placeholder='Write a caption'
                        placeholderTextColor='grey'
                    />
                    
                    <View style={styles.cameraContainer}>
                        <TouchableOpacity style={styles.photos} onPress={() => setModalVisible(true)}>
                            {base64Image ? (
                                <View style={styles.capturedImageContainer}>
                                    <Image source={{ uri: `data:image/jpeg;base64,${base64Image}` }} style={styles.capturedImage} />
                                </View>
                                ) : (
                                <View style={styles.photoContainer}>
                                     <SvgUri uri={addCameraIcon} size={70} color="black" style={{ marginTop: -12, marginBottom: 10 }}/>
                                    <Text>Add Media + </Text>
                                </View>
                            )}
                        </TouchableOpacity>
                        
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
                                    <TouchableOpacity style={styles.modalButton} onPress={() => { setModalVisible(false); pickImage();}}>
                                        <Text style={styles.modalButtonText}>Choose from Photo Library</Text>
                                    </TouchableOpacity>
                                    <View style={styles.separator} />
                                    <TouchableOpacity style={styles.modalButton} onPress={() => setModalVisible(false)}>
                                        <Text style={styles.modalButtonText}>Cancel</Text>
                                    </TouchableOpacity>
                                </LinearGradient>
                            </View>
                        </Modal>

                        {isCameraModalVisible && (
                            <CameraModal 
                                onPhotoConfirmed={handlePhotoConfirmed} 
                                onClose={() => setIsCameraModalVisible(false)}
                            />
                        )}
                    </View>

                    <View style={styles.tagPeopleContainer}>
                        <Text style={styles.tagPeopleText}>Tag People</Text>
                        <LinearGradient
                            colors={["#FF8D00", "#FFE600"]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.tagPeopleGradientBorder}
                        >
                            <View style={styles.innerTagPeopleContainer}>
                                <TextInput 
                                    style={styles.tagPeopleInput}
                                    placeholder="Find people..."
                                    onChangeText={text => setSearchQuery(text)}
                                    value={searchQuery}
                                />
                            </View>
                        </LinearGradient>

                        {dropdownData.length > 0 && (
                            <View style={styles.dropdownContainer}>
                                <FlatList
                                    data={dropdownData}
                                    keyExtractor={item => item.value.toString()}
                                    renderItem={({ item }) => (
                                        <TouchableWithoutFeedback 
                                            onPress={() => handleSelectUser(item.value)}
                                        >
                                            <View style={styles.dropdownItem}>
                                                <Text style={styles.item}>{item.label}</Text>
                                            </View>
                                        </TouchableWithoutFeedback>
                                    )}
                                    style={styles.dropdown}
                                    keyboardShouldPersistTaps="handled"
                                />
                            </View>
                        )}
                    </View>

                    <View style={styles.selectedUsersContainer}>
                        {Array.isArray(selectedUser) && selectedUser.map(user => (
                            <View key={user.id} style={styles.tag}>
                                <Text style={styles.tagText}>{`${user.first_name} ${user.last_name}`}</Text>
                                    <TouchableOpacity onPress={() => handleRemoveTag(user.id)}>
                                        <Text style={styles.removeTag}>×</Text>
                                    </TouchableOpacity>
                            </View>
                        ))}
                    </View>

                    <View style={styles.addLocationContainer}>
                        <Text style={{ marginBottom: 10 }}>Add location</Text>
                            <View style={styles.searchBar}>
                                {/*
                                <SvgUri
                                    style={styles.searchIcon}
                                    uri={
                                        Image.resolveAssetSource(MagnifyingGlass).uri
                                }/>
                                */}
                                <LinearGradient
                                    colors={["#FF8D00", "#FFE600"]}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    style={styles.gradientBorder}
                                >
                                <View style={styles.innerContainer}> 
                                    <TextInput 
                                        style={styles.searchInput} 
                                        value={location}
                                        onChangeText={setLocation}
                                    />
                                </View>
                            </LinearGradient>
                        </View>
                    </View>

                    <View style={{ marginTop: 10, marginBottom: 30 }}>
                        <MainButton style={styles.mainButton} title="Add Causes" onPress={navToTagCause}/>
                    </View>
                </View>
            </KeyboardAwareScrollView>
        </ImageBackground>
    );
};

export default CreatePostScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "flex-start",
        position: 'relative',
      },
    header: {
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
        paddingHorizontal: "5%",
        marginTop: "13%",
    },  
    headerText: {
        color: "#FFE600",
        fontSize: 26,
        fontFamily: "poppins-regular",
        paddingLeft: 20,
    },
    title: {
        marginTop: "7%",
        paddingHorizontal: "10%",
        color: "white",
        fontSize: 20,
    },
    box: {
        borderWidth: 1,
        borderRadius: 30,
        marginTop: 30,
        margin: 20,
        marginBottom: 5,
        backgroundColor: "#ffffff",
        //position: 'relative',
    },
    captionInput: {
        marginTop: 34,
        marginHorizontal: 20,
        borderRadius: 40,
        backgroundColor: '#E9E9E9',
        paddingVertical: 15,
        paddingHorizontal: 10,
    },
    photoContainer: {
        alignItems: 'center',
        justifyContent: "center",
        borderWidth: 1,
        width: "90%",
        borderStyle: 'dashed',
        borderRadius: 20,
        marginTop: 20,
        marginHorizontal: 20,
        paddingVertical: 50,
        marginBottom: 10,
        overflow: 'hidden',
    },
    //center the photo
    photos: {
        marginTop: 2,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
    },
    capturedImageContainer:{
        width: 330,
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
        width: '95%',
        height: '97%',
        borderRadius: 20,
        //borderStyle: 'dashed',
        resizeMode: 'cover',
    },
    camera: {
        flex: 1,
        width: '100%',
        height: '100%',
        borderRadius: 20,
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
    separator: {
        height: 1,
        width: '100%',
        backgroundColor: 'white',
        marginVertical: 10,
    },
    takePhotoContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 15,
        marginVertical: 60,
    },
    permissionContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      },
    fullScreenCamera: {
        flex: 1,
        width: '100%',
        height: '100%',
        borderRadius: 30,
        overflow: 'hidden',
        position: 'relative',
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
    tagPeopleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 10,
        marginLeft: 20,
        position: 'relative',
        zIndex: 1,
    },
    tagPeopleText: {
        fontSize: 18,
        color: '#2BAB47',
    },
    tagPeopleInput: {
        //marginLeft: 20,
        borderRadius: 40,
        backgroundColor: 'white',
        width: '100%',
        paddingVertical: 7,
        paddingHorizontal: 10,
        //position: 'relative',
    },
    tagPeopleGradientBorder: {
        width: "60%",
        borderRadius: 50,
        padding: 2,
        marginLeft: 12,
    },
    innerTagPeopleContainer: {
        borderRadius: 40,
        backgroundColor: '#E9E9E9',
        overflow: 'hidden',
    },
    dropdownContainer: {
        position: 'absolute',
        top: 40,
        left: 100,
        width: '60%',
        zIndex: 9999,
        elevation: 10,
        maxHeight: 100,
    },
    dropdown: {
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 10,
    },
    dropdownItem: {
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    item: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    selectedUsersContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginHorizontal: 12,
        marginBottom: 5,
    },
    tag: {
        backgroundColor: '#e0e0e0',
        borderRadius: 20,
        paddingVertical: 5,
        paddingHorizontal: 10,
        margin: 5,
        flexDirection: 'row',
        alignItems: 'center',
    },
    tagText: {
        fontSize: 14,
        marginRight: 5,
    },
    removeTag: {
        fontSize: 16,
        color: 'red',
    },
    addLocationContainer: {
        marginLeft: 20,
        marginBottom: 10,
    },
    searchBar: {
        flexDirection: 'row',
        marginLeft: 2,
    },
    searchIcon: {
        width: 20,
        height: 20,
        position: "absolute",
        left: 10,
        top: "45%",
        transform: [{ translateY: -9 }], 
        zIndex: 10,
    },
    gradientBorder: {
        borderRadius: 50,
        padding: 2,
        width: '84%',
        height: 32,
    },
    innerContainer: {
        borderRadius: 50,
        backgroundColor: 'white',
    },
    searchInput: {
        width: "100%",
        height: 28,
        fontSize: 15,
        paddingVertical: 3,
        //paddingLeft: 35,
        borderRadius: 50,
        padding: 10,
        borderWidth: 0,
    },
    mainButton: {
        width: "80%",
        alignSelf:'center',
    },

});