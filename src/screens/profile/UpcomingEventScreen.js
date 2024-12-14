import React, { useEffect, useState } from "react";
import {
    StatusBar,
    StyleSheet,
    Image,
    Text,
    View,
    ScrollView,
    TouchableOpacity,
    ImageBackground,
    Dimensions,
    Alert,
    ActivityIndicator,
    RefreshControl,
} from "react-native";
import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { backArrow } from "../../utils/icons";
import { Platform } from "react-native";
import { useNavigation } from '@react-navigation/native';
import moment from "moment";
import baseUrl from "../../utils/api";
import { SvgUri } from "react-native-svg";

const UpcomingEventScreen = ({ navigation }) => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState(null);

    const fetchEvents = async () => {
        try {
            const storedToken = await AsyncStorage.getItem("authToken");
            if (!storedToken) {
                console.error("No token found");
                return;
            }
        
            const response = await axios.get(`${baseUrl}/user-content/?content_types=event&content_types=post`, {
                headers: {
                'Authorization': `Bearer ${storedToken}`,
                'Content-Type': 'application/json',
                },
            });
        
            setEvents(response.data);
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

    const getCoverImageUrl = (imageUrls) => {
        const coverImage = imageUrls.find(image => image.cover_image);
        return coverImage ? coverImage.image_url : "default_image_url";
    };

    const groupEventsByMonth = (events) => {
        return events.reduce((groups, event) => {
            const month = moment(event.datetime_start).format('MMMM');
            if (!groups[month]) {
                groups[month] = [];
            }
            groups[month].push(event);
            return groups;
        }, {});
    };

    const eventGroups = groupEventsByMonth(events);

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
                        Object.keys(eventGroups).map((month, index) => (
                            <View key={index} style={styles.monthSection}>
                                <Text style={styles.monthHeader}>{month}</Text>
                                {eventGroups[month].map((event, idx) => (
                                    <TouchableOpacity
                                        key={idx}
                                        style={styles.eventCard}
                                        onPress={() => navigation.navigate('QRCodeScreen', { event })}
                                    >
                                        <Image
                                            source={{ uri: `data:image/png;base64,${getCoverImageUrl(event.image_urls)}` }}
                                            style={styles.eventImage}
                                        />
                                        <View style={styles.eventDetails}>
                                            <Text style={styles.eventName}>{event.name}</Text>
                                            <Text style={styles.eventOrg}>Organization</Text>
                                            <View style={styles.eventDateTime}>
                                                <Text style={styles.eventDate}>{moment(event.datetime_start).format('MM/DD/YY')}</Text>
                                                <Text style={styles.eventTime}>{moment(event.datetime_start).format('h:mm A')} EST</Text>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        ))
                    )
                }
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
        fontSize: 24,
        color: "#FFFFFF",
        marginBottom: 10,
    },
    eventCard: {
        flexDirection: "row",
        backgroundColor: "#FFFFFF",
        borderRadius: 10,
        padding: 10,
        marginVertical: 5,
        alignItems: "center",
        justifyContent: "space-between",
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
});

export default UpcomingEventScreen;