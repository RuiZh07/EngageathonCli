import React, { useState, useEffect, useContext, useRef } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ImageBackground,
    ScrollView,
    Alert,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { useNavigation, useRoute } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { backArrow } from '../../utils/icons';
import baseUrl from '../../utils/api';
import CollapsibleSection from '../../components/contentCreation/CollapsibleSection';
import { SvgUri } from "react-native-svg";

const TagCause = () => {
    const [causeTypes, setCauseTypes] = useState({});
    const [selectedCauseIds, setSelectedCauseIds] = useState([]);
    const [pressedStates, setPressedStates] = useState({});
    const navigation = useNavigation();
    const route = useRoute();
    const { userData } = route.params;
    
    useEffect(() => {
        if (userData) {
          console.log("User Data in tagCause:", userData);
        }
      }, [userData]);

    // effect to fetch data from the API 
    useEffect(() => {
        // Fetch cause types and initialize pressedStates based on categoryIdPost
        const fetchCauseTypes = async () => {
            try {
                const response = await fetch(`${baseUrl}/missions/categories/`);

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();

                // Categorize causes
                const categorized = data.reduce((acc, cause) => {
                    const classificationName = cause.classifications[0]?.classification || 'Unclassified';
                    if (!acc[classificationName]) {
                        acc[classificationName] = [];
                    }
                    acc[classificationName].push({ id: cause.id, name: cause.name });
                    return acc;
                }, {});
                setCauseTypes(categorized);

                // Initialize pressedStates based on selectedCauseIds
                const initialPressedStates = Object.keys(categorized).reduce((acc, classification) => {
                    categorized[classification].forEach(cause => {
                        acc[cause.name] = selectedCauseIds.includes(cause.id);
                    });
                    return acc;
                }, {});
                updatePressedStates(initialPressedStates);

            } catch (error) {
                console.error('Error fetching cause types:', error);
            }
        };
        fetchCauseTypes();
    }, []);

    const handleCauseButtonPress = (cause) => {
        const causeName = cause.name;
        const causeId = cause.id;
    
        setPressedStates((prevState) => ({
            ...prevState,
            [causeName]: !prevState[causeName],
        }));
        
        setSelectedCauseIds(prevState => {
            const newSelectedIds = prevState.includes(causeId)
                ? prevState.filter(id => id !== causeId)
                : [...prevState, causeId];

            return newSelectedIds;
        });
    };

    const updatePressedStates = (states) => {
        setPressedStates(states);
    };
    //console.log(selectedCauseIds);
    //console.log(pressedStates);
    
    // Function to handle button functionality.
    const handlePressShareBtn = async () => {
        try {
           // if (selectedCauseIds.length === 0) {
           //     Alert.alert("Validation Error", "No categories selected");
           //     return;
           // }
            navigation.navigate("InvitationScreen", { userData });
        } catch (error) {
            console.error('Error during share button press:', error);
        }
    };

    return (
        <ImageBackground
            source={require("../../assets/main-background.png")}
            style={styles.backgroundImage}
        >
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContentContainer}
                showsVerticalScrollIndicator={false}
            >
                {/* Header container that contains navigation button, text and "Share" button. */}
                <View style={styles.header}>
                    {/* Left header objects */}
                    <View style={styles.headerLeft}>
                        <TouchableOpacity
                            style={styles.button}
                            onPress={() => navigation.goBack()}
                        >
                            <SvgUri uri={backArrow} />
                        </TouchableOpacity>
                        <View style={styles.innerContainer}>
                            <Text style={styles.heading}>Causes</Text>
                            <Text style={styles.subHeading}>Select Up To 10</Text>
                        </View>
                    </View>

                    {/* Right header objects */}
                    <View style={styles.headerRight}>
                        <LinearGradient
                            colors={["#FF8D00", "#FFBA00", "#FFE600"]}
                            locations={[0.7204, 0.8602, 1]} 
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.shareButtonGradient}
                        >
                            <TouchableOpacity
                                style={styles.shareButton}
                                onPress={handlePressShareBtn}
                            >
                                <Text style={styles.shareButtonText}>Finish Profile</Text>
                            </TouchableOpacity>
                        </LinearGradient>
                    </View>
                </View>

                {/* Main content under the header, which contains the causes and causes types. */}
                <View style={styles.causeContainer}>
                    {Object.entries(causeTypes).map(([classificationName, causes]) => (
                        <CollapsibleSection
                            key={classificationName}
                            title={classificationName}
                            data={causes}
                            onPressItem={handleCauseButtonPress}
                            pressedStates={pressedStates}
                        />
                    ))}
                </View>

            </ScrollView>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    // Component main styles
    scrollView: {
        flex: 1,
        width: "100%",
    },
    scrollContentContainer: {
        flexGrow: 1,
    },
    backgroundImage: {
        flex: 1,
        width: "100%",
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        margin: 25,
        marginBottom: 15,
        marginTop: 60,
    },

    // Header component, left side
    headerLeft: {
        flexDirection: "row",
    },
    button: {
        justifyContent: "center",
    },
    innerContainer: {
        marginLeft: 20,
    },
    heading: {
        fontSize: 24,
        fontFamily: "poppins-Medium",
        color: "#FFE600",
    },
    subHeading: {
        fontSize: 14,
        fontFamily: "Inter-Regular",
        color: "#FFFFFF",
    },

    // Header component, right side
    headerRight: {
        alignItems: "center",
        justifyContent: "center",
    },
    shareButtonGradient: {
        borderRadius: 30,
    },
    shareButton: {
        alignItems: "center",
        justifyContent: "center",
        width: 107,
        height: 28,
        borderRadius: 30,
    },
    shareButtonText: {
        color: "#FFFFFF",
        fontSize: 13,
        fontWeight: "600",
    },

    // Main content objects, under header
    // Each different interest type containers
    causeContainer: {
        marginBottom: 70,
    },
    causeType: {
        backgroundColor: "#FFFFFF",
        height: "auto",
        borderRadius: 30,
        margin: 10,
        marginBottom: 10,
    },
    causeTypeName: {
        fontSize: 24,
        fontWeight: "bold",
        margin: 20,
        marginBottom: 10,
    },
    causeTypeContent: {
        flexDirection: "row",
        flexWrap: "wrap",
        marginTop: 10,
        marginBottom: 10,
        paddingBottom: 10,
    },
});

export default TagCause;