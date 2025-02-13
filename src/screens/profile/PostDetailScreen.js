import React from 'react';
import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity, ImageBackground, Platform } from 'react-native';
import Chip from '../../components/post/Chip';
import Heart from '../../components/post/Heart';
import Comment from '../../components/post/Comment';
import Save from '../../components/post/Save';
import { useNavigation } from "@react-navigation/native";
import { backArrow, greyDots } from "../../utils/icons";
import { SvgUri } from "react-native-svg";

const PostDetailScreen = ({ route }) => {
    const { postDetails } = route.params || {};
    const navigation = useNavigation();

    console.log(postDetails)
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
                <View style={styles.container}>
                    <View style={styles.post}>
                        <View style={styles.postHeader}>
                            <TouchableOpacity
                                style={styles.backButton}
                                onPress={() => navigation.goBack()}
                            >
                                <SvgUri uri={backArrow} />
                            </TouchableOpacity>

                            {postDetails.caption ? (
                                <View style={styles.postHeader}>
                                    <View style={styles.pfpContainer}>
                                        <Image
                                            source={postDetails?.profile_photo_url 
                                                ? { uri: postDetails.profile_photo_url } 
                                                : require("../../assets/default_profile.png")
                                            }
                                            style={styles.pfp}
                                        />
                                    </View>
                                    <View style={styles.postUser}>
                                        <View>
                                            <Text style={styles.userNameText}>{postDetails.username}</Text>
                                        </View>
                                    <TouchableOpacity>
                                        <SvgUri uri={greyDots} />
                                    </TouchableOpacity>
                                    </View>
                                </View>
                            ) : (
                                <View style={styles.postHeader}>
                                    <View style={styles.pfpContainer}>
                                        <Image
                                            source={postDetails?.profile_photo_url 
                                                ? { uri: postDetails.profile_photo_url } 
                                                : require("../../assets/default_profile.png")
                                            }
                                            style={styles.pfp}
                                        />
                                    </View>
                                <View style={styles.postUser}>
                                <View>
                                    <Text style={styles.userNameText}>{postDetails.name}</Text>
                                    <Text style={styles.userDescriptionText}>
                                    Organizer | {postDetails.event_type}
                                    </Text>
                                </View>
                                <TouchableOpacity>
                                    <SvgUri uri={greyDots} />
                                </TouchableOpacity>
                                </View>
                            </View>
                            )}
                        </View>

                        {postDetails.location && <Text style={styles.location}>{postDetails.location}</Text>}
                        
                        <View style={styles.postTags}>
                            {postDetails.categories && (
                                postDetails.categories.map((category, index) => (
                                    <Chip key={index} label={category.name} />
                                ))  
                            )}
                        </View>
                        
                        <View style={styles.postImageContainer}>
                            {postDetails.image_urls.map((image, index) => (
                                <Image
                                    key={index}
                                    source={{ uri: postDetails.image_urls[0]?.image_url || "/mnt/data/Media (7).jpg" }}
                                    style={styles.postImage}
                                />
                            ))}
                        </View>
                        <View style={styles.postInteraction}>
                            <View style={styles.likeSection}>
                                <TouchableOpacity onPress={() => handleLikePress(postDetails.id)}>
                                    <Heart filled={false} />
                                </TouchableOpacity>
                                <Text style={styles.likeCountText}>
                                    {postDetails.likes_count || 0}
                                </Text>
                            </View>
                            <TouchableOpacity style={styles.interactionButton} onPress={() => handleCommentPress(postDetails.id)}>
                                <Comment />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.saveButton} onPress={() => handleBookmarkPress(postDetails.id)}>
                                <Save filled={false} />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.interactionButton}>
                                
                            </TouchableOpacity>
                        </View>
                        {postDetails.caption && <Text style={styles.caption}>{postDetails.caption}</Text>}
                        {postDetails.tagged_users && (
                            <Text style={styles.taggedUsers}>
                                {postDetails.tagged_users.map(user => `@${user.username}`).join('  ')}
                            </Text>
                        )}
                        <View style={styles.postDescription}>
                            <Text style={styles.postDescriptionText}>
                                {postDetails.description}
                            </Text>
                        </View>
                        {postDetails.activities && postDetails.activities.length > 0 && (
                            <View style={styles.activitiesContainer}>
                                <Text style={styles.activitiesTitle}>Activities</Text>
                                {postDetails.activities.map((activity, index) => (
                                    <View key={index} style={styles.activityContainer}>
                                        <Text style={styles.activityName}>{activity.name}</Text>
                                        <Text style={styles.activityPoints}>Points: {activity.points}</Text>
                                    </View>
                                ))}
                            </View>
                        )}
                    </View>
                </View>
            </ScrollView>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    backgroundImage: {
        flex: 1,
        resizeMode: 'cover',
    },
    scrollView: {
        flex: 1,
    },
    scrollContentContainer: {
        paddingBottom: 20, // Adjust as needed
    },
    header: {
        paddingHorizontal: 16,
        paddingTop: 10,
        marginTop:'10%',
    },
    backButton: {
        padding: 10,
        backgroundColor: 'transparent', // Change this to 'transparent'
        borderRadius: 5,
    },
    container: {
        flex: 1,
        paddingHorizontal: 16,
        paddingTop: 16,
    },
    post: {
        marginTop: '14%',
        backgroundColor: "#fff",
        borderRadius: 20,
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
    },
    profileImage: {
        width: 34,
        height: 36,
        resizeMode: "contain",
    },
    postUser: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        flex: 1,
        marginLeft: 10,
    },
    userNameText: {
        fontSize: 16,
        fontFamily: "poppins-bold",
        color: "#333",
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
    userDescriptionText: {
        fontSize: 12,
        fontFamily: "poppins-regular",
        color: "#666",
    },
    location: {
        fontSize: 16,
        fontWeight: 'bold',
        marginVertical: 5,
        marginTop: 10,
        marginLeft: 8,
    },
    postTags: {
        flexDirection: "row",
        gap: 6,
        marginRight: 10,
        flexWrap: 'wrap',
    },
    postImageContainer: {
        marginVertical: 10,
    },
    postImage: {
        width: "100%",
        height: 200,
        borderRadius: 10,
        marginBottom: 10,
        resizeMode: "cover",
    },
    postInteraction: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 15,
        marginBottom: 20,
    },
    likeSection: {
        flexDirection: "row",
        alignItems: "center",
        marginRight: 12,
    },
    likeCountText: {
        fontSize: 14,
        fontFamily: "poppins-regular",
        color: "#333",
        marginLeft: 4,
    },
    interactionButton: {
        marginHorizontal: 12,
    },
    saveButton: {
        marginLeft: 12,
    },
    caption: {
        fontSize: 14,
        marginVertical: 5,
        fontFamily: "poppins-medium",
        marginLeft: 5,
    },
    taggedUsers: {
        fontSize: 12,
        color: '#555',
        marginVertical: 5,
    },
    postDescription: {
        marginBottom: 10,
    },
    postDescriptionText: {
        fontSize: 14,
        fontFamily: "poppins-medium",
        color: "#333",
        marginLeft: 5,
    },
    activitiesContainer: {
        marginVertical: 10,
    },
    activitiesTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    activityContainer: {
        marginBottom: 10,
    },
    activityName: {
        fontSize: 16,
    },
    activityPoints: {
        fontSize: 14,
        color: 'gray',
    },
});

export default PostDetailScreen;