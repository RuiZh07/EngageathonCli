import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    ImageBackground,
    KeyboardAvoidingView,
    Image,
    Alert,
    ScrollView,
  } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { backArrow } from '../../utils/icons';
import { SvgUri } from "react-native-svg";
import MainButton from '../../components/common/MainButton';
import authService from '../../services/authService';

const RegisterScreen = () => {
    const [name, setName] = useState("");
    const [contact, setContact] = useState("");
    const [website, setWebsite] = useState("");
    const [general, setGeneral] = useState("");
    const [type, setType] = useState("");

    const navigation = useNavigation();
    const route = useRoute();
    const { userData } = route.params || {};

    console.log("userdata in register", userData);

    const profileMapping = {
        UN: {
            title: "Setup your University's Account",
            placeholders: {
                name: "University Name",
                type: "Department/Faculty",
                general: "Student Population",
                contact: "Contact Person's Name",
                website: "Website"
            },
            profileData: (name, type, general, contact, website) => ({
                university_name: name,
                faculty: type,
                student_population: general,
                contact_person_name: contact,
                website: website,
            })
        },
        OR: {
            title: "Setup your Organization's Account",
            placeholders: {
                name: "Organization Name",
                type: "Industry",
                general: "Number of Employee/Members",
                contact: "Contact Person's Name",
                website: "Website"
            },
            profileData: (name, type, general, contact, website) => ({
                organization_name: name,
                industry: type,
                employee_count: general,
                contact_person_name: contact,
                website: website,
            })
        },
        NO: {
            title: "Setup your Non-Profit's Account",
            placeholders: {
                name: "Non-Profit Name",
                general: "Mission Statement",
                website: "Website",
                contact: "Contact Person's Name",
            },
            profileData: (name, general, contact, website) => ({
                nonprofit_name: name,
                employee_count: general,
                contact_person_name: contact,
                website: website,
            })
        },
        CO: {
            title: "Setup your Corporation's Account",
            placeholders: {
                name: "Company Name",
                type: "Industry",
                general: "Mission Statement",
                contact: "Contact Person's Name",
                website: "Website"
            },
            profileData: (name, type, general, contact, website) => ({
                corporation_name: name,
                industry: type,
                employee_count: general,
                contact_person_name: contact,
                website: website,
            })
        },
        GO: {
            title: "Setup your Government Entity Account",
            placeholders: {
                name: "Entity Name",
                type: "Type of Entity",
                general: "Area",
                contact: "Contact Person's Name",
                website: "Website"
            },
            profileData: (name, type, general, contact, website) => ({
                entity_name: name,
                industry: type,
                employee_count: general,
                contact_person_name: contact,
                website: website,
            })
        }

    };
    const profileKeyMapping = {
        UN: 'university_profile',
        OR: 'organization_profile',
        NO: 'nonprofit_profile',
        CO: 'corporation_profile',
        GO: 'government_profile',
    };

    const renderAccountType = () => {
        const accountType = userData.account_type;
        const accountInfo = profileMapping[accountType];
    
        if (!accountInfo) return {};
    
        const { title, placeholders } = accountInfo;
    
        return {
            title,
            websitePlaceholder: placeholders.website,
            contactPlaceholder: placeholders.contact,
            namePlaceholder: placeholders.name,
            typePlaceholder: placeholders.type,
            generalPlaceholder: placeholders.general
        };
    };

    const handleNext = async () => {
        const accountType = userData.account_type;
        const accountInfo = profileMapping[accountType];
        const profileKey = profileKeyMapping[accountType];
    
        if (!accountInfo || !profileKey) return;
        
    
        const isValidWebsite = (url) => {

        }
        try {
            // Prepare the data to be sent to the backend
            const profileData = accountInfo.profileData(name, type, general, contact);
            const updateUserData = {
                ...userData,
                [profileKey]: {
                    ...profileData,
                    website,
                },
            };
    
            console.log("Data being sent to backend:", updateUserData);
    
            // Call the backend signup API
            const response = await authService.signup(
                updateUserData,
            );
    
            console.log("Registration successful:", response);
            navigation.navigate("TagCause", { userData: updateUserData });
    
        } catch (error) {
            console.error("Registration failed:", error.message);

        }
    };
    
    

    {/*
    const handleNext = () => {
        let profileData = {};
        switch (userData.account_type) {
            case 'UN':
                profileData = {
                    university_name: name,
                    faculty: type,
                    student_population: general,
                   
                };
                

                break;
            case 'OR': 
                title = "Setup your Organization's Account";
                namePlaceholder = "Organization Name";
                typePlaceholder = "Industry";
                generalPlaceholder = "Number of Employee/Members";
                break;
            case 'NO':
                title = "Setup your Non-Profit's Account";
                namePlaceholder = "Non-Profit Name";
                generalPlaceholder = "Mission Statement";
                break;
            case "CO":
                title = "Setup your Corporation's Account";
                namePlaceholder = "Company Name";
                typePlaceholder = "Industry";
                generalPlaceholder = "Mission Statement";
                break;
            case 'GO':
                title = "Setup your Government Entity Account";
                namePlaceholder = "Entity Name"
                typePlaceholder = "Type of Entity";
                generalPlaceholder = "Area";
                break;
        }
        const updateUserData = {
            ...userData,
            "profile": {
                name,
                website,
                general,
                type,
                contact
            }
            
        }
        navigation.navigate("TagCause", { userData: updateUserData } );
    }


    const renderAccountType = () => {
        let title = "";
        let namePlaceholder = "";
        let websitePlaceholder = "Website";
        let contactPlaceholder = "Contact Person's Name";
        let typePlaceholder = "";
        let generalPlaceholder = "";
        switch (userData.account_type) {
            case 'UN':
                title = "Setup your University's Account";
                namePlaceholder = "University Name";
                typePlaceholder = "Department/Faculty";
                generalPlaceholder = "Student Population";
                break;
            case 'OR': 
                title = "Setup your Organization's Account";
                namePlaceholder = "Organization Name";
                typePlaceholder = "Industry";
                generalPlaceholder = "Number of Employee/Members";
                break;
            case 'NO':
                title = "Setup your Non-Profit's Account";
                namePlaceholder = "Non-Profit Name";
                generalPlaceholder = "Mission Statement";
                break;
            case "CO":
                title = "Setup your Corporation's Account";
                namePlaceholder = "Company Name";
                typePlaceholder = "Industry";
                generalPlaceholder = "Mission Statement";
                break;
            case 'GO':
                title = "Setup your Government Entity Account";
                namePlaceholder = "Entity Name"
                typePlaceholder = "Type of Entity";
                generalPlaceholder = "Area";
                break;
        }

        return { title, websitePlaceholder, contactPlaceholder, namePlaceholder, typePlaceholder, generalPlaceholder};
    }
*/}

    const { 
        title, 
        websitePlaceholder, 
        contactPlaceholder, 
        namePlaceholder, 
        typePlaceholder, 
        generalPlaceholder 
    } = renderAccountType();


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
            <View style={styles.headerContianer}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <SvgUri uri={backArrow} />
                </TouchableOpacity>
                
                <Text style={styles.heading}>Sign up</Text>
            </View>
            <Text style={styles.title}>{title}</Text>
            <ScrollView contentContainerStyle={styles.scrollViewContent}>
            <View style={styles.inputContainer}>
                <TextInput 
                    style={styles.input} 
                    onChangeText={setName}
                    value={name}
                    placeholder={namePlaceholder}
                    placeholderTextColor="#ABABAB"
                />
            </View>

            {typePlaceholder ? (
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    onChangeText={setType}
                    value={type}
                    placeholder={typePlaceholder}
                    placeholderTextColor="#ABABAB"
                />
            </View>
        ) : null}

            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    onChangeText={setGeneral}
                    value={general}
                    placeholder={generalPlaceholder}
                    placeholderTextColor="#ABABAB"
                />
            </View>

            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    onChangeText={setWebsite}
                    value={website}
                    placeholder={websitePlaceholder}
                    placeholderTextColor="#ABABAB"
                />
            </View>

            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    onChangeText={setContact}
                    value={contact}
                    placeholder={contactPlaceholder}
                    placeholderTextColor="#ABABAB"
                />
            </View>

            <MainButton onPress={handleNext} title="Register" style={styles.mainButton} />
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
    scrollViewContent: {
        flexGrow: 1,
        //alignItems: "center",
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
    headerContianer: {
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
        marginTop: 5, 
        marginBottom: 10,
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
        borderWidth: 1,
        borderColor: "#D6D6D6",
        borderRadius: 10,
        paddingVertical: "6%",
        paddingHorizontal: "5%",
        width: "100%",
        marginBottom: 15,
    },
    input: {
        width: "90%",
        paddingLeft: "4%",
        fontFamily: "Inter-Medium",
        //color: "#ABABAB",
        fontSize: 15,
    },
    mainButton: {
        marginTop: 20,
        width: "95%",
    },
})

export default RegisterScreen;