import React, { useEffect, useState, useCallback } from "react";
import Chip from "../post/Chip";
import Heart from "../post/Heart";
import Comment from "../post/Comment";
import Save from "../post/Save";
import Share from "../post/Share";
import MainButton from "../common/MainButton";
import {
    View,
    Text,
    StyleSheet,
    Image,
    ScrollView,
    TouchableOpacity,
    StatusBar,
    ImageBase,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CommentsModal from "../modals/CommentsModal";
import { useNavigation } from "@react-navigation/native";
import { SvgUri } from "react-native-svg";
import { shareIcon } from "../../utils/icons";
import baseUrl from "../../utils/api";

const DiscoverPost = ({
    profilePicture,
    userID,
    name,
    title,
    description,
    location,
    date,
    onPress,
    post,
    coverImageUrl,
    eventName,
}) => {
    const [likeCounts, setLikeCounts] = useState(post.likes_count || 0);
    const [bookmarked, setBookmarked] = useState(false);
    const [commentsVisible, setCommentsVisible] = useState(false);
    const [selectedPostId, setSelectedPostId] = useState(null);
    const [fontLoaded, setFontLoaded] = useState(false);
    const [token, setToken] = useState(null);
    const navigation = useNavigation();
    const [isShareModalVisible, setShareModalVisible] = useState(false);
    const [shareableLink, setShareableLink] = useState('');

    const handleAttend = () => {
        navigation.navigate("CalendarScreen");
    };
    
    const handleSharePress = useCallback(async (postId) => {
        try {
            const token = await AsyncStorage.getItem('AccessToken');
            
            if (!token) {
                console.error('No token found');
                return;
            }
            const link = `${baseUrl}/event/${postId}`;
            //console.log('share', link);
        
            setShareableLink(link);
            setShareModalVisible(true);
            setSelectedPostId(postId);
        } catch (error) {
            console.error('Error handling share:', error);
        }
    }, [setShareableLink, setShareModalVisible]);
    
    const handleCloseModal = () => {
        setShareModalVisible(false);
    };
    
    const handleCommentPress = (postId) => {
        setSelectedPostId(postId);
        setCommentsVisible(true);
    };
    console.log("post",post);
    console.log("postID",post.id);
    return(
        <TouchableOpacity onPress={onPress}>
            <View style={styles.post}>
                <View style={styles.eventNameContainer}>
                    <Text style={styles.eventName}>{eventName}</Text>
                </View>
        
                <View style={styles.postHeader}>
                    <View style={styles.pfpContainer}>
                        <Image
                            source={profilePicture}
                            style={styles.pfp}
                        />
                    </View>
                    <View style={styles.postUser}>
                        <View>
                            <Text style={styles.userNameText}>{name}</Text>
                            <Text style={styles.userDescriptionText}>Organizer | {title}</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.postImageContainer}>
                    <Image source={coverImageUrl} style={styles.postImage}/>
                </View>
            
                <View style={styles.description}>
                    <Text style={styles.dateText}>{date}</Text>
                    <Text style={styles.descriptionText}>{description}</Text>
                    <Text style={styles.locationText}>{location}</Text>
                </View>
                <View style={styles.postInteraction}>
                    <View style={styles.likeSection}>
                        <Heart postId={post.id} like={post.liked}/>
                        <Text style={styles.likeCountText}>
                            {post.likes_count ?? 0}
                        </Text>
                    </View>
                        <TouchableOpacity style={styles.interactionButton} onPress={() => handleCommentPress(post.id)}>
                            <Comment />
                        </TouchableOpacity>
                        <Save postId={post.id} bookmark={post.bookmarked} />
                        <TouchableOpacity style={styles.shareButton} onPress={() => handleSharePress(post.id)}>
                        <SvgUri width="16" height="14" uri={shareIcon} />
                        </TouchableOpacity>
                        {isShareModalVisible && 
                        <ShareModal
                            isVisible={isShareModalVisible}
                            onClose={handleCloseModal}
                            link={shareableLink}
                        />}   
                    </View> 
                <MainButton onPress={handleAttend} title="Attend" />
            </View>
            <CommentsModal visible={commentsVisible} onClose={() => setCommentsVisible(false)} postId={selectedPostId} />
        </TouchableOpacity>
    )
}

export default DiscoverPost;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        position: "relative",
        paddingTop: "20%",
    },
    text: {
        fontSize: 20,
        fontWeight: "bold",
    },
    post: {
        backgroundColor: "#fff",
        borderRadius: 30,
        paddingBottom: 30,
        paddingTop: 20,
        margin: 20,
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
    postDescription: {
        marginBottom: 10,
    },
    description: {
        paddingHorizontal: 25,
        marginBottom: 20,
    },
    dateText: {
        fontFamily: "inter",
        fontSize: 13,
        fontWeight: "500",
    },
    descriptionText: {
        fontFamily: "inter",
        paddingTop: 5,
    },
    locationText: 
    {
        fontFamily: "inter",
        paddingTop: 5,
    },
    eventNameContainer: {
        paddingBottom: 2,
        paddingLeft: 24,
    },
    eventName: {
        fontFamily: "poppins-regular",
        fontSize: 22,
        fontWeight: "500",
        letterSpacing: 0.4,
        textAlign: "left",
    },
    postHeader: {
        paddingHorizontal: 20,
        paddingBottom: 10,
        flexDirection: "row",
        gap: 10,
        alignItems: "center",
    },
    pfpContainer: {
        width: 38,
        height: 38,
        borderColor: 'green',
        borderRadius: 19,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',

    },
    pfp: {
        width: 32, 
        height: 32, 
        resizeMode: "cover",
        borderRadius: 16,
        borderWidth: 1,
    },
    postImageContainer: {
        flex: 1,
        position: 'relative',
        marginBottom: 20,
    },
    postImage: {
        //width: "100%",
        //Height: "100%",
        //width: 100,
        height: 220,
    },
    postUser: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    userNameText: {
        fontFamily: "poppins-regular",
        fontSize: 15,
        fontWeight: "500",
        lineHeight: 23,
        letterSpacing: 0.4,
        textAlign: "left",
        color: 'black',
    },
    userDescriptionText: {
        fontFamily: "inter",
        fontSize: 12,
        fontWeight: "400",
        lineHeight: 16,
        letterSpacing: 0,
        textAlign: "left",
        color: "rgba(163, 163, 163, 1);\n",
    },
})
