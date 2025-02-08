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
import apiClient from '../../services/apiClient';
import { useRoute, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import baseUrl from '../../utils/api';
import { backArrow } from '../../utils/icons';
import { SvgUri } from "react-native-svg";
import LinearGradient from "react-native-linear-gradient";

const LeaderboardScreen = () => {
    const route = useRoute();
    const navigation = useNavigation();
    const [leaderboardData, setLeaderboardData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const { eventId } = route.params;
    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const storedToken = await AsyncStorage.getItem("AccessToken");
                if (!storedToken) {
                    console.error("No token found");
                    return;
                }
                const response = await apiClient.get(`${baseUrl}/events/leaderboard/${eventId}/`, {
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
    }, [eventId]);
  
    // Sort by score first in descending order, and by username if scores are tied
    const sortedLeaderBoard = leaderboardData.sort((a,b) => {
        if (b.points === a.points) {
            return a.user.localeCompare(b.user);
        }
        return b.points - a.points;
    });

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
                ) : sortedLeaderBoard.length === 0 ? (
                    <View style={styles.no}>
                        <Text style={styles.noLeaderboardText}>No Leaderboard data available</Text>
                    </View>
                ) : (
                    sortedLeaderBoard.map((item, index) => (
                        <View key={index} style={styles.eventCard}>
                            <LinearGradient
                                colors={["#FF8D00", "#FFBA00", "#FFE600"]}
                                locations={[0.72, 0.86, 1]}  
                                start={{ x: 0, y: 0 }}      
                                end={{ x: 1, y: 0 }}
                                style={styles.rankContainer}
                            >
                                <Text style={styles.ranking}>{index+1}</Text>
                            </LinearGradient>
                            <View style={styles.namePointContainer}>
                                <Text style={styles.eventName}>{item.user}</Text>
                                {/*<Text style={styles.eventOrg}>{item.event}</Text>*/}
                                <Text style={styles.points}>{item.points} Points Redeemed</Text>
                            </View>
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
        marginTop: '10%',
    },
    scrollContentContainer: {
        flexGrow: 1,
        alignItems: "center",
        paddingBottom: 130,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        width: '100%',
        paddingHorizontal: '5%',
        marginTop: 20, 
        marginBottom: 20,
    },
    headerText: {
        color: '#FFE600',
        fontSize: 24,
        fontFamily: "Poppins-Medium",
        marginLeft: 20,
    },
    eventCard: {
        backgroundColor: "#FFFFFF",
        borderRadius: 10,
        padding: 10,
        marginVertical: 5,
        alignItems: "center",
        width: "85%",
        flexDirection: 'row',
        //backgroundColor: "#464646"
    },
    rankContainer: {
        width: 40,
        height: 40,
        //paddingHorizontal: 16,
        //paddingVertical: 8,
        borderRadius: 20,
        marginRight: 25,
        justifyContent: 'center',
        alignItems: 'center',
    },
    ranking: {
        fontSize: 17,
        fontFamily: "Poppins-Medium",
    },
    eventName: {
        fontSize: 17,
        fontFamily: "Poppins-Medium",
    },
    eventOrg: {
        fontSize: 14,
        color: "#555",
    },
    points: {
        fontSize: 14,
        color: '#747474',
        fontFamily: "Inter-Regular"
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
    noLeaderboardText: {
        marginTop: 20,
        textAlign: 'center',
        color: "white",
        fontSize: 18,
        fontFamily: "Poppins-Regular",
    },
});
  
export default LeaderboardScreen;