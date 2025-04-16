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
    Platform,
    Alert,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
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
    const [followerList, setFollowersList] = useState([]);
    const [followingList, setFollowingList] = useState([]);
    const [labelOverrides, setLabelOverrides] = useState({});

    // Fetch either followers or following list from API depending on the active tab
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

            // Save data for rendering
            setData(response.data);

            // Save lists separately to support mutual-follow logic
            if (activeTab === 'followers') {
                setFollowersList(response.data);
            } else if (activeTab === 'following') {
                setFollowingList(response.data);
            }

        } catch (error) {
            console.error("Error fetching data", error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    // Refech data when user switched between tabs - followers/following
    useEffect(() => {
        fetchFollowersFollowing();
    }, [activeTab]);

    // Triggers data reload when user pulls to refresh
    const onRefresh = () => {
        setRefreshing(true);
        fetchFollowersFollowing();
    };

    // Checks if they are mutually followed in the followers list
    const isMutual = (item) => {
        if (activeTab === 'followers') {
            return followingList.some(f => f.following_id === item.follower_id);
        }
        // On 'Following' tab, all users are being followed
        return true;
    };

    // Determines what the button label should be for each user
    const getButtonLabel = (item) => {
        const userID = activeTab === 'followers' ? item.follower_id : item.following_id;
      
        // Check if an override exists (from follow/unfollow action)
        if (labelOverrides[userID]) {
            return labelOverrides[userID];
        }
      
        // Default logic
        return activeTab === 'followers'
            ? (isMutual(item) ? 'Following' : 'Follow')
            : 'Following';
    };
      
    // Sends follow/unfollow request
    const sendRequest = async (userID) => {
        const token = await AsyncStorage.getItem("AccessToken");
        if (!token) {
            console.error("No token found");
            return;
        }
    
        try {
            const response = await apiClient.post(`${baseUrl}/follow-user/${userID}/`, null, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            });

            console.log("Response message:", response.data.message);
            return response.data;
        } catch (error) {
            console.log("Failed to follow/unfollow user: ", error.message);
            throw error;
        }
    };

    // Handles follow/unfollow button press based on current label
    const handleFollowPress = (item) => {
        const userID = activeTab === 'followers' ? item.follower_id : item.following_id;
        const label = getButtonLabel(item);
        
        // If currently following, prompt to unfollow
        if (label === 'Following') {
            Alert.alert(
                "Unfollow",
                "Unfollow this User?",
                [
                    { text: 'Cancel', style: 'cancel' },
                    {
                        text: 'Unfollow',
                        onPress: async () => {
                            const res = await sendRequest(userID);
                            if (res?.followed === false) {
                                // Update local label override only
                                setLabelOverrides(prev => ({ ...prev, [userID]: 'Follow' }));
                            }
                        }
                    }
                ]
            )
        } else {
            // If not following yet, follow directly
            sendRequest(userID).then((res) => {
                if (res?.followed === true) {
                    // Update label to 'Following' after successful
                    setLabelOverrides(prev => ({ ...prev, [userID]: 'Following' }));
                }
            });
        }
    }

    // Renders each item in the list
    const renderItem = ({ item }) => {
        // Get correct button label either 'Following' or 'Follow'
        const label = getButtonLabel(item);

        return (
            <TouchableOpacity onPress={() => 
                navigation.navigate("UserProfileScreen", { 
                    userID: activeTab === "followers" ? item.follower_id : item.following_id,
                    })
                }>
                <View style={styles.item}>
                    <Image 
                        source={item?.profile_photo_url ? { uri: item.profile_photo_url } : require("../../assets/default_white_profile.png")}
                        style={styles.profileImage} 
                    />
                    <View style={styles.textContainer}>
                        <Text style={styles.username}>
                            {activeTab === 'followers'
                                ? `${item.follower_first} ${item.follower_last}`
                                : `${item.following_first} ${item.following_last}`}
                        </Text>
                    </View>

                    {label === 'Following' ? (
                        <TouchableOpacity style={styles.followButton} onPress={() => handleFollowPress(item)}>
                            <Text style={styles.followButtonText}>{label}</Text>
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity onPress={() => handleFollowPress(item)}>
                            <LinearGradient
                                colors={["#FF8D00", "#FFBA00", "#FFE600"]}
                                locations={[0.72, 0.86, 1]}  
                                start={{ x: 0, y: 0 }}      
                                end={{ x: 1, y: 0 }}
                                style={styles.linearGradientButton}
                            >
                                <Text style={styles.buttonText}>{label}</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    )}
                </View>
            </TouchableOpacity>
        );
    }

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
        marginTop: Platform.OS === "android" ? "6%": "15%",
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
    linearGradientButton:{
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
        fontFamily: "Poppins-Regular",
    }
});

export default FollowersFollowingScreen;