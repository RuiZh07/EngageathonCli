import React from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ImageBackground,
    ScrollView,
} from 'react-native';
import { Platform } from "react-native";
import { backArrow, addCameraIcon } from '../../utils/icons';
import { SvgUri } from "react-native-svg";

const EventHubScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { event } = route.params;

    const handleViewLeaderboard = () => {
        // Pass the user ID as a parameter to the leaderboard screen
        navigation.navigate('LeaderboardScreen', { userId: 4 });
    };

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
                    <Text style={styles.headerText}>{event.name}</Text>
                </View>
                <ScrollView contentContainerStyle={styles.contentContainer}>
                    <Text style={styles.description}>{event.description}</Text>
                    <Text style={styles.username}>{event.organizer}</Text>
                    <View style={styles.activitiesHeader}>
                        <Text style={styles.activitiesTitle}>Activities</Text>
                        <TouchableOpacity onPress={handleViewLeaderboard}>
                            <Text style={styles.viewLeaderboard}>View Leaderboard</Text>
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.totalPoints}>Total Points Earned: {event.totalPoints}</Text>
                    {event.activities.length === 0 ? (
                        <Text style={styles.noActivitiesText}>No activities available for this event.</Text>
                    ) : (
                        event.activities.map((activity, index) => (
                        <View key={index} style={styles.activityContainer}>
                            <Text style={styles.activityText}>{activity.name}</Text>
                            <Text style={styles.activityPoints}>{activity.points}</Text>
                            <View style={styles.activityStatus}>
                                {/*
                            <Feather
                                name="check-circle"
                                size={24}
                                color={activity.completed ? "#FF8D00" : "#CCCCCC"}
                            />
                            */}
                            </View>
                        </View>
                        ))
                    )}
                    <View style={styles.cameraButtonContainer}>
                        <TouchableOpacity onPress={() => console.log('Camera pressed')} disabled={event.activities.length === 0}>
                             {/*
                        <Feather
                            name="camera"
                            size={40}
                            color={event.activities.length === 0 ? "#CCCCCC" : "#FFFFFF"}
                        />
                        */}
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </View>
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
        justifyContent: 'space-between',
        width: '100%',
        paddingHorizontal: '5%',
        marginBottom: 20, 
        marginTop: 5, 
    },
    backButton: {
        marginTop: 15, 
    },
    headerText: {
        color: '#FFE600',
        fontSize: 32,
        position: 'absolute',
        left: '20%',
        top: 10, 
    },
    contentContainer: {
        padding: 20,
        paddingTop: 0,
        alignItems: 'center',
    },
    description: {
        color: '#FFFFFF',
        fontSize: 14,
        marginVertical: 10,
        textAlign: 'center',
    },
    username: {
        color: '#FFFFFF',
        fontSize: 14,
        marginBottom: 20,
        textAlign: 'center',
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
    },
    viewLeaderboard: {
        color: '#FF8D00',
        fontSize: 14,
    },
    totalPoints: {
        color: '#FFFFFF',
        fontSize: 18,
        marginBottom: 10,
    },
    activityContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        padding: 15,
        marginBottom: 10,
        width: '100%',
        borderWidth: 2,
        borderColor: '#FF8D00',
    },
    activityText: {
        color: '#000000',
        fontSize: 18,
    },
    activityPoints: {
        color: '#FF8D00',
        fontSize: 18,
    },
    activityStatus: {
        alignItems: 'flex-end',
    },
    cameraButtonContainer: {
        marginTop: 20,
    },
    noActivitiesText: {
        color: '#FFFFFF',
        fontSize: 16,
        textAlign: 'center',
        marginVertical: 20,
    },
});

export default EventHubScreen;
