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
    TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CommentsModal from "../modals/CommentsModal";
import { useNavigation } from "@react-navigation/native";
import { SvgUri } from "react-native-svg";
import { shareIcon } from "../../utils/icons";
import baseUrl from "../../utils/api";
import apiClient from "../../services/apiClient";

const DiscoverPost = ({
    profilePicture,
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
    const [commentsVisible, setCommentsVisible] = useState(false);
    const [selectedPost, setSelectedPost] = useState(null);
    const navigation = useNavigation();
    const [isShareModalVisible, setShareModalVisible] = useState(false);

    const [shareableLink, setShareableLink] = useState('');
    console.log('post', post);

    const generateQrCode = async (post) => {
        try {
            const token = await AsyncStorage.getItem("AccessToken");

            const response = await apiClient.post(`${baseUrl}/events/qrcode/${post.id}/`, {}, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.data && response.data.qr_code_token) {
                console.log("QR Code Generated Successfully:", response.data.qr_code_token);
            } else {
                console.log("Error: QR code generation failed.");
                Alert.alert("QR Code generation failed. Please try again.");
            }
        } catch (error) {
            console.error("Error generating QR code:", error);
        }
    };

    // Pass the post details and event's date
    const handleAttend = async (post) => {
        try {
            const token = await AsyncStorage.getItem('AccessToken');
            
            if (!token) {
                console.error('No token found');
                return;
            }

            const response = await apiClient.post(`${baseUrl}/events/attendance/${post.id}/`, {}, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
            });

            if (response.status >= 200 && response.status < 300) {
                console.log("Attendance status updated successfully");
                generateQrCode(post);
                navigation.navigate("CalendarScreen");
            } else {
                console.error('Failed to update attendance status');
            }
        } catch (error) {
            console.error("Error attending event:", error);
        }
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
    
    const handleCommentPress = (post) => {
        setSelectedPost(post);
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
                        <Heart postId={post.id} like={post.liked} contentType={post.content_type} />
                        <Text style={styles.likeCountText}>
                            {post.likes_count ?? 0}
                        </Text>
                    </View>
                        <TouchableOpacity style={styles.interactionButton} onPress={() => handleCommentPress(post)}>
                            <Comment />
                        </TouchableOpacity>
                        <Save postId={post.id} bookmark={post.bookmarked} contentType={post.content_type} />
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
                <MainButton
                    title={post.attending ? "Attending" : "Attend"}
                    isDisabled={post.attending}
                    onPress={() => handleAttend(post)}
                />
            </View>
            {commentsVisible && 
                <CommentsModal 
                    visible={commentsVisible} 
                    onClose={() => setCommentsVisible(false)} 
                    post={selectedPost} 
                />
            }
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
        marginHorizontal: 20,
        marginBottom: 20,
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
        fontFamily: "Poppins-Regular",
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
        fontFamily: "Inter-Bold",
        fontSize: 13,
        color: '#000000',
    },
    descriptionText: {
        fontFamily: "Inter-Medium",
        color: '#3A3D3F',
        paddingTop: 5,
        fontSize: 16,
    },
    locationText: {
        fontFamily: "Inter-Medium",
        paddingTop: 3,
        color: '#3A3D3F',
        fontSize: 15,
    },
    eventNameContainer: {
        paddingBottom: 2,
        paddingLeft: 24,
    },
    eventName: {
        fontFamily: "Poppins-Medium",
        fontSize: 22,
        fontWeight: "500",
        letterSpacing: 0.4,
        textAlign: "left",
        color: '#000000',
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
        marginBottom: 12,
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
        fontFamily: "Poppins-Medium",
        fontSize: 15,
        lineHeight: 23,
        letterSpacing: 0.4,
        textAlign: "left",
        color: 'black',
    },
    userDescriptionText: {
        fontFamily: "Inter-Regular",
        fontSize: 12,
        lineHeight: 16,
        letterSpacing: 0,
        textAlign: "left",
        color: "rgba(163, 163, 163, 1);\n",

    },
})
