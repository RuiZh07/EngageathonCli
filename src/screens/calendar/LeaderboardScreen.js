import React, { useEffect, useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    TouchableOpacity,
    ImageBackground,
    ActivityIndicator,
    RefreshControl,
} from 'react-native';  // Added RefreshControl here
import axios from 'axios';
import { useRoute, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import baseUrl from '../../utils/api';
import { backArrow } from '../../utils/icons';
import { SvgUri } from "react-native-svg";

const LeaderboardScreen = () => {
    const route = useRoute();
    const navigation = useNavigation();
    const [leaderboardData, setLeaderboardData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const { userId } = route.params;
  
    useEffect(() => {
      const fetchLeaderboard = async () => {
        try {
            const storedToken = await AsyncStorage.getItem("authToken");
            if (!storedToken) {
                console.error("No token found");
                return;
            }
            const response = await axios.get(`${baseUrl}/events/leaderboard/${userId}/`, {
                headers: {
                'Authorization': `Bearer ${storedToken}`,
                'Content-Type': 'application/json',
                },
            });
                setLeaderboardData(response.data);
            } catch (error) {
                console.error("Error fetching leaderboard data", error);
            } finally {
                setLoading(false);
                setRefreshing(false);
            }
        };
  
        fetchLeaderboard();
    }, [userId]);
  
    const onRefresh = () => {
        setRefreshing(true);
        fetchLeaderboard();
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
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            >
                <View style={styles.header}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => navigation.goBack()}
                    >
                        <SvgUri uri={backArrow} />
                    </TouchableOpacity>
                    <Text style={styles.headerText}>Leader Board</Text>
                </View>
        
                {loading ? (
                    <View style={styles.loadingOverlay}>
                        <ActivityIndicator size="large" color="#FFE600" />
                        <Text style={styles.loadingText}>Loading...</Text>
                    </View>
                ) : (
                    leaderboardData.map((item, index) => (
                        <View key={index} style={styles.eventCard}>
                            <Text style={styles.eventName}>{item.user}</Text>
                            <Text style={styles.eventOrg}>{item.event}</Text>
                            <Text style={styles.points}>Points: {item.points}</Text>
                        </View>
                    ))
                )}
            </ScrollView>
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
        marginTop: "15%",
    },
    headerText: {
        color: "#FFE600",
        fontSize: 28,
        position: 'absolute',
        left: '20%',
    },
    eventCard: {
        flexDirection: "row",
        backgroundColor: "#FFFFFF",
        borderRadius: 10,
        padding: 10,
        marginVertical: 5,
        marginTop:'15%',
        alignItems: "center",
        width: "90%",
        justifyContent: "space-between",
    },
    eventName: {
        fontSize: 18,
        fontWeight: "bold",
    },
    eventOrg: {
        fontSize: 14,
        color: "#555",
    },
    points: {
        fontSize: 16,
        color: '#000000',
    },
    loadingOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    loadingText: {
        marginTop: 10,
        color: '#FFE600',
        fontSize: 16,
    },
});
  
export default LeaderboardScreen;