import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    ActivityIndicator,
    Image,
    TouchableOpacity,
    RefreshControl,
    ImageBackground,
    Platform
} from "react-native";
import axios from "axios";
import { useRoute, useNavigation } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { backArrow  } from '../../utils/icons';
import { SvgUri } from "react-native-svg";
import baseUrl from "../../utils/api";

const FollowersFollowingScreen = () => {
    const route = useRoute();
    const navigation = useNavigation();
    const { type, username } = route.params;
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [activeTab, setActiveTab] = useState(type);

    useEffect(() => {
        const fetchFollowersFollowing = async () => {
            try {
                const storedToken = await AsyncStorage.getItem("authToken");
                if (!storedToken) {
                    console.error("No token found");
                    return;
                }
                const response = await axios.get(`${baseUrl}/${activeTab}-user/`, {
                    headers: {
                        'Authorization': `Bearer ${storedToken}`,
                        'Content-Type': 'application/json',
                    },
                });
                setData(response.data);
            } catch (error) {
                console.error("Error fetching data", error);
            } finally {
                setLoading(false);
                setRefreshing(false);
            }
        };

        fetchFollowersFollowing();
    }, [activeTab]);

    const onRefresh = () => {
        setRefreshing(true);
        fetchFollowersFollowing();
    };

    const renderItem = ({ item }) => (
        <View style={styles.item}>
            <Image source={{ uri: item.profilePhoto || "https://via.placeholder.com/50" }} style={styles.profileImage} />
            <View style={styles.textContainer}>
                <Text style={styles.username}>
                    {item.following_first} {item.following_last}
                </Text>
            </View>
            <TouchableOpacity style={styles.followButton}>
                <Text style={styles.followButtonText}>
                    {item.followed ? "Following" : "Follow"}
                </Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <ImageBackground
            source={require("../../assets/main-background.png")}
            style={styles.backgroundImage}
        >
            {/* Loading Indicator with Background */}
            {loading && (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#FF8D00" />
                </View>
            )}

            {!loading && (
                <>
                    <View style={styles.header}>
                        <TouchableOpacity
                            style={styles.backButton}
                            onPress={() => navigation.goBack()}
                        >
                            <SvgUri uri={backArrow} />
                        </TouchableOpacity>
                        <Text style={styles.headertext}>@{username}</Text>
                    </View>

                    <View style={styles.tabContainer}>
                        <TouchableOpacity
                            style={[styles.tab, activeTab === 'followers' && styles.activeTab]}
                            onPress={() => setActiveTab('followers')}
                        >
                            <Text style={styles.tabText}>Followers</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.tab, activeTab === 'following' && styles.activeTab]}
                            onPress={() => setActiveTab('following')}
                        >
                            <Text style={styles.tabText}>Following</Text>
                        </TouchableOpacity>
                    </View>

                    <FlatList
                        data={data}
                        keyExtractor={(item) => item.follower_id.toString()}
                        renderItem={renderItem}
                        refreshControl={
                            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                        }
                    />
                </>
            )}
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    backgroundImage: {
        flex: 1,
        width: "100%",
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: "transparent",  
    },
    container: {
        flex: 1,
        backgroundColor: "transparent",
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: "15%",
        paddingHorizontal: 16,
    },
    backButton: {
        position: "absolute",
        left: 20,
        zIndex: 1,
    },
    headertext: {
        fontSize: 22,
        color: "#FFE600",
        fontFamily:'Poppins-Medium',
        textAlign: "center",
        flex: 1,
    },
    tabContainer: {
        flexDirection: "row",
        justifyContent: "center",
        marginBottom: 16,
        marginTop:"5%",
    },
    tab: {
        paddingVertical: 10,
        paddingHorizontal: 50,
        borderBottomWidth: 2,
        borderBottomColor: "transparent",
    },
    activeTab: {
        borderBottomColor: "#FF8D00",
    },
    tabText: {
        fontSize: 18,
        color: "white",
    },
    item: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: "#333",
    },
    profileImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 15,
    },
    textContainer: {
        flex: 1,
    },
    username: {
        color: "#FFF",
        fontSize: 18,
        fontWeight: "bold",
    },
    title: {
        color: "#AAA",
        fontSize: 14,
    },
    followButton: {
        backgroundColor: "#00C853",
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 20,
    },
    followButtonText: {
        color: "#FFF",
        fontSize: 14,
    },
});

export default FollowersFollowingScreen;