import { React, useState, useContext, useEffect, act } from 'react';
import { ImageBackground,
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    TextInput,
    Alert,
    ScrollView
} from 'react-native';
import Svg, { Path } from "react-native-svg";
import MainButton from "../../components/common/MainButton";
import { useNavigation } from "@react-navigation/native";
import ProgressBar from '../../components/contentCreation/ProgressBar';
import { CategoryContext } from '../../components/contentCreation/CategoryContext';

const CreateActivityScreen = () => {
    const [viewState, setViewState] = useState('noActivity');
    const [activityName, setActivityName] = useState('');
    const [activityPoints, setActivityPoints] = useState('');
    const { activities, setActivities } = useContext(CategoryContext);
    const navigation = useNavigation();

    // Toggles the view to 'createNewActivity' to allow the user to add a new activity
    const handleCreateNew = () => {
        setViewState('createNewActivity');
    };

    // Handles to cancel action
    // if there are activities, it switches to 'activityList', otherwise to 'noActivity'
    const handleCancel = () => {
        if (activities.length > 0) {
            setViewState('activityList');
        } else {
            setViewState('noActivity');
        }
    };

    useEffect(() => {
        if (activities.length > 0) {
            setViewState('activityList');
        } else {
            setViewState('noActivity');
        }
    }, [activities]);

    // Validate the user inputs for activity name and points
    const validateInputs = () => {
        if (!activityName) return { valid: false, error: "Activity name is required" };
        if (!activityPoints) return { valid: false, error: "Point value is required" };
        if (isNaN(activityPoints)) return {valid: false, error: "Point value must be a number" };

        return { valid: true, error: null };
    }
    
    const handleAddActivity = () => {
        const validation = validateInputs();
        if(!validation.valid) {
            Alert.alert("Validation Error", validation.error);
            return;
        };

        if (activityName && activityPoints) {
            setActivities([...activities, { name: activityName, points: Number(activityPoints) }]);
            setActivityName('');
            setActivityPoints('');
            setViewState('activityList');
        };
    };

    // Handles the 'Next' button press
    // Handles various states based on the current view
    const handleNextPress = () => {
        if (viewState === 'noActivity') {
            setViewState('createNewActivity')
        } else if (viewState === 'createNewActivity') {
            setViewState('activityList');    
        } else if (viewState === 'activityList') {
            if (activities.length === 0) {
                Alert.alert("No activities. Please add at least one activity.");
            } else {
                navigation.navigate('TagCauseEvent');
            }
        }
    };

    const navToCreateEvent = () => {
        navigation.goBack();
    };

    return (
        <ImageBackground
            source={require("../../assets/main-background.png")}
            style={styles.container}
        >
            <View style={styles.header}>
                <TouchableOpacity style={styles.headerLeft} onPress={navToCreateEvent}>
                    <Svg width={10} height={43} viewBox="0 0 10 18" fill="none" 
                        style={{ transform: [{ scale: 1.2 }] }}>
                        <Path
                            d="M10 2.57143L3.75 9L10 15.4286L8.75 18L0 9L8.75 0L10 2.57143Z"
                            fill="orange"
                        />
                    </Svg>
                </TouchableOpacity>
                <Text style={styles.headerText}>Create Event</Text>
            </View>

            <ProgressBar stage={2} />

            <Text style={styles.activityText}>Activities</Text>
            <View style={styles.activityContainer}>
               {viewState === 'noActivity' ? (
                    <View>
                        <Text style={styles.noActivityText}>No Activities Found</Text>
                        <TouchableOpacity style={styles.createNewButton} onPress={handleCreateNew}>
                            <Text style={styles.createNewText}>Create New</Text>
                        </TouchableOpacity>
                    </View>
                    ) : viewState === 'createNewActivity' ? (
                        <View style={styles.createActivity}>
                            <TextInput
                                style={styles.enterActivityName}
                                placeholder="Activity name"
                                placeholderTextColor="#575757"
                                value={activityName}
                                onChangeText={setActivityName}
                                multiline={true}
                            />
                            <TextInput
                                style={styles.enterPointValue}
                                placeholder="Point Value"
                                placeholderTextColor="#575757"
                                value={activityPoints}
                                onChangeText={setActivityPoints}
                            />
                            <TouchableOpacity style={styles.createNewButton} onPress={handleAddActivity}>
                                <Text style={styles.createNewText}>Create New</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
                                <Text style={styles.cancelText}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <View style={styles.activityList}>
                            <ScrollView style={styles.activityListScroll}>
                            {activities.map((activity, index) => (
                                <View key={index} style={styles.singleActivity}>
                                    <View style={styles.activityNameStyle}>
                                        <Text style={styles.activityName}>{activity.name}</Text>
                                    </View>
                                    <View style={styles.pointsEarned}>
                                        <Text style={styles.points}>{activity.points}</Text>
                                        <View style={styles.pointsTextContainer}>
                                            <Text style={styles.pointsText}>Points</Text>
                                            <Text style={styles.earnedText}>Earned</Text>
                                        </View>
                                    </View>
                                </View>
                            ))}
                            </ScrollView>
                            <TouchableOpacity style={styles.createNewButton} onPress={handleCreateNew}>
                                <Text style={styles.createNewText}>Create New</Text>
                            </TouchableOpacity>
                        </View>  
                    )
                }
        
                <View style={{ marginTop: "10%" }}>
                    <MainButton style={styles.mainButton} title="Next" onPress={handleNextPress}/>
                </View>
            </View>
        </ImageBackground>
    )
};

