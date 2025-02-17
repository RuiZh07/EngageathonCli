import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    ScrollView,
    TouchableOpacity,
    ImageBackground,
} from "react-native";
import { SvgUri } from "react-native-svg";
import Chip from "../../components/post/Chip";
import Heart from "../../components/post/Heart";
import Comment from "../../components/post/Comment";
import Save from "../../components/post/Save";
import { backArrow, shareIcon } from "../../utils/icons";
import { useNavigation } from "@react-navigation/native";
import DiscoverPostHeader from "../../components/discover/DiscoverPostHeader";
import baseUrl from "../../utils/api";
import apiClient from "../../services/apiClient";
import AsyncStorage from '@react-native-async-storage/async-storage';

const EventDetailScreen = ({ route }) => {
    const [likedEvent, setLikedEvent] = useState([]);
    const [likedPost, setLikedPost] = useState([]);
    const { event } = route.params;
    const navigation = useNavigation(); 
    console.log('event', event);

    useEffect(() => {
        const fetchContentDetail = async () => {
            try {
                const token = await AsyncStorage.getItem("AccessToken");
                const url = event.content_type === 'EV' 
                    ? `${baseUrl}/events/detail/${event.content_object_id}/` 
                    : `${baseUrl}/posts/detail/${event.content_object_id}/`;
    
                const response = await apiClient.get(url, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                console.log('data',response.data);
                if (response.data) {
                    if (event.content_type === 'EV') {
                        setLikedEvent(response.data);  // Update liked event
                    } else {
                        setLikedPost(response.data);  // Update liked post
                    }
                    console.log(response.data);
                }
            } catch (error) {
                console.error("Error fetching content detail", error);
            }
        };
    
        fetchContentDetail();
    }, [event.content_type, event.content_object_id]);

    const currentData = event.content_type === 'EV' ? likedEvent : likedPost;

    if (!currentData) {
        return <Text>Loading...</Text>;
    }
    return (
        <ImageBackground
            source={require("../../assets/main-background.png")}
            style={styles.container}
        >
            <DiscoverPostHeader />
            <ScrollView style={{ flex: 1 }}>
                <View style={styles.detailContainer}>
                    <View style={styles.header}>
                        <TouchableOpacity
                            style={styles.backButton}
                            onPress={() => {navigation.goBack();}}
                        >
                        <View style={{ position: 'absolute', top: 10 }}>
                            <SvgUri uri={backArrow} />
                        </View>
                        </TouchableOpacity>
                        <View style={styles.profileHeader}>
                            <View style={styles.pfpContainer}>
                                <Image
                                    source={currentData?.profile_photo_url 
                                        ? { uri: currentData.profile_photo_url } 
                                        : require("../../assets/default_profile.png")
                                    }
                                    style={styles.pfp}
                                />
                            </View>
                            <View style={styles.userInfo}>
                                <View>
                                    <Text style={styles.userNameText}>{currentData.username}</Text>
                                    {event.content_type === 'EV' && <Text style={styles.userDescriptionText}>organizer | {currentData.event_type}</Text>}
                                    {event.content_type != 'EV' && <Text style={styles.userDescriptionText}>organizer</Text>}
                                </View>
                            </View>
                        </View>
                    </View>
                    
                    <View style={styles.postTags}>
                        {currentData.categories && (
                            currentData.categories.map((category, index) => (
                                <Chip key={index} label={category.name} />
                            ))  
                        )}
                    </View>
                    <Image style={styles.image}  source={{ uri: event?.content_profile_photo_url || "/mnt/data/Media (7).jpg" }} />
                
                    <View style={styles.postInteraction}>
                        <Heart postId={currentData.id} like={currentData.liked} contentType={currentData.content_type} />

                        {currentData.event_type && (
                            <TouchableOpacity style={styles.interactionButton} onPress={() => handleCommentPress(currentData.id)}>
                                <Comment />
                            </TouchableOpacity>
                        )}

                        <Save postId={currentData.id} bookmark={currentData.bookmarked} contentType={currentData.content_type} />

                        <TouchableOpacity style={styles.shareButton}>
                            <SvgUri width="16" height="14" uri={shareIcon} />
                        </TouchableOpacity>    
                    </View> 
                </View>
            </ScrollView>
        </ImageBackground>
    );
}

export default EventDetailScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: '20%',
    },
    header: {
        flexDirection: "row",
    },
    profileHeader: {
        marginLeft: 5,
        paddingHorizontal: 20,
        paddingBottom: 14,
        flex: 1,
        flexDirection: "row",
        gap: 10,
        alignItems: "center",
    },
    userInfo: {
        flexDirection: "row",
        justifyContent: "space-between",
        flex: 1,
        alignItems: "center",
    },
    postInteraction: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 25,
        marginBottom: 20,
    },
    likeSection: {
        flexDirection: "row",
        alignItems: "center",
        marginRight: 1,
        marginTop: -4,
    },
    likeCountText: {
        fontSize: 14,
        fontFamily: "poppins-regular",
        color: "#333",
        marginLeft: 4,
    },
    interactionButton: {
        paddingHorizontal: 10,
    },
    shareButton: {
        marginTop: -7,
        paddingHorizontal: 10,
        marginLeft: 'auto',  
    },
    postTags: {
        flexDirection: "row",
        gap: 6,
        marginRight: 10,
        flexWrap: 'wrap',
    },
    detailContainer: {
        flex: 1,
        backgroundColor: 'white',
        marginHorizontal: 20,
        marginVertical: 10,
        borderRadius: 20,
        paddingVertical: 20,
        paddingHorizontal: 20,
    },
    postInteraction: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: 'center',
        marginBottom: 20,
    },
    pfpContainer: {
        alignItems: "center",
        borderColor: '#2BAB47',
        borderWidth: 2,
        borderRadius: 40,
        paddingHorizontal: 2,
        paddingVertical: 2,
    },
    pfp: {
        width: 36, 
        height: 36, 
        resizeMode: "cover", 
        borderRadius: 18,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#2BAB47',
    },
    userNameText: {
        fontFamily: "poppins-regular",
        fontSize: 17,
        fontWeight: "500",
        lineHeight: 26,
        letterSpacing: 0.4,
        textAlign: "left",
    },
    userDescriptionText: {
        fontFamily: "inter",
        fontSize: 13,
        fontWeight: "400",
        lineHeight: 16,
        letterSpacing: 0,
        textAlign: "left",
        color: "rgba(163, 163, 163, 1);\n",
    },
    image: {
        width: '100%',
        height: 200,
        borderRadius: 10,
        marginTop: 10,
        marginBottom: 20,

    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    date: {
        fontSize: 16,
        color: '#888',
        marginBottom: 10,
    },
    location: {
        fontSize: 16,
        color: '#888',
        marginBottom: 20,
    },
    eventNameText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    description: {
        fontSize: 16,
        lineHeight: 24,
        paddingBottom: 20,
    },   
  
});
