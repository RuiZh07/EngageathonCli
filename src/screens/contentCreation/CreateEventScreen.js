import { React, useState, useEffect, useContext, useRef } from "react";
import {
    StyleSheet,
    ScrollView,
    KeyboardAvoidingView,
    Text,
    View,
    TouchableOpacity,
    ImageBackground,
    Switch,
    Image,
    TextInput,
    Modal,
    Alert,
    Platform
  } from "react-native";
import { Dropdown } from 'react-native-element-dropdown';
import { useNavigation, useRoute } from "@react-navigation/native";
import LinearGradient from "react-native-linear-gradient";
import { CategoryContext } from "../../components/contentCreation/CategoryContext";
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import MainButton from "../../components/common/MainButton";
import ProgressBar from "../../components/contentCreation/ProgressBar";
import * as ImagePicker from 'react-native-image-picker';
import ImageResizer from 'react-native-image-resizer';
import RNFS from 'react-native-fs';
import { SvgUri } from "react-native-svg";
import { calendarEvent, addCameraIcon, backArrow } from "../../utils/icons";
import CameraModal from "../../components/common/CameraModal";
import baseUrl from "../../utils/api";
import apiClient from "../../services/apiClient";

const CreateEventScreen = () => {
    const route = useRoute();
    const { multiPhotoList } = route.params || {};
    const { categoryId, setCategoryId, activities, setActivities } = useContext(CategoryContext);
    const { setSaveEvent } = useContext(CategoryContext);
    const [eventType, setEventType] = useState("");
    const [title, setTitle] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [isStartDate, setIsStartDate] = useState(true);
    const [showPicker, setShowPicker] = useState(false);
    const [location, setLocation] = useState("");
    const [eventDes, setEventDes] = useState("");
    const [recurringEvent, setRecurringEvent] = useState(false);
    const [leaderboards, setLeaderboards] = useState(false);
    const [photoList, setPhotoList] = useState([]);
    const [base64Image, setBase64Image] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [token, setToken] = useState(null);

    //const [permission, requestPermission] = useCameraPermissions();
    const [isCameraModalVisible, setIsCameraModalVisible] = useState(false);
    const handlePhotoConfirmed = (photo) => {
        const { uri, base64 } = photo;
        const newPhoto = {
            image_url: `${base64}`,
            cover_image: true,
        };
        setPhotoList([newPhoto]);
        setIsCameraModalVisible(false); 
    };

    const [displayStartDate, setDisplayStartDate] = useState('');
    const [displayEndDate, setDisplayEndDate] = useState('');

    const navigation = useNavigation();
    const API_BASE_URL_EVENT_CREATE = `${baseUrl}/events/`;

    // validate Inputs
    const validateInputs = () => {
        if(!title) return {
            valid: false, error: "Title is required"
        };
        if(!eventType) return {
            valid: false, error: "Event type is required"
        };
        if (!startDate) return { 
            valid: false, error: "Start date is required"
        };
        if (!endDate) return { 
            valid: false, error: "End date is required"
        };
        if (!location) return {
            valid: false, error: "Location is required"
        };
        if (!eventDes) return {
            valid: false, error: "Description is required"
        };
        if (!photoList) return { 
            valid: false, error: "Image is required"
        };
        if (endDate < startDate) { 
            return { valid: false, error: "End date cannot be before start date"};
        };

        return { valid: true, error: null };
    };

    const navToActivity = () => {
        const validation = validateInputs();
        if (!validation.valid) {
            Alert.alert('Validation Error', validation.error);
            return;
        };
        navigation.navigate('CreateActivityScreen');
    };

    useEffect(() => {
        setSaveEvent(() => handleSaveEvent);
    }, [categoryId, activities]);

    useEffect(() => {
        const getToken = async () => {
            const storedToken = await AsyncStorage.getItem("AccessToken");
            setToken(storedToken);
        };
        getToken();
    }, []);

    // Reset the form after successfully save the event
    const resetForm = () => {
        setTitle("");
        setEventType("");
        setStartDate("");
        setEndDate("");
        setLocation("");
        setEventDes("");
        setRecurringEvent(false);
        setLeaderboards(false);
        setPhotoList([]);
        setBase64Image(null); 
        setCategoryId(null);
        setActivities([]);
        
    };

    const createEvent = async (eventData) => {
        if (!token) {
            console.error("No token found");
            return;
        }
        try {
            const response = await apiClient.post(`${API_BASE_URL_EVENT_CREATE}`, eventData, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            });
            console.log("Event created:", response.data);
            return response.data;
        } catch (error) {
            console.log("Failed to create event: ", error.message);
            throw error;
        }
    };
    
    //save the event  
    const handleSaveEvent = async () => {
        try {

            // Convert date into ISO format
            const startDateTime = new Date(startDate);
            const endDateTime = new Date(endDate);
            const isoStartDate = startDateTime.toISOString();
            const isoEndDate = endDateTime.toISOString();  

            // Event data
            const eventData = {
                name: title,
                event_type: eventType,
                categories: categoryId,
                location: location,
                description: eventDes,
                recurring_event: recurringEvent, 
                leaderboards: leaderboards,
                datetime_start: isoStartDate,
                datetime_end: isoEndDate,
                activities: activities,
                image_urls: Object.entries(photoDict).map(([imageUrl, isCoverImage]) => ({
                    image_url: imageUrl,
                    cover_image: Boolean(isCoverImage),
                })),
            };

            //console.log("Event details: ", eventData);
            const response = await createEvent(eventData);
            //console.log("Event saved: ", response);
            navigation.navigate('Home');
            resetForm();
        } catch (error) {
            console.log("Failed to save event: ", error.message);
        }
    };

    const handleEventTypeChange = (item) => {
        setEventType(item.value);
    };

    // Date and time input
    const handleConfirmDateTime = (selectedDate) => {
        const userTimeZoneOffset = selectedDate.getTimezoneOffset() * 60000;
        const adjustedDate = new Date(selectedDate.getTime() - userTimeZoneOffset).toISOString();
        const formattedDateTime = adjustedDate.split('.')[0].slice(0, -3);

        const year = adjustedDate.slice(0, 4);
        const month = adjustedDate.slice(5, 7);
        const day = adjustedDate.slice(8, 10);
        const hours = adjustedDate.slice(11, 13);
        const minutes = adjustedDate.slice(14, 16);
    
        // Combine them into the desired format: MM/DD/YYYY HH:MM
        const displayDate = `${month}/${day}/${year} ${hours}:${minutes}`;

        if (isStartDate) {
          setStartDate(formattedDateTime);
          setDisplayStartDate(displayDate);
        } else {
          setEndDate(formattedDateTime);
          setDisplayEndDate(displayDate);
        }

        setShowPicker(false);
    };
    
    // Recurring event switch
    const toggleRecurringEvent = () => {
        setRecurringEvent(previousState => !previousState);
    };

    // Leaderboard switch
    const toggleLeaderboards = () => {
        setLeaderboards(previousState => !previousState);
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

    // Create a dict from photoList
    // Create a dict prioritizing multiPhotoList if not empty
    const photoDict = (multiPhotoList && multiPhotoList.length > 0 ? multiPhotoList : photoList).reduce(
        (dict, photo) => {
            dict[photo.image_url] = photo.cover_image;
            return dict;
        },
        {}
    );

    useEffect(() => {
        const coverImageUrl = Object.keys(photoDict).find(
            (key) => photoDict[key] === true
        );
        setBase64Image(coverImageUrl || null);
    }, [photoDict]);
    
    
    console.log('PhotoDict in createEvent length:', Object.keys(photoDict).length);
    console.log('Received multiPhotoList in CreateEventScreen:', multiPhotoList);
    console.log('Length of multiPhotoList:', multiPhotoList ? Object.keys(multiPhotoList).length : 0);
    return (
        <ImageBackground
        source={require("../../assets/main-background.png")}
            style={styles.container}
        >
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
            >
                <ScrollView style={styles.scrollViewContent}>
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
                        <Text style={styles.headerText}>Create Event</Text>
                    </View>
                    <ProgressBar stage={1} />
                    <View style={styles.box}>
                        <TextInput 
                            style={styles.input}
                            value={title}
                            onChangeText={setTitle}
                            placeholder="Title"
                            placeholderTextColor="black"
                        />

                        <Dropdown 
                            style={styles.dropdown}
                            data={[
                                {label: "Remote", value: "RM"},
                                {label: "Hybird", value: "HY"},
                                {label: "On Site", value: "OS"},
                            ]}
                            labelField="label"
                            valueField="value"
                            placeholder="Type of Event"
                            value={eventType}
                            onChange={(item) => handleEventTypeChange(item)}
                            placeholderStyle={{ fontSize: 14 }}
                            itemTextStyle={{ fontSize: 14 }}
                            selectedTextStyle = {{ fontSize: 14 }}
                        />

                        <View style={styles.pickDate}>
                            <View style={styles.dateContainer}>
                                <TouchableOpacity onPress={() =>{ setShowPicker(true); setIsStartDate(true); }} style={styles.touchableContainer}>
                                    <TextInput 
                                        style={styles.dateInput}
                                        value={displayStartDate}
                                        editable={false}
                                        placeholder="Start Date/Time"
                                        placeholderTextColor="black"
                                        pointerEvents="none"
                                    />
                                    <SvgUri uri={calendarEvent} size={20} style={styles.calendarIcon}/>
                                    
                                </TouchableOpacity>
                            </View>
                
                            <View style={styles.dateContainer}>
                                <TouchableOpacity onPress={() =>{ setShowPicker(true); setIsStartDate(false); }} style={styles.touchableContainer}>
                                    <TextInput 
                                        style={styles.dateInput}
                                        value={displayEndDate}
                                        editable={false}
                                        placeholder="End Date/Time"
                                        placeholderTextColor="black"
                                        pointerEvents="none"
                                    />
                                    <SvgUri uri={calendarEvent} size={20} style={styles.calendarIcon}/>
                                </TouchableOpacity>
                            </View>    
                            
                                <DateTimePickerModal
                                    isVisible={showPicker}
                                    mode="datetime"
                                    onConfirm={handleConfirmDateTime}
                                    onCancel={() => setShowPicker(false)}
                                    is24Hour={true}
                                    textColor="black"
                                    isDarkModeEnabled={false}
                                />
                            
                        </View>
                    
                        <View style={styles.toggleSwitchContainer}>
                            <View style={styles.switcher}>
                                <Switch 
                                    trackColor={{ false: "#4d4d4d", true: "#FFA500" }}
                                    thumbColor={recurringEvent ? '#ffffff' : "#ffffff"}
                                    onValueChange={toggleRecurringEvent}
                                    value={recurringEvent}
                                    style={{ transform: [{scaleX: 0.7}, {scaleY: 0.7}]}}
                                />
                            </View>
                            <Text style={styles.recurringEventText}>Recurring Event</Text>
                            
                            <View style={styles.switcher}>
                                <Switch 
                                    trackColor={{ false: "#4d4d4d", true: "#FFA500" }}
                                    thumbColor={leaderboards ? '#ffffff' : "#ffffff"}
                                    onValueChange={toggleLeaderboards}
                                    value={leaderboards}
                                    style={{ transform: [{scaleX: 0.7}, {scaleY: 0.7}]}}
                                />
                            </View>
                            <Text style={styles.recurringEventText}>Leaderboards</Text>
                        </View>
                    
                        <TextInput
                            style={styles.input}
                            value={location}
                            onChangeText={setLocation}
                            placeholder="Add location"
                            placeholderTextColor="black"
                        />
                    
                        <TextInput 
                            style={styles.desInput}
                            value={eventDes}
                            onChangeText={setEventDes}
                            placeholder="Event description"
                            placeholderTextColor="black"
                            multiline={true}
                            scrollEnabled={true}
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
                                        <Text>Add cover photo + </Text>
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
                                            <Text style={styles.modalButtonText}>Take a Photo</Text>
                                        </TouchableOpacity>
                                        <View style={styles.separator} />
                                        <TouchableOpacity style={styles.modalButton} onPress={() => { setModalVisible(false); pickImage();}}>
                                            <Text style={styles.modalButtonText}>Choose from Photo Library</Text>
                                        </TouchableOpacity>
                                        <View style={styles.separator} />
                                        <TouchableOpacity style={styles.modalButton} onPress={() => { setModalVisible(false); navigation.navigate('ImageSelectionScreen', { multiPhotoList});}}>
                                            <Text style={styles.modalButtonText}>Add Multiple Photos ...</Text>
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
                            {/*
                            <Modal 
                                animationType="slide"
                                visible={cameraVisible}
                                onRequestClose={() => setCameraVisible(false)}
                                transparent={true}
                            >
                                <View style={styles.takePhotoContainer}>
                                    <View style={styles.fullScreenCamera}>
                                        <CameraView
                                            style={styles.camera}
                                            ref={cameraRef}
                                            onCameraReady={() => setIsCameraReady(true)}
                                            ratio="16:9"
                                        >
                                            <View style={styles.buttonContainer}>
                                                <TouchableOpacity style={styles.cancelButton} onPress={() => setCameraVisible(false)}>
                                                    <SvgUri uri={cameraCancel} size={40} color='white'/>
                                                </TouchableOpacity>
                                                <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
                                                    <CustomCameraIcon size={40} />
                                                </TouchableOpacity>
                                            </View>
                                        </CameraView>
                                    </View>
                                </View>
                            </Modal>
                                        */}
                        </View>
                    </View>

                    <View style={{ marginTop: 10 }}>
                        <MainButton 
                            style={styles.mainButton}
                            title="Next" 
                            onPress={navToActivity} />
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </ImageBackground>
    );
}

