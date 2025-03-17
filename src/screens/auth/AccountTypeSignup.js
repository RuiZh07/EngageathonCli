import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    ImageBackground,
    KeyboardAvoidingView,
    Image,
    Modal,
    ScrollView,
    Platform,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { backArrow, userRoundedIcon, cameraIcon, lockIcon, eyeCloseIcon, eyeIcon } from '../../utils/icons';
import { SvgUri } from "react-native-svg";
import MainButton from '../../components/common/MainButton';
import CameraModal from '../../components/common/CameraModal';
import ImagePickerModal from '../../components/common/ImagePickerModal';
import authService from '../../services/authService';

const AccountTypeSignup = () => {
    const [fname, setFname] = useState("");
    const [lname, setLname] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [cPassword, setCPassword] = useState("");
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const navigation = useNavigation();
    
    const route = useRoute();
    const { typeInput } = route.params || {};

    console.log("typeInput", typeInput);

    const [cameraVisible, setCameraVisible] = useState(false);
    const [capturedImage, setCapturedImage] = useState(null);

    const [imagePickerVisible, setImagePickerVisible] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);

    const openCamera = () => {
        setCameraVisible(true);
    };

    const handlePictureTaken = (image) => {
        const { uri, base64 } = image;
        setSelectedImage(base64);
        setCameraVisible(false);
        console.log('Captured Image:', base64);
    };

    const openImagePicker = () => {
        setImagePickerVisible(true);
    };

    // Handle the selected image data
    const handleImagePicked = (base64Image) => {
        setSelectedImage(base64Image);
    };

    // Close the modal
    const closeImagePicker = () => {
        setImagePickerVisible(false);
    };

    const userData = {
        "account_type": typeInput,
        email,
        "first_name": fname,
        "last_name": lname,
        password,
        "profile_photo": selectedImage,
    };
    
    const handleNext = async () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!email || !password || !cPassword || !fname || !lname) {
            alert("Please fill in all fields.");
            return;
        }

        if (!emailRegex.test(email)) {
            alert("Please enter a valid email address.");
            return;
        }
  
        if (password !== cPassword) {
            alert("Passwords do not match.");
            return;
        }

        if (password.length < 12) {
            alert("Password must be at least 12 characters long.");
            return;
        }

        console.log("userData", userData);
        if (typeInput === 'IN') {
            const response = await authService.signup(
                userData
            );
             navigation.navigate("TagCause", { userData });
        } else {
            navigation.navigate("RegisterScreen", { userData });
        }
    }

    const renderAccountType = () => {
        let title = "";
        let placeholder = "";
        switch (typeInput) {
            case 'IN': 
                title = "Setup your account";
                placeholder = "Enter Phone or Email";
                break;
            case 'UN':
                title = "Setup your University's Account";
                placeholder = "University Email";
                break;
            case 'OR': 
                title = "Setup your Organization's Account";
                placeholder = "Organization Email";
                break;
            case 'NO':
                title = "Setup your Non-Profit's Account";
                placeholder = "Non-Profit Email";
                break;
            case "CO":
                title = "Setup your Corporation's Account";
                placeholder = "Corporation Email";
                break;
            case 'GO':
                title = "Setup your Government Entity Account";
                placeholder = "Organization Email"
                break;
        }

        return { title, placeholder };
    }

    const { title, placeholder } = renderAccountType();

    useEffect(() => {
        console.log('Camera modal visibility:', cameraVisible);
      }, [cameraVisible]);
      
    return (
        <KeyboardAvoidingView
            style={styles.avoidView}
            behavior="position"
        >
            <ImageBackground
                source={require("../../assets/signup-bg1.png")}
                style={{ height: "100%", justifyContent: "flex-end" }}
            >
            
            <View style={styles.container}>
                <View style={styles.headerContainer}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <SvgUri uri={backArrow} />
                    </TouchableOpacity>
                    
                    <Text style={styles.heading}>Sign up</Text>
                </View>
                <Text style={styles.title}>{title}</Text>
                <ScrollView contentContainerStyle={styles.scrollViewContent}>
                    <TouchableOpacity style={styles.pfpContainer} onPress={openCamera}>
                        {selectedImage ? (
                            <Image 
                                source={{uri: `data:image/png;base64, ${selectedImage}`}}
                                style={styles.profileImage}
                            />
                        ) : (
                            <SvgUri 
                                uri={userRoundedIcon} 
                                width="50"
                                height="50" 
                            />
                        )}
                        <View style={styles.cameraIcon}>
                            <SvgUri uri={cameraIcon} 
                                width="24"
                                height="24"
                            />
                        </View>
                        
                    </TouchableOpacity>

                    <CameraModal
                        isVisible={cameraVisible}
                        onClose={() => setCameraVisible(false)}
                        onPhotoConfirmed={handlePictureTaken}
                    />

                    {/* Render the modal conditionally */}
                    <Modal visible={imagePickerVisible} animationType="slide" transparent={true}>
                        <ImagePickerModal onImagePicked={handleImagePicked} onClose={closeImagePicker} />
                    </Modal>
                    <View style={styles.nameContainer}>
                        <View style={styles.nameInputContainer}>
                            <TextInput 
                                style={styles.input} 
                                onChangeText={setFname}
                                value={fname}
                                placeholder="First Name"
                                placeholderTextColor="#ABABAB"
                            />
                        </View>
                        <View style={styles.nameInputContainer}>
                            <TextInput 
                                style={styles.input} 
                                onChangeText={setLname}
                                value={lname}
                                placeholder="Last Name"
                                placeholderTextColor="#ABABAB"
                            />
                        </View>
                    </View>
                    <View style={styles.inputContainer}>
                        <SvgUri 
                            uri={userRoundedIcon} 
                            width="24"
                            height="22" 
                        />
                        <TextInput 
                            style={styles.input} 
                            onChangeText={setEmail}
                            value={email}
                            placeholder={placeholder}
                            placeholderTextColor="#ABABAB"
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <SvgUri 
                            uri={lockIcon} 
                            width="24"
                            height="18" 
                        />
                        <TextInput
                            style={styles.input}
                            onChangeText={setPassword}
                            value={password}
                            placeholder="Enter Password"
                            placeholderTextColor="#ABABAB"
                            secureTextEntry={!showNewPassword}
                        />
                        <SvgUri 
                            uri={showNewPassword ? eyeIcon : eyeCloseIcon}
                            width="26"
                            height="20"
                            onPress={() => setShowNewPassword(!showNewPassword)}
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <SvgUri 
                            uri={lockIcon} 
                            width="24"
                            height="18" 
                        />
                        <TextInput
                            style={styles.input}
                            onChangeText={setCPassword}
                            value={cPassword}
                            placeholder="Confirm Password"
                            placeholderTextColor="#ABABAB"
                            secureTextEntry={!showConfirmPassword}
                        />
                        <SvgUri 
                            uri={showConfirmPassword ? eyeIcon : eyeCloseIcon}
                            width="26"
                            height="20"
                            onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                        />
                    </View>
                    <MainButton 
                        onPress={handleNext} 
                        title={typeInput === 'IN' ? "Register" : "Next"}
                        style={styles.mainButton} 
                    />
                </ScrollView>
            </View>
        </ImageBackground>
    </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    avoidView: {
        width: "100%",
        height: "100%",
        maxWidth: "100%",
    },
    container: {
        backgroundColor: "#FFFFFF",
        height: "70%",
        maxHeight: "70%",
        alignItems: "center",
        paddingTop: "8%",
        paddingBottom: "7%",
        marginHorizontal: "4%",
        borderRadius: 40,
        paddingHorizontal: "7%",
    },
    scrollViewContent: {
        flexGrow: 1,
        alignItems: "center",
    },
    headerContainer: {
        flexDirection: "row",
        alignItems: "center",
        alignSelf: "flex-start",
    },
    heading: {
        alignSelf: "flex-start",
        fontSize: 38,
        fontFamily: "Poppins-Bold",
        color: "#FF8D00",
        marginLeft: 20,
    },
    title: {
        alignSelf: "flex-start",
        fontSize: 15,
        color: "#414141",
        fontFamily: "Inter-Medium",
        marginTop: Platform.OS === "android" ? -5 : 5,
        marginBottom: 10,
    },
    pfpContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: "#E8E8E8",
        padding:12,
        marginBottom: 30,
        position: "relative",
    },
    profileImage: {
        width: '140%',
        height: '140%',
        borderRadius: 55,
    },
    cameraIcon: {
        position: 'absolute',
        top: 60,
        left: 50,
    },
    nameContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: Platform.OS === "android" ? 8 : 15,
        justifyContent: "space-between",
        width: Platform.OS === "android" ? '99%' : '95%',
    },
    nameInputContainer: {
        borderWidth: 1,
        borderColor: "#D6D6D6",
        borderRadius: 10,
        paddingVertical: Platform.OS === "android" ? 4 : "5.5%",
        paddingLeft: "4%",
        width:"49%",
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
        borderWidth: 1,
        borderColor: "#D6D6D6",
        borderRadius: 10,
        paddingVertical: Platform.OS === "android" ? 8 : "5.5%",
        paddingHorizontal: "5%",
        width: Platform.OS === "android" ? '99%' : '95%',
        marginBottom: Platform.OS === "android" ? 8 : 15,
    },
    input: {
        width: "83%",
        paddingLeft: "4%",
        fontFamily: "Inter-Medium",
        fontSize: 15,
    },
    mainButton: {
        width: "90%",
    },
})

export default AccountTypeSignup;