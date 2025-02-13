import React from "react";
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
import { backArrow } from "../../utils/icons";
import { useNavigation } from "@react-navigation/native";
import DiscoverPostHeader from "../../components/discover/DiscoverPostHeader";

const DiscoverPostDetailScreen = ({ route }) => {
    const { event } = route.params;
    const navigation = useNavigation(); 

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
                                    source={event?.profile_photo_url 
                                        ? { uri: event.profile_photo_url } 
                                        : require("../../assets/default_profile.png")
                                    }
                                    style={styles.pfp}
                                />
                            </View>
                            <View style={styles.userInfo}>
                                <View>
                                    <Text style={styles.userNameText}>{event.username}</Text>
                                    <Text style={styles.userDescriptionText}>organizer | {event.event_type}</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                    
                    <View style={styles.postTags}>
                        {event.categories && (
                            event.categories.map((category, index) => (
                                <Chip key={index} label={category.name} />
                            ))  
                        )}
                    </View>
                    <Image style={styles.image} source={{ uri: event.image_urls[0]?.image_url || "/mnt/data/Media (7).jpg" }} />
                    {/*
                    <View style={styles.postInteraction}>
                        <View style={styles.likeSection}>
                            <Heart postId={event.id} like={event.liked}/>
                            <Text style={styles.likeCountText}>
                                {event.likes_count ?? 0}
                            </Text>
                        </View>
                        {event.event_type && (
                            <TouchableOpacity style={styles.interactionButton} onPress={() => handleCommentPress(event.id)}>
                                <Comment />
                            </TouchableOpacity>
                        )}

                        <Save postId={event.id} bookmark={event.bookmarked} />

                        <TouchableOpacity style={styles.shareButton}>
                            <Share />
                        </TouchableOpacity>    
                    </View> 
                    */}
                    <Text style={styles.eventNameText}>{event.name}</Text>
                    <Text style={styles.description}>{event.description}</Text>

                {/*<MainButton onPress={handleAttend} title="Attend" />*/}
                </View>
            </ScrollView>
        </ImageBackground>
    );
}

export default DiscoverPostDetailScreen;

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