export default CreateActivityScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "flex-start",
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
        paddingHorizontal: "5%",
        marginTop: "12%",
    },  
    headerLeft: {
        marginTop: 13, 
        marginLeft: 10,
    },  
    headerText: {
        color: "#FFE600",
        fontSize: 26,
        fontFamily: "poppins-regular",
        paddingLeft: 20,
        paddingTop: 12,
    },
    activityText: {
        color: "#FFE600",
        fontSize: 20,
        marginTop: 15,
        marginLeft: 30,
        fontFamily: "poppins-semibold",
    },
    activityContainer: {
        flex: 1,
        backgroundColor: "#2D2C2C",
        paddingTop: "5%",
        paddingBottom: "7%",
        marginTop: "4%",
        marginHorizontal: "5%",
        borderTopLeftRadius: 50,
        borderTopRightRadius: 50,
    },
    noActivityText: {
        fontSize: 20,
        color: "#897A7A",
        textAlign: 'center',
        marginTop: "40%",
        fontFamily: "poppins-semibold",
    },
    createNewButton: {
        borderRadius: 10,
        paddingVertical: 10,
        alignItems: 'center',
        marginHorizontal: 70,
        marginTop: 20,
        backgroundColor: "#2BAB47",
    },
    createNewText: {
        fontFamily: "poppins-semibold",
        color: 'white',
    },
    createActivity: {
        backgroundColor: "white",
        borderRadius: 30,
        marginHorizontal: 15,
    },
    enterActivityName: {
        backgroundColor: "#efefef",
        borderRadius: 30,
        padding: 14,
        paddingLeft: 17,
        marginHorizontal: 20,
        marginTop: 40,
    },
    enterPointValue: {
        backgroundColor: "#efefef",
        borderRadius: 30,
        padding: 14,
        paddingLeft: 17,
        marginHorizontal: 20,
        marginVertical: 10,
    },
    cancelButton: {
        borderRadius: 10,
        paddingVertical: 10,
        alignItems: 'center',
        marginHorizontal: 70,
        marginTop: 18,
        marginBottom: 40,
        backgroundColor: "#AB2B2B",
    },
    cancelText: {
        fontFamily: "poppins-semibold",
        color: 'white',
    },
    activityListScroll: {
        maxHeight: 400,
    },
    singleActivity: {
        paddingVertical: 6,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'orange',
        backgroundColor: 'white',
        marginHorizontal: 30,
        paddingLeft: 14,
        marginBottom: 12,
        flexDirection: 'row',
        justifyContent: "flex-start",
        alignItems: 'center',
    },
    activityName: {
        color: 'grey',
        fontSize: 18,
        fontFamily: "poppins-semibold",
        flexWrap: 'wrap',
        alignSelf: 'left',
    },
    pointsEarned: {
        flexDirection: "row",
        marginLeft: 'auto',
    },
    points: {
        fontSize: 24,
        fontFamily: "poppins-semibold",
        marginRight: 6,
        color: 'orange',
        flexWrap: 'wrap',
    },
    pointsTextContainer: {
        marginRight: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    pointsText: {
        fontSize: 10,
    },
    earnedText: {
        fontSize: 10,
    },
    activityNameStyle: {
        width: '60%',
    },
    mainButton: {
        width: "80%",
        alignSelf:'center',
    },
});