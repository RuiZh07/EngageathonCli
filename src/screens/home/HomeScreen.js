
import React, { useEffect, useState, useCallback } from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    ScrollView,
    TouchableOpacity,
    StatusBar,
    TouchableWithoutFeedback,
    BackHandler,
    ImageBackground,
    Modal,
} from "react-native";
import HomeHeader from "../../components/home/HomeHeader";
import ScreenBackground from "../../assets/home-background.png";
import Chip from "../../components/post/Chip";
import Heart from "../../components/post/Heart";
import Comment from "../../components/post/Comment";
import Save from "../../components/post/Save";
import MainButton from "../../components/common/MainButton";
import homeService from "../../services/homeService";
import CommentsModal from "../../components/modals/CommentsModal";
import FilterDropdown from "../../components/home/FilterDropdown";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import ShareModal from "../../components/modals/ShareModal";
import { SvgUri } from "react-native-svg";
import baseUrl from "../../utils/api";
import { greyDots, shareIcon } from "../../utils/icons";
import PinReport from "../../components/home/PinReport";

const HomeScreen = () => {
    const [posts, setPosts] = useState([]);
    const [filters, setFilters] = useState([]); // For multiple selections
    const [showFilterDropdown, setShowFilterDropdown] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [commentsVisible, setCommentsVisible] = useState(false); // State for modal visibility
    const [selectedPostId, setSelectedPostId] = useState(null); 
    const [isShareModalVisible, setShareModalVisible] = useState(false);
    const [isPinReportVisible, setPinReportVisible] = useState(false);
    const [shareableLink, setShareableLink] = useState('');
    const navigation = useNavigation();

    useEffect(() => {
        const handleBackButtonPress = () => {
            if (showFilterDropdown) {
                setShowFilterDropdown(false);
                return true;
            }
            return false;
        };
    
        BackHandler.addEventListener("hardwareBackPress", handleBackButtonPress);
        return () => {
            BackHandler.removeEventListener("hardwareBackPress", handleBackButtonPress);
        };
    }, [showFilterDropdown]);

    useEffect(() => {
        fetchData(filters);
      }, [filters]);

    const fetchData = async (filters) => {
        setLoading(true);
        setError(null);
    
        try {
            let response;
            if (filters.includes("events") && filters.includes("posts")) {
                response = await homeService.getHomeFeed();
            } else if (filters.includes("events")) {
                response = await homeService.getFilteredFeed("event");
            } else if (filters.includes("posts")) {
                response = await homeService.getFilteredFeed("post");
            } else {
                response = await homeService.getHomeFeed();
            }
        
            if (!response || !response.data) {
                throw new Error("No data received");
            }
        
            const data = response.data.content;
            console.log('data in home', data);
            if (!Array.isArray(data)) {
                throw new Error("Data is not an array");
            }
        
            setPosts(data);
        } catch (error) {
            console.error("Error fetching data:", error);
            setPosts([]);
            setError("Error fetching data. Please try again later.");
        } finally {
            setLoading(false);
        }
    };
    
    const handleFilterPress = () => {
        setShowFilterDropdown(!showFilterDropdown);
    };
    
    const handleAttend = () => {
        navigation.navigate("CalendarScreen");
    };
    
    
      const handleSharePress = useCallback(async (postId, postName) => {
        try {
            const token = await AsyncStorage.getItem('AccessToken');
            
            if (!token) {
                console.error('No token found');
                return;
            }
            const link = `https://app.engageathon.com/event/${postName}`;
            console.log('share', link);
        
            setShareableLink(link);
            setShareModalVisible(true);
        } catch (error) {
            console.error('Error handling share:', error);
        }
    }, [setShareableLink, setShareModalVisible]);
      
    
    const handleCloseModal = () => {
        //console.log('Closing modal');
        setShareModalVisible(false);
    };
    
    const handleCommentPress = (postId) => {
        setSelectedPostId(postId);
        setCommentsVisible(true);
    };
    
    const handleSelectFilter = (filter) => {
        setFilters((prevFilters) => {
            if (prevFilters.includes(filter)) {
                return prevFilters.filter((f) => f !== filter);
            } else {
                return [...prevFilters, filter];
            }
        });
    };

    return (
        <TouchableWithoutFeedback onPress={() => setShowFilterDropdown(false)}>
            <ImageBackground
                source={require("../../assets/home-background.png")}
                style={styles.backgroundImage}
            >
            <View style={styles.container}>
                <HomeHeader onFilterPress={handleFilterPress} />
        
                {showFilterDropdown && (
                <FilterDropdown
                    selectedFilters={filters}
                    onToggleFilter={handleSelectFilter}
                    onClose={() => setShowFilterDropdown(false)}
                />
                )}
        
                {loading ? (
                <Text style={styles.loadingText}>Loading...</Text>
                ) : error ? (
                <Text style={styles.errorText}>{error}</Text>
                ) : posts.length === 0 ? (
                <Text style={styles.noDataText}>No posts available.</Text>
                ) : (
                <ScrollView style={styles.eventContainer} scrollEventThrottle={16}>
                    {posts.map((post) => (
                    
                    <TouchableWithoutFeedback key={`${post.id}-${post.name}`} onPress={() => setShowFilterDropdown(false)}>
                        <View style={styles.post}>
                            <View style={styles.postHeader}>
                                <Image
                                    source={{ uri: post?.profile_photo_url ? post.profile_photo_url : "/mnt/data/Media (7).jpg" }}
                                    style={{ width: 34, height: 36, resizeMode: "contain" }}
                                />
                                <View style={styles.postUser}>
                                <View>
                                    <Text style={styles.userNameText}>{post.name}</Text>
                                    <Text style={styles.userDescriptionText}>
                                    Organizer | {post.event_type}
                                    </Text>
                                </View>
                                <TouchableOpacity onPress={() => setPinReportVisible(true)}>
                                    <SvgUri uri={greyDots} />
                                </TouchableOpacity>
                                </View>
                            </View>
                        {post.location && <Text style={styles.location}>{post.location}</Text>}
                        <View style={styles.postTags}>
                        {post.event_type && (
                            <Chip label={post.event_type} />
                        )}
                        </View>
                        <View style={styles.postImageContainer}>
                            <Image
                            style={styles.postImage}
                            source={{ uri: post.image_urls[0]?.image_url ? `data:image/jpeg;base64,${post.image_urls[0].image_url}` : "/mnt/data/Media (7).jpg" }}
                            />
                        </View>
                        <View style={styles.postInteraction}>
                            <View style={styles.likeSection}>
                                <Heart postId={post.id} like={post.liked}/>
                                <Text style={styles.likeCountText}>
                                    {post.likes_count ?? 0}
                                </Text>
                            </View>
                            {post.event_type && (
                                <TouchableOpacity style={styles.interactionButton} onPress={() => handleCommentPress(post.id)}>
                                    <Comment />
                                </TouchableOpacity>
                            )}
                            <Save postId={post.id} bookmark={post.bookmarked} />
                            <View style={styles.shareContainer}>                 
                                <TouchableOpacity style={styles.interactionButton} onPress={() => handleSharePress(post.id, post.name)}>
                                    <SvgUri width="16" height="14" uri={shareIcon} />
                                </TouchableOpacity>
                            </View>
                        </View>
                        {post.caption && <Text style={styles.caption}>{post.caption}</Text>}
                        {post.tagged_users && (
                            <Text style={styles.taggedUsers}>
                            {post.tagged_users.map(user => `User ${user.user}`).join(', ')}
                            </Text>
                        )}
                        <View style={styles.postDescription}>
                            <Text style={styles.postDescriptionText}>
                            {post.description}
                            </Text>
                        </View>
                        {post.event_type && (
                        <MainButton title="Attend" onPress={handleAttend} />
                        )}
                        </View>
                    </TouchableWithoutFeedback>
                    ))}
                </ScrollView>
                )}
                <CommentsModal visible={commentsVisible} onClose={() => setCommentsVisible(false)} postId={selectedPostId} />
                {isShareModalVisible && 
                    <ShareModal
                        isVisible={isShareModalVisible}
                        onClose={handleCloseModal}
                        link={shareableLink}
                    />
                }
                <PinReport 
                    isModalVisible={isPinReportVisible} 
                    setModalVisible={setPinReportVisible} 
                />
            </View>
            </ImageBackground>
        </TouchableWithoutFeedback>
    );

};

