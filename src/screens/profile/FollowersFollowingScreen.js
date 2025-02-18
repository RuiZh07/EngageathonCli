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
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { backArrow  } from '../../utils/icons';
import { SvgUri } from "react-native-svg";
import baseUrl from "../../utils/api";
import apiClient from "../../services/apiClient";

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
                const storedToken = await AsyncStorage.getItem("AccessToken");
                if (!storedToken) {
                    console.error("No token found");
                    return;
                }
                const response = await apiClient.get(`${baseUrl}/${activeTab}-user/`, {
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

    // This function renders each item in the list
    const renderItem = ({ item }) => (
        <TouchableOpacity onPress={() => navigation.navigate("UserProfileScreen", { userID: item.following_id })} >
            <View style={styles.item}>
                <Image 
                    source={item?.profile_photo_url ? { uri: item.profile_photo_url } : require("../../assets/default_white_profile.png")}
                    style={styles.profileImage} 
                />
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
        </TouchableOpacity>
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

                    {data.length === 0 ? (
                        <Text style={styles.noDataMessage}>
                            {activeTab === 'followers' ? "You don't have any followers yet." : "You haven't followed anyone yet."}
                        </Text>
                    ) : (
                        <FlatList
                            data={data}
                            keyExtractor={(item) => item.following_id.toString()}
                            renderItem={renderItem}
                            refreshControl={
                                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                            }
                        />
                    )}
                    
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
        width: 45,
        height: 45,
        borderRadius: 22,
        marginRight: 15,
        borderWidth: 1,
        borderColor: '#00C853',
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
    noDataMessage: {
        marginTop: 10,
        textAlign: 'center',
        fontSize: 16,
        color: '#FFFFFF',
        fontFamily: "poppins-regular",
    }
});

export default FollowersFollowingScreen;