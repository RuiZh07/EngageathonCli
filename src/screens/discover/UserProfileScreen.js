import React, { useEffect, useState } from "react";
import {
    StyleSheet,
    Image,
    Text,
    View,
    ScrollView,
    TouchableOpacity,
    ImageBackground,
    Platform
} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from "@react-navigation/native";
import { SvgUri } from "react-native-svg";
import baseUrl from "../../utils/api";
import LinearGradient from "react-native-linear-gradient";
import { backArrow } from "../../utils/icons";

export default function UserProfileScreen({ route }) {
    const { userID } = route.params;
    const [token, setToken] = useState(null);
    const [rank, setRank] = useState(null);
    const [userData, setUserData] = useState(null);
    const [categories, setCategories] = useState([]);
    const [userInfo, setUserInfo] = useState();
    const [eventList, setEventList] = useState();
    const [loading, setLoading] = useState(true);
    const [isPrivate, setIsPrivate] = useState(false);
    const navigation = useNavigation();

    useEffect(() => {
        const fetchUserData = async() => {
            try{
                const storedToken = await AsyncStorage.getItem("AccessToken");
                if (!storedToken) {
                console.error("No token found");
                return;
                }
                setToken(storedToken);
            
                const response = await fetch(`${baseUrl}/user-content/${userID}/?content_types=event&content_types=post`, {
                headers: {
                    'Authorization': `Bearer ${storedToken}`,
                    'Content-Type': 'application/json',
                },
                });
        
                const userData = await response.json();
                setUserData(userData);
        
                const [userInfo, categories, rankInfo, privacySettings, ...eventList] = userData;
                setUserInfo(userInfo);
                setCategories(categories);
                setRank(rankInfo.rank);
        
                if (privacySettings && privacySettings.is_private) {
                if (privacySettings.is_following) {
                    setEventList(eventList);
                    setIsPrivate(false);
                } else {
                    setEventList([]);
                    setIsPrivate(true);
                }
                } else {
                setEventList(eventList);
                setIsPrivate(false);
                }
        
            } catch (error) {
                console.error("Error fetching token or profile data", error);
            } finally {
                setLoading(false); 
            }
        };
        fetchUserData();
    }, [userID]);
    
    const handleImageClick = (postDetails) => {
        navigation.navigate('PostDetailScreen', { postDetails });
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
            >
                <View style={styles.header}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => navigation.goBack()}
                    >
                        <SvgUri uri={backArrow} />
                    </TouchableOpacity>
                    <Text style={styles.headerText}>Profile</Text>
                </View>
        
                {loading ? (
                    <View style={styles.loadingContainer}>
                        <Text style={styles.loadingText}>Loading...</Text>
                    </View>
                    ) : ( 
                    <>
                    <View style={styles.circle}>
                    <Image
                        source={userInfo?.profile_photo ? { uri: `data:image/jpeg;base64,${userInfo.image_url}` } : require("../../assets/default_profile.png")}
                        style={styles.pfp}
                    />
                    </View>
            
                    <Text style={styles.nameText}>{`${userInfo?.first_name ?? ''} ${userInfo?.last_name ?? ''}`}</Text>
                    <Text style={styles.usernameText}>@{`${userInfo?.username ?? ''}`}</Text>
            
                    <View style={styles.rank}>
                    <Text style={styles.rankText}>{rank}</Text>
                    </View>
            
                    <View style={styles.buttons}>
                    <TouchableOpacity style={styles.addMessage}>
                        <Image
                        source={require("../../assets/add-friend.png")}
                        style={{ width: 25, height: 25 }}
                        />
                    </TouchableOpacity>
            
                    <TouchableOpacity style={styles.addMessage}>
                        <Image
                        source={require("../../assets/message.png")}
                        style={{ width: 25, height: 25 }}
                        />
                    </TouchableOpacity>
                    </View>
            
                    <View style={styles.categoriesWrapper}>
                    {categories && categories.length > 0 && (
                        <View style={styles.categoriesContainer}>
                        {categories.map((category) => (
                            <View key={category.id}>
                            <LinearGradient
                                colors={["#FF8D00", "#FFE600"]}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={styles.categoryTextContainer}
                            >
                            <Text style={styles.categoryText}>{category.name}</Text>
                            </LinearGradient>
                            </View>
                        ))}
                        </View>
                    )}
                </View>
        
                <View style={styles.engagementsInfo}>
                <View style={[styles.statContainer, { marginLeft: "40%" }]}>
                    <Text style={styles.statNumber}>{userInfo?.records ?? 0}</Text>
                    <Text style={styles.statTitle}>E Points</Text>
                </View>
                </View>
            
                {isPrivate ? (
                <Text style={styles.privateAccountText}>Private Account: No events available.</Text>
                ) : (
                    <View style={styles.gridContainer}>
                    {eventList && eventList.length > 0 ? (
                        eventList.map((content) => {
                        const imageUrl = content.image_urls && content.image_urls[0] ? content.image_urls[0].image_url : '';
                        return (
                            <TouchableOpacity
                            key={content.id}
                            style={styles.imageItem}
                            onPress={() => handleImageClick(content)}
                            >
                            <Image
                                source={{ uri: `data:image/jpeg;base64,${imageUrl}` }}
                                style={styles.gridImage}
                            />
                            </TouchableOpacity>
                        );
                        })
                    ) : (
                        <Text style={styles.noEventsText}>No events available.</Text>
                    )}
                    </View>
                )}
                </>
                )}
            </ScrollView>
        </ImageBackground>
    );
}
    
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
        justifyContent: "center",
        width: "100%",
        paddingHorizontal: "5%",
        marginTop: "10%",
    },
    loadingText: {
        textAlign: "center",
        marginTop: 20,
        fontSize: 18,
        color: "#999",
    },
    backButton: {
        position: 'absolute',
        left: 0,
        top: 0,
        padding: 20, 
    },
    headerText: {
        color: "#FFE600",
        fontSize: 30,
        marginTop: "5%",
        marginBottom: '2%',
    },
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 5,
    },
    imageContainer: {
        marginBottom: 20,
        width: '100%', 
        alignItems: 'center', 
    },
    image: {
        width: '75%',
        height: 150, 
        resizeMode: 'cover',
    },
    eventName: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
        color: "#F5F4F4",
    },
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        width: '100%',
        paddingHorizontal: '5%',
    },
    imageItem: {
        width: '48%', 
        marginBottom: 10,
    },
    gridImage: {
        width: '100%',
        height: 150, // Adjust height as needed
        resizeMode: 'cover',
        borderRadius: 10, 
    },
    circle: {
        marginTop: "2%",
        width: 150,
        height: 150,
        borderRadius: 75,
        borderWidth: 3,
        borderColor: "#2BAB47", // Set border color to green
        alignItems: "center",
        justifyContent: "center",
        position: 'relative',
        // Removed overflow: 'hidden' to prevent clipping
    },
    pfp: {
        width: '100%', 
        height: '100%', 
        borderRadius: 90, 
        resizeMode: 'cover',
    },
    nameText: {
        marginTop: "3%",
        color: "#F5F4F4",
        fontSize: 24,
    },
    usernameText: {
        color: "#A8A8A8",
        fontSize: 14,
        paddingTop: 2,
    },
    rank: {
        marginTop: "2%",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        paddingLeft: "8%",
        paddingRight: "5%",
    },
    rankText: {
        color: "#FFE600",
        fontSize: 17,
        alignSelf: "flex-start",
    },
    engagementsInfo: {
        marginVertical: "5%",
        flexDirection: "row",
        height: 80,
        width: "92%",
        borderRadius: 35,
        backgroundColor: "#F5F4F4",
        alignItems: "center",
        justifyContent: "space-between",
        overflow: 'hidden', // Hide overflow
    },
    statContainer: {
        alignItems: "center",
    },
    statNumber: {
        color: "#0F1828",
        fontSize: 20,
    },
    statTitle: {
        color: "#707070",
        fontSize: 18,
    },
    buttons: {
        marginTop: "3%",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },
    addMessage: {
        width: 40,
        height: 40,
        borderRadius: 10,
        backgroundColor: "#F5F4F4",
        marginHorizontal: "1.5%",
        alignItems: "center",
        justifyContent: "center",
    },
    categoriesWrapper: {
        margin: 10,
        marginHorizontal: 20,
    },
    categoriesContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
    },
    categoryTextContainer: {
        paddingVertical: 10,
        paddingHorizontal: 10, 
        margin: 5, 
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 40, 
        backgroundColor: '#e0e0e0', 
    },
    categoryText: {
        textAlign: 'center',
        fontSize: 14,
        color: '#FFFFFF',
    },
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        width: '100%',
        paddingHorizontal: '5%',
    },
    imageItem: {
        width: '48%', 
        marginBottom: 10,
    },
    gridImage: {
        width: '100%',
        height: 150, 
        resizeMode: 'cover',
        borderRadius: 10,
    },
    privateAccountText: {
        textAlign: "center",
        marginTop: 20,
        fontSize: 18,
        color: "red",
    },
    noEventsText:{
        textAlign: "center",
        marginTop: 20,
        fontSize: 18,
        color: "#999",
    },
});
