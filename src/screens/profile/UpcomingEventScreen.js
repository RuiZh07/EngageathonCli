import React, { useEffect, useState } from "react";
import {
    StyleSheet,
    Image,
    Text,
    View,
    ScrollView,
    TouchableOpacity,
    ImageBackground,
    ActivityIndicator,
    RefreshControl,
} from "react-native";
import apiClient from "../../services/apiClient";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { backArrow } from "../../utils/icons";
import moment from 'moment-timezone';
import baseUrl from "../../utils/api";
import { SvgUri } from "react-native-svg";

const UpcomingEventScreen = ({ navigation }) => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState(null);

    const fetchEvents = async () => {
        try {
            const storedToken = await AsyncStorage.getItem("AccessToken");
            if (!storedToken) {
                console.error("No token found");
                return;
            }
        
            const response = await apiClient.get(`${baseUrl}/user-content/?content_types=event`, {
                headers: {
                    'Authorization': `Bearer ${storedToken}`,
                    'Content-Type': 'application/json',
                },
            });
        
            setEvents(response.data.slice(3));
            console.log('event',events);
            setError(null);
        } catch (error) {
            console.error("Error fetching events data", error);
            setError("Failed to load events. Please try again.");
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        fetchEvents();
    };

    // Group events into two groups: past events and future events. 
    // Organize the future events by the month they occur in
    const groupEventsByMonth = (events) => {
        const now = moment();
        return events.reduce((groups, event) => {
            const eventStartDate = moment(event.datetime_start);
            const month = eventStartDate.format('MMMM');

            // Check if it is a past event
            if(eventStartDate.isBefore(now)) {
                groups.pastEvents.push(event); // Add past events to pastEvents array
            } else {
                if (!groups.futureEvents[month]) {
                    groups.futureEvents[month] = [];
                }
                groups.futureEvents[month].push(event); // Add the event to the month
            }

            return groups;
        }, {pastEvents: [], futureEvents:{}});
    };

    const eventGroups = groupEventsByMonth(events);

    // Sort the future events months in chronological order
    const sortedFutureMonths = Object.keys(eventGroups.futureEvents).sort((a, b) => 
        moment(a, 'MMMM').isBefore(moment(b, 'MMMM')) ? -1 : 1
    );

    eventGroups.pastEvents.sort((a, b) => moment(b.datetime_start).isBefore(moment(a.datetime_start)) ? -1 : 1);

    return (
        <ImageBackground
            source={require("../../assets/main-background.png")}
            style={styles.backgroundImage}
        >
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContentContainer}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                <View style={styles.header}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => navigation.goBack()}
                    >
                        <SvgUri uri={backArrow} />
                    </TouchableOpacity>
                    <Text style={styles.headerText}>Upcoming Events</Text>
                </View>
    
                <Text style={styles.subHeaderText}>Click on each event to view the Event Hub and QR Code</Text>
    
                {error ? (
                    <Text style={styles.errorText}>{error}</Text>
                ) : (
                    sortedFutureMonths.length > 0 ? (
                        sortedFutureMonths.map((month, index) => (
                            <View key={index} style={styles.monthSection}>
                                <Text style={styles.monthHeader}>{month}</Text>
                                {eventGroups.futureEvents[month].map((event, index) => (
                                    <TouchableOpacity
                                        key={index}
                                        style={styles.eventCardFuture}
                                        onPress={() => navigation.navigate('QRCodeScreen', { event })}
                                    >
                                        <Image
                                            source={{ uri: event.image_urls[0]?.image_url || "" }}
                                            style={styles.eventImage}
                                        />
                                        <View style={styles.eventDetails}>
                                            <Text style={styles.eventName}>{event.name}</Text>
                                            <Text style={styles.eventOrg}>Organization</Text>
                                            <View style={styles.eventDateTime}>
                                                <Text style={styles.eventDate}>
                                                    {moment(event.datetime_start).tz('America/New_York').format('MM/DD/YY')}
                                                </Text>
                                                <Text style={styles.eventTime}>
                                                    {moment(event.datetime_start).tz('America/New_York').format('h:mm A z')}
                                                </Text>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        ))
                    ) : (
                        <Text style={styles.noFutureText}>No future events yet...</Text>
                    ) 
                )}

                {eventGroups.pastEvents.length > 0 && (
                    <View style={styles.pastEventSection}>
                        <Text style={styles.pastEventsText}>Past Events</Text>
                        {eventGroups.pastEvents.map((event, index) => (
                            <TouchableOpacity
                                key={index}
                                style={styles.eventCard}
                                onPress={() => navigation.navigate('QRCodeScreen', { event })}
                            >
                                <Image
                                    source={{ uri: event.image_urls[0]?.image_url || "" }}
                                    style={styles.eventImage}
                                />
                                <View style={styles.eventDetails}>
                                    <Text style={styles.eventName}>{event.name}</Text>
                                    <Text style={styles.eventOrg}>Organization</Text>
                                    <View style={styles.eventDateTime}>
                                        <Text style={styles.eventDate}>
                                            {moment(event.datetime_start).tz('America/New_York').format('MM/DD/YY')}
                                        </Text>
                                        <Text style={styles.eventTime}>
                                            {moment(event.datetime_start).tz('America/New_York').format('h:mm A z')}
                                        </Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}
            </ScrollView>
            {loading && (
                <View style={styles.loadingOverlay}>
                <ActivityIndicator size="large" color="#FFE600" />
                <Text style={styles.loadingText}>Loading...</Text>
                </View>
            )}
        </ImageBackground>
    );
};
    
const styles = StyleSheet.create({
    backgroundImage: {
        flex: 1,
        width: "100%",
    },
    scrollView: {
        flex: 1,
        width: "100%",
    },
    scrollContentContainer: {
        flexGrow: 1,
        alignItems: "center",
        paddingBottom: 130,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
        paddingHorizontal: "5%",
        marginTop: "20%",
    },
    headerText: {
        color: "#FFE600",
        fontSize: 22,
        position: 'absolute',
        left: '15%', 
        fontFamily: "Poppins-Medium",
    },
    subHeaderText: {
        color: "#FFFFFF",
        fontSize: 16,
        textAlign: "left",
        fontFamily: "Poppins-Medium",
        paddingHorizontal: "5%",
        marginTop: 20,
        marginBottom: 20,
    },
    errorText: {
        color: "red",
        textAlign: "center",
        marginBottom: 20,
    },
    monthSection: {
        width: "90%",
        marginVertical: 10,
    },
    monthHeader: {
        fontSize: 20,
        color: "#FFFFFF",
        marginBottom: 5,
        fontFamily: "Poppins-Medium"
    },
    eventCardFuture: {
        flexDirection: "row",
        backgroundColor: "#FFFFFF",
        borderRadius: 10,
        padding: 10,
        marginVertical: 7,
        alignItems: "center",
        justifyContent: "space-between",
    },
    eventCard: {
        flexDirection: "row",
        backgroundColor: "#FFFFFF",
        borderRadius: 10,
        padding: 10,
        marginVertical: 7,
        alignItems: "center",
        justifyContent: "space-between",
        marginHorizontal: 14,
        width: '90%',
    },
    eventImage: {
        width: 60,
        height: 60,
        borderRadius: 30,
    },
    eventDetails: {
        marginLeft: 10,
        flex: 1,
    },
    eventName: {
        fontSize: 18,
        fontWeight: "bold",
    },
    eventOrg: {
        fontSize: 14,
        color: "#555",
    },
    eventDateTime: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 5,
    },
    eventDate: {
        fontSize: 14,
        color: "#555",
    },
    eventTime: {
        fontSize: 14,
        color: "#555",
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#000",
    },
    loadingOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Optional: to give a dark overlay
    },
    loadingText: {
        marginTop: 10,
        color: '#FFE600',
        fontSize: 16,
    },
    pastEventSection: {
        marginTop: 20,
    },
    pastEventsText: {
        color: '#FFFFFF',
        fontSize: 18,
        textAlign: 'left',
        paddingLeft: 20,
        fontFamily: "Poppins-Medium",
    },
    noFutureText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontFamily: "Poppins-Medium",
    },
});

export default UpcomingEventScreen;