export default HomeScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        position: "relative",
        paddingTop: "20%",
    },
    backgroundImage: {
        flex: 1,
        width: "100%",
    },
    eventContainer: {
        paddingHorizontal: 16,
        marginTop: 20,
    },
    location: {
        fontSize: 16,
        fontWeight: 'bold',
        marginVertical: 5,
    },
    caption: {
        fontSize: 14,
        marginVertical: 5,
        marginLeft:'5%'
    },
    taggedUsers: {
        fontSize: 12,
        color: '#555',
        marginVertical: 5,
        marginLeft:'5%'
    },
    post: {
        backgroundColor: "#f5f4f4",
        borderRadius: 30,
        padding: 16,
        marginBottom: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
    },
    postHeader: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10,
    },
    postUser: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        flex: 1,
        marginLeft: 10,
    },
    userNameText: {
        fontSize: 17,
        fontFamily: "poppins-semibold",
        color: "#333",
    },
    userDescriptionText: {
        fontSize: 13,
        fontFamily: "poppins-regular",
        color: "#666",
    },
    postTags: {
        flexDirection: "row",
        gap: 4,
        marginVertical: 5,
        marginHorizontal: 10,
    },
    postImageContainer: {
        flex: 1,
        marginHorizontal: 10,
        marginBottom: 10,
    },
    postImage: {
        width: "100%",
        height: 200,
        borderRadius: 10,
        resizeMode: "cover",
    },
    postInteraction: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 15,
        marginBottom: 20,
        justifyContent: "space-between", // Distribute space between buttons
    },
    likeSection: {
        flexDirection: "row",
        alignItems: "center",
        marginRight: 1,
    },
    loadingText: {
        textAlign: "center",
        marginTop: 20,
        fontSize: 18,
        color: "#999",
    },
    errorText: {
        textAlign: "center",
        marginTop: 20,
        color: "red",
    },
    noDataText: {
        textAlign: "center",
        marginTop: 20,
        fontSize: 18,
        color: "#999",
    },
    likeCountText: {
        fontSize: 14,
        fontFamily: "poppins-regular",
        color: "#333",
        marginLeft: 4,
    },
    interactionButton: {
        paddingHorizontal: 16, // Increase padding to space out buttons
        alignItems: 'center',
        justifyContent: 'center',
    },
    postDescription: {
         marginBottom: 10,
    },
    postDescriptionText: {
        fontSize: 14,
        fontFamily: "poppins-regular",
        color: "#333",
        paddingLeft: 15,
    },
    saveButton: {
        marginRight: '30%', // Add more space between Save and Share buttons
    },
  });