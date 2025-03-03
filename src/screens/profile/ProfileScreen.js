import React, { useEffect, useState, useRef } from "react";
import {
    StatusBar,
    StyleSheet,
    Image,
    Text,
    View,
    ScrollView,
    TouchableOpacity,
    ImageBackground,
    Alert,
    Animated,
    Platform,
    Dimensions
} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from "@react-navigation/native";
import { trophieIcon, hamburgerIcon, dollarIcon } from "../../utils/icons";
import { SvgUri } from "react-native-svg";
import { useFocusEffect } from '@react-navigation/native';
import authService from "../../services/authService";
import baseUrl from "../../utils/api";
import MainButton from "../../components/common/MainButton";
import HamburgerBar from "../../components/profile/HamburgerBar";
import LinearGradient from "react-native-linear-gradient";
import apiClient from "../../services/apiClient";

const { height } = Dimensions.get('window');

export default function ProfileScreen ({ userData }) {
    const [token, setToken] = useState(null);
    const [followers, setFollowers] = useState(0);
    const [following, setFollowing] = useState(0);
    const [points, setPoints] = useState(0);
    const [rank, setRank] = useState("");
    const [categories, setCategories] = useState([]);
    const [profileImage, setProfileImage] = useState(null);
    const navigation = useNavigation();
    const [userContent, setUserContent] = useState([]);

    const [eventList, setEventList] = useState([]);
    const [isSidebarVisible, setIsSidebarVisible] = useState(false);
    const sidebarAnimation = useRef(new Animated.Value(-300)).current;
    
    const [showAll, setShowAll] = useState(false);
    const [visibleCategories, setVisibleCategories] = useState(5);

    const handleShowMore = () => {
        setShowAll(true);
        setVisibleCategories(categories.length); // Show all categories
    };

    // Close the expanded list
    const handleClose = () => {
        setShowAll(false);
        setVisibleCategories(5); // Reset to show only the first 5 categories
    };
    console.log(eventList);
    eventList.forEach((event) => {
        console.log(`${event.id}-${event.name || event.caption}`)
    })
    const toggleSidebar = () => {
        if (isSidebarVisible) {
            // Slide out to the left
            Animated.timing(sidebarAnimation, {
                toValue: -300, 
                duration: 300,
                useNativeDriver: true,
            }).start(() => setIsSidebarVisible(false));
        } else {
            // Slide in from the left
            setIsSidebarVisible(true);
            Animated.timing(sidebarAnimation, {
                toValue: 0, 
                duration: 300,
                useNativeDriver: true,
            }).start();
        }
    };

     // Hide sidebar when page loses focus
     useFocusEffect(
        React.useCallback(() => {
            setIsSidebarVisible(false); // Set sidebar to false when screen is not focused

            return () => {
                setIsSidebarVisible(false); // Also ensure sidebar is hidden when page loses focus
            };
        }, [])
    );

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
          fetchData(); 
        });
    
        return unsubscribe;
      }, [navigation]);


    const fetchData = async () => {
        try {
            const storedToken = await AsyncStorage.getItem("AccessToken");
            if (!storedToken) {
                console.error("No token found");
                return;
            }
            setToken(storedToken);

            await fetchFollowers(storedToken);
            await fetchFollowing(storedToken);
            await fetchPoints(storedToken);
            await fetchUserContent(storedToken);
        } catch (error) {
            console.error("Error fetching data", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const fetchUserContent = async (token) => {
        try {
            const response = await apiClient.get(`${baseUrl}/user-content/?content_types=event&content_types=post`, {
                headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                },
            });
            // Log the response for debugging
            //console.log('User Content Response:', response.data);
            setProfileImage(response.data[0].profile_photo);
            // Check if response.data is defined and is an array
            if (response.data && Array.isArray(response.data)) {
                setUserContent(response.data);
                // Extract categories from userContent
                const categories = response.data[1] ? response.data[1] : [];
                setCategories(categories);
                const eventList = response.data.slice(3) ? response.data.slice(3) : [];
                setEventList(eventList);
            } else {
                console.warn('Unexpected response format for user content:', response.data);
                setUserContent([]);
            }
        } catch (error) {
            console.error('Error fetching user content:', error);
            setUserContent([]);
        }
    };

    const fetchFollowers = async (token) => {
        try {
            const response = await apiClient.get(`${baseUrl}/followers-user/`, {
                headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                },
            });
            setFollowers(response.data.length);
        } catch (error) {
                console.error("Error fetching followers data", error);
        }
    };

    const fetchFollowing = async (token) => {
        try {
            const response = await apiClient.get(`${baseUrl}/following-user/`, {
                headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                },
            });
            setFollowing(response.data.length);
        } catch (error) {
            console.error("Error fetching following data", error);
        }
    };

    const fetchPoints = async (token) => {
        try {
            const response = await apiClient.get(`${baseUrl}/points/`, {
                headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                },
            });
            setPoints(response.data.points);
            setRank(response.data.rank);
        } catch (error) {
            console.error("Error fetching points data", error);
        }
    };
    
    const handleMyEvents = () => {
        navigation.navigate("UpcomingEventScreen");
    };
    
    const navigateToFollowersFollowing = (type) => {
        navigation.navigate("FollowersFollowingScreen", {
            type,
            username: `${userData.first_name} ${userData.last_name}`,
        });
    };
    
    const handleImageClick = (postDetails) => {
        navigation.navigate('PostDetailScreen', { postDetails });
    };

    const handleUpdateCauses = async () => {
        
    }

    return (
        <ImageBackground
            source={require("../../assets/main-background.png")}
            style={styles.backgroundImage}
        >
            <View style={styles.header}>
                <TouchableOpacity style={styles.hamburgerIcon} onPress={toggleSidebar}>
                    <SvgUri uri={hamburgerIcon} height={26} /> 
                </TouchableOpacity>
                <Text style={styles.headerText}>Profile</Text>
            </View>
    
            {isSidebarVisible && (
                <>
                    <TouchableOpacity style={styles.overlay} onPress={toggleSidebar} />
                    <Animated.View style={[styles.sidebarContainer, { transform: [{ translateX: sidebarAnimation }] }]}>
                        <HamburgerBar />
                    </Animated.View>
                </>
            )}

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContentContainer}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.circle}>
                    <Image
                        source={profileImage ? { uri: profileImage } : require("../../assets/default_profile.png")}
                        style={styles.pfp}
                    />
                </View>
        
                <Text style={styles.nameText}>{`${userData?.first_name ?? ''} ${userData?.last_name ?? ''}`}</Text>
                <Text style={styles.handleText}>{`@${userData?.email ?? ''}`}</Text>
        
                <View style={styles.titles}>
                    <Text style={styles.title1}>{rank}</Text>
                </View>
        
                <View style={styles.followInfo}>
                    <TouchableOpacity onPress={() => navigateToFollowersFollowing('followers')}>
                        <Text style={styles.followCount}>{followers} Followers</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigateToFollowersFollowing('following')}>
                        <Text style={styles.followCount}>{following} Following</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.categoryContainer}>
                    <View style={styles.myCauseheader}>
                        <Text style={styles.myCauseText}>My Causes</Text>
                        <TouchableOpacity styles={styles.updateCauses} onPress={() => navigation.navigate("UpdateTagCause")}>
                           <Text style={styles.updateCauseText}>Update Causes</Text>
                        </TouchableOpacity>
                    </View>
                    
                    <View style={styles.categoryList}>
                        {categories.slice(0, visibleCategories).map((category, index) => (
                            <View key={index} style={styles.categoryItem}>
                                <LinearGradient
                                    colors={["#FF8D00", "#FFBA00", "#FFE600"]}
                                    locations={[0.72, 0.86, 1]}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    style={styles.categoryGradient}
                                >
                                    <Text style={styles.categoryText}>{category.name}</Text>
                                </LinearGradient>
                            </View>
                        ))}
                    </View>

                    {categories.length > visibleCategories && !showAll && (
                            <TouchableOpacity onPress={handleShowMore} style={styles.showMoreButton}>
                                <Text style={styles.showMoreText}>Show More</Text>
                            </TouchableOpacity>
                        )}

                        {showAll && (
                            <TouchableOpacity onPress={handleClose} style={styles.showMoreButton}>
                                <Text style={styles.showMoreText}>Close</Text>
                            </TouchableOpacity>
                        )}
                </View>

                <MainButton 
                    style={styles.myEventsButton} 
                    onPress={handleMyEvents} 
                    title="Upcoming Events" 
                />
        
                <View style={styles.engagementsInfo}>
                    <View style={styles.statContainer}>
                        <Text style={styles.statTitle}>Total E Points</Text>
                        <View style={styles.pointsContainer}>
                            <SvgUri uri={dollarIcon} />
                            <Text style={styles.statNumber}>{points}</Text>
                        </View>
                        <Text style={styles.awesomeText}>Awesome {userData?.first_name ?? ''} !</Text>
                        <Text style={styles.redeemText}>Redeem your rewards!</Text>
                    </View>
                    <SvgUri uri={trophieIcon} height={125} />
                </View>

                <View style={styles.gridContainer}>
                    {eventList && eventList.length ? (
                        eventList.map((content) => (
                            <TouchableOpacity
                                key={`${content.id}-${content.name || content.caption}`}
                                style={styles.imageItem}
                                onPress={() => handleImageClick(content)}
                            >
                                <Image
                                    source={{ uri: content?.image_urls?.[0]?.image_url || "/mnt/data/Media (7).jpg" }}
                                   // source={{ uri: `data:image/jpeg;base64,${content.image_urls ? content.image_url : ''}` }}
                                    style={styles.gridImage}
                                />
                            </TouchableOpacity>
                        ))
                    ) : (
                        <Text style={styles.noContentText}>No Content Available</Text>    
                    )}
                </View>
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
        marginTop: "14%",
        marginBottom: '2%',
        position: "relative",
    },
    hamburgerIcon: {
        position: "absolute",
        left: "10%",
    },
    headerText: {
        color: "#FFE600",
        fontSize: 26,
        fontFamily: "Poppins-Medium",
        textAlign: 'center',
    },
    myCauseheader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    updateCauseText: {
        color: "#FFBA00",
        fontSize: 15,
        fontFamily: "Poppins-Semibold",
        marginBottom: '2%',
        marginLeft: '2%',
        textDecorationLine: 'underline',
    },
    loadingText: {
        textAlign: "center",
        marginTop: 20,
        fontSize: 18,
        color: "#999",
    },
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 5,
    },
    imageContainer: {
        marginBottom: 20,
        width: '100%', // Ensure container takes up full width
        alignItems: 'center', // Center images in the container
    },
    image: {
        width: '75%',
        height: 150, // Adjust height as needed
        resizeMode: 'cover', // Ensure the image covers the area
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
        flex: 1,
    },
    imageItem: {
        width: '48%', // Adjust width for two images per row, or use '30%' for three images per row
        height: 150,
        marginBottom: 10,
        justifyContent: 'center', 
        alignItems: 'center',      
        overflow: 'hidden',  
        //flex: 1,
    },
    gridImage: {
        width: '100%',
        height: '100%', // Adjust height as needed
        resizeMode: 'cover',
        borderRadius: 10, // Optional: Add border radius for rounded corners
    },
      
    circle: {
        marginTop: "7%",
        width: 130,
        height: 130,
        borderRadius: 75,
        borderWidth: 3,
        borderColor: "#2BAB47",
        alignItems: "center",
        justifyContent: "center",
        position: 'relative',
        // Removed overflow: 'hidden' to prevent clipping
    },
    pfp: {
        width: '100%', // Make sure the image fills the circle
        height: '100%', // Make sure the image fills the circle
        borderRadius: 75, // Make sure the image is rounded
        resizeMode: 'cover', // Cover the circle properly
    },
    
    cameraIcon: {
        position: 'absolute',
        bottom: -5, // Move icon outside the circle's bottom edge
        right: -1, // Move icon outside the circle's right edge
        backgroundColor: "#FF8D00",
        borderRadius: 50,
        padding: 10,
        zIndex: 10, // Ensure the icon is on top of the image and circle
    },
    nameText: {
        marginTop: "3%",
        color: "#F5F4F4",
        fontSize: 18,
        fontFamily: "Poppins-Semibold",
        marginBottom: '1%',
    },
    handleText: {
        color: "#A8A8A8",
        fontSize: 14,
    },
    titles: {
        marginTop: "1%",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        paddingLeft: "8%",
        paddingRight: "5%",
    },
    title1: {
        color: "#FFE600",
        fontSize: 17,
        alignSelf: "flex-start",
        marginBottom: '1%',
    },
    followInfo: {
        flexDirection: "row",
        justifyContent: "space-around",
        width: "95%",
        marginTop: 15,
    },
    followCount: {
        color: "#FFFFFF",
        fontSize: 18,
        fontFamily:'Poppins-Medium',
    },
    myCauseText:{
        color: "#F5F4F4",
        fontSize: 15,
        fontFamily: "Poppins-Semibold",
        marginBottom: '2%',
        marginLeft: '2%',
    },
    myEventsButton: {
        paddingVertical: 20,
        width: "90%",
    },
    myEventsButtonText: {
        color: "#F5F4F4",
        fontSize: 16,
    },
    engagementsInfo: {
        marginTop: "5%",
        paddingHorizontal: 30,
        paddingTop: 25,
        paddingBottom: 35,
        flexDirection: "row",
        width: "92%",
        borderRadius: 30,
        backgroundColor: "#F5F4F4",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 20,
    },
    statContainer: {
        //alignItems: "center",
    },
    pointsContainer: {
        paddingBottom: 12,
        paddingTop: 12,
        flexDirection: "row",
        alignItems: 'center',
    },
    statNumber: {
        paddingLeft: 20,
        color: "#0F1828",
        fontSize: 26,
        fontFamily:'Poppins-Bold',
    },
    statTitle: {
        color: "#212226",
        fontSize: 17,
        fontFamily:'Poppins-Medium',
    },
    awesomeText: {
        color: "#212226",
        fontSize: 19,
        fontFamily:'Poppins-Medium',
    },
    redeemText: {
        color: '#989898',
        fontSize: 14,
        fontFamily: "Inter-Regular",
    },
    buttons: {
        marginTop: "3%",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },
    categoryContainer: {
        marginTop: 20,
        paddingHorizontal: '5%',
        width: '100%',
    },
      
    categoryList: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
    },
      
    categoryItem: {
        marginBottom: 12,
        marginRight: 7,
    },
    categoryGradient: {
        borderRadius: 20,
        paddingVertical: 6,
        paddingHorizontal: 10,
    },
    categoryText: {
        color: '#0F1828',
        fontSize: 14,
        fontWeight: '600',
    },
      
    noContentText: {
        color: '#A8A8A8',
        fontSize: 16,
        marginTop: 10,
    },
      
    addMessage: {
        width: 45,
        height: 45,
        borderRadius: 10,
        backgroundColor: "#F5F4F4",
        marginHorizontal: "1.5%",
        alignItems: "center",
        justifyContent: "center",
    },
    sidebarContainer: {
        position: "absolute",
        top: 0,
        left: 0,
        width: "60%",
        height: height,
        zIndex: 9999,
    },
    overlay: {
        position: "absolute",
        top: 0,
        left: "60%",      
        width: "40%",     
        height: height,
        zIndex: 9998,
    },
    showMoreButton: {
        marginLeft: 3,
        textDecorationLine: 'underline',
        marginBottom: 15,
    },
    showMoreText: {
        color: '#fff',
        fontSize: 15,
        textDecorationLine: 'underline',
        fontFamily:'Poppins-Medium',
    },
});