import React, { useState } from 'react';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ImageBackground,
    ScrollView,
    Alert,
    Image,
    Platform,
} from 'react-native';
import { backArrow, addCameraIcon, blackCircle } from '../../utils/icons';
import { SvgUri } from "react-native-svg";
import QRCodeScannerModal from '../../components/common/QRCodeScannerModal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiClient from "../../services/apiClient";
import baseUrl from "../../utils/api";

const EventHubScreen = () => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [scannedData, setScannedData] = useState(null);
    const [eventState, setEventState] = useState(event);
    const navigation = useNavigation();
    const route = useRoute();
    const { event } = route.params;

    const handleViewLeaderboard = () => {
        if (event.activities.length === 0) {
            Alert.alert("Leaderboard is not available for this event");
        } else {
            // Pass the user ID as a parameter to the leaderboard screen
            navigation.navigate('LeaderboardScreen', { eventId: event.id });
        }  
    };

    const handleScanSuccess = async (scannedData) => {
        setScannedData(scannedData); 
        console.log(scannedData);
        // Call the scan API after updating the UI
        await scanActivity(scannedData);
    };

    const scanActivity = async (scannedData) => {
        try {
            const accessToken = await AsyncStorage.getItem("AccessToken");
            if(!accessToken) {
                console.error("no token found");
                return;
            }
            console.log('scannedData in eventhub', scannedData);
            const response = await apiClient.post(`${baseUrl}/events/activity/check/${event.id}/`, `token=${scannedData}`, {
                headers: {
                    "Authorization": `Bearer ${accessToken}`,
                    "Content-Type": "application/x-www-form-urlencoded",

                },
            });
            console.log(response.data.message);
            //navigation.replace('EventHubScreen', { event });
        } catch (error) {
            console.error("Error scanning the QR code", error);
        }
    }

    return (
        <ImageBackground source={require('../../assets/main-background.png')} style={styles.backgroundImage}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => navigation.goBack()}
                    >
                        <SvgUri uri={backArrow} />
                    </TouchableOpacity>
                    <Text style={styles.headerText} 
                        numberOfLines={1} 
                        ellipsizeMode="tail"
                    >
                        {event.name}
                    </Text>
                </View>
                <ScrollView contentContainerStyle={styles.contentContainer}>
                    <Text style={styles.description}>{event.description}</Text>
                    <Text style={styles.username}>@ {event.username}</Text>
                    <View style={styles.activitiesHeader}>
                        <Text style={styles.activitiesTitle}>Activities</Text>
                        <TouchableOpacity onPress={handleViewLeaderboard}>
                            <Text style={styles.viewLeaderboard}>View Leaderboard</Text>
                        </TouchableOpacity>
                    </View>
                    {/*<Text style={styles.totalPoints}>Total Points Earned: {event.totalPoints}</Text>*/}
                    {event.activities.length === 0 ? (
                        <Text style={styles.noActivitiesText}>No activities available for this event.</Text>
                    ) : (
                        event.activities.map((activity, index) => (
                        <View key={index} style={styles.activityContainer}>
                            <Text style={styles.activityText}>{activity.name}</Text>
                            <Text style={styles.activityPoints}>{activity.points}</Text>
                            <View style={styles.activityStatus}>
                            {activity.confirmed ? (
                                <Image
                                    source={require('../../assets/icons/greenCheckmark.png')} 
                                    style={styles.circleImage}
                                />
                            ) : (
                                <SvgUri uri={blackCircle}/>
                            )}
                            </View>
                        </View>
                        ))
                    )}
                    {event.activities.length !== 0 && 
                        <View style={styles.cameraButtonContainer}>
                            <TouchableOpacity 
                                onPress={() => setIsModalVisible(true)} 
                                disabled={event.activities.length === 0 || event.activities.every(activity => activity.confirmed)}
                            >
                                <SvgUri 
                                    uri={addCameraIcon} 
                                    width="40"
                                    height="40"
                                />
                            </TouchableOpacity>
                        </View>
                    }
                    
                </ScrollView>
            </View>
            {isModalVisible && 
                <QRCodeScannerModal
                   isVisible={isModalVisible} 
                   onClose={() => setIsModalVisible(false)}
                   onScanSuccess={handleScanSuccess}
                />
            }
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    backgroundImage: {
        flex: 1,
        width: '100%',
    },
    container: {
        flex: 1,
        marginTop: '10%', 
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '95%',
        paddingHorizontal: '5%',
        marginTop: 20, 
    },
    backButton: {
        //marginTop: 15, 
    },
    headerText: {
        color: '#FFE600',
        fontSize: 24,
        fontFamily: "Poppins-Medium",
        marginLeft: 20,
        overflow: 'hidden',    
    },
    contentContainer: {
        padding: 20,
        paddingTop: 0,
        alignItems:'center',
    },
    description: {
        color: '#FFFFFF',
        fontSize: 14,
        marginVertical: 10,
        lineHeight: 20,
        fontFamily: "Inter-Regular",
        alignSelf:'left',
    },
    username: {
        color: '#FFFFFF',
        fontSize: 14,
        marginTop: 10,
        marginBottom: 20,
        fontFamily: "Poppins-Medium",
        width: '100%',
    },
    activitiesHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        alignItems: 'center',
        marginBottom: 10,
    },
    activitiesTitle: {
        color: '#FFE600',
        fontSize: 24,
        fontFamily: "Poppins-Medium",
    },
    viewLeaderboard: {
        color: '#FF8D00',
        fontSize: 16,
        fontFamily: "Poppins-Medium",
    },
    totalPoints: {
        color: '#FFFFFF',
        fontSize: 16,
        marginBottom: 10,
        textAlign: 'left',
        fontFamily: "Poppins-Medium",
        width: '100%',
    },
    activityContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        paddingHorizontal: 15,
        paddingVertical: 10,
        marginBottom: 10,
        width: '100%',
        borderWidth: 2,
        borderColor: '#FF8D00',
        flexWrap: 'wrap',
    },
    activityText: {
        color: '#404040B8',
        fontSize: 17,
        fontFamily: "Poppins-Medium",
        flexWrap: 'wrap',
        maxWidth: '75%',
    },
    activityPoints: {
        color: '#FF8D00',
        fontSize: 20,
        marginLeft: 'auto',
        fontFamily: "Poppins-Medium",
    },
    activityStatus: {
        alignItems: 'flex-end',
        marginLeft: 10,
    },
    cameraButtonContainer: {
        marginTop: 15,
        marginBottom: 15,
        backgroundColor: '#FFFFFF',
        padding: 20,
        borderRadius: 50,
    },
    noActivitiesText: {
        color: '#FFFFFF',
        fontSize: 16,
        textAlign: 'center',
        marginVertical: 20,
    },
});

export default EventHubScreen;