export default CreateEventScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "flex-start",
    },
    scrollViewContent: {
        flexGrow: 1,
    },
    // Header container
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
        fontFamily: "Poppins-regular",
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
        marginTop: 0,
        margin: 20,
        marginBottom: 5,
        backgroundColor: "#ffffff",
        //overflow: 'hidden',
    },
    dropdown: {
        backgroundColor: "#efefef",
        borderRadius: 20,
        paddingLeft: 17,
        padding: 10,
        marginLeft: 20,
        marginRight: 20,
        marginTop: 12,
    },
    input: {
        backgroundColor: "#efefef",
        borderRadius: 20,
        padding: 12,
        paddingLeft: 17,
        marginLeft: 20,
        marginRight: 20,
        marginTop: 12,
    },
    desInput: {
        backgroundColor: "#efefef",
        borderRadius: 20,
        paddingTop: 15,
        height: 120,
        paddingHorizontal: 20,
        marginLeft: 20,
        marginRight: 20,
        marginTop: 12,
        textAlign: 'center',
        textAlignVertical: 'top',
    },
    timeInput: {
        backgroundColor: "#efefef",
        borderRadius: 20,
        padding: 12,
        margin: 20,
    },
    pickDate: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 12,
        marginLeft: 20,
        marginRight: 8,
    },
    dateContainer: {
        flex: 1,
        justifyContent: 'space-between',
        backgroundColor: "#efefef",
        borderRadius: 16,
        padding: 10,
        marginRight: 10,
    },
    dateInput: {
        fontSize: 12,
        paddingLeft: 0,
        paddingTop: 10,
        paddingTop: -5,
        color: 'black',
        fontWeight: '600',
    },
    touchableContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    toggleSwitchContainer: {
        marginLeft: 18,
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
    },
    recurringEventText: {
        marginLeft: 2,
        fontSize: 12,
    },
    photoContainer: {
        alignItems: 'center',
        justifyContent: "center",
        borderWidth: 1,
        borderStyle: 'dashed',
        borderRadius: 20,
        marginTop: 10,
        marginHorizontal: 20,
        padding: 40,
        marginBottom: 20,
        overflow: 'hidden',
        width: "87%",
    },
    photos: {
        marginTop: 2,
        alignItems: 'center',
        justifyContent: "center",
    },
    capturedImageContainer:{
        width: 300,
        height: 160,
        marginHorizontal: 22,
        marginTop: 7,
        borderRadius: 20,
        marginBottom: 20,
        overflow: 'hidden',
    },
    capturedImage: {
        width: '100%',
        height: '100%',
        //borderRadius: 20,
        borderStyle: 'dashed',
        resizeMode: 'cover',
    },
    camera: {
        flex: 1,
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
        width: '100%',
        backgroundColor: 'white',
        marginVertical: 10,
    },
    pickerContainer: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 10,
        width: '70%',
        alignItems: 'center',
    },

    closeButton: {
        marginTop: 10,
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
    camera: {
        flex: 1,
        width: '100%',
        height: '100%',
        borderRadius: 20,
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
    mainButton: {
        width: "80%",
        alignSelf:'center',
    },

});