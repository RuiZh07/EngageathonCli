import React, { useState, useEffect } from "react";
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    ImageBackground,
    Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import baseUrl from "../../utils/api";
import { backArrow, gradientLine } from "../../utils/icons";
import { SvgUri } from "react-native-svg";
import apiClient from "../../services/apiClient";

const BookmarkedEventScreen = () => {
    const [bookmarkedEvent, setBookmarkedEvent] = useState([]);
    const navigation = useNavigation();
    
    useEffect(() => {
        const fetchBookmarkedEvent = async () => {
            try {
                const token = await AsyncStorage.getItem("AccessToken");
    
                const response = await apiClient.get(`${baseUrl}/users/bookmark/`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
    
                if (response.data) {
                    setBookmarkedEvent(response.data);
                    console.log(response.data);
                }
            } catch (error) {
                console.error("Error fetching liked events", error);
            }
        }; 
        fetchBookmarkedEvent();
    }, []);

    const handleImageClick = (event) => {
        navigation.navigate('EventDetailScreen', { event });
    };

    return (
        <ImageBackground
            source={require('../../assets/main-background.png')}
            style={styles.backgroundImage}
        >
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <SvgUri uri={backArrow} />
                </TouchableOpacity>
                <Text style={styles.headerText}>Saves</Text>
            </View>
            
            <View style={styles.container}>
                <SvgUri uri={gradientLine} />
                <View style={styles.gridContainer}>
                    {bookmarkedEvent && bookmarkedEvent.length ? (
                        bookmarkedEvent.map((content) => (
                            <TouchableOpacity
                                key={`${content.id}-${content.content_object_id}`}
                                style={styles.imageItem}
                                onPress={() => handleImageClick(content)}
                            >
                                <Image
                                    source={{ uri: content?.content_profile_photo_url || "/mnt/data/Media (7).jpg" }}
                                    style={styles.gridImage}
                                />
                            </TouchableOpacity>
                        ))
                    ) : (
                        <Text style={styles.noContentText}>You haven't bookmarked any posts yet</Text>    
                    )}
                </View>
            </View>
        </ImageBackground>
    );
};
  
const styles = StyleSheet.create({
    backgroundImage: {
        flex: 1,
        width: "100%",
    },
    container: {
        flex: 1,
        padding: 20,
    },
    title: {
        color: '#FF8D00',
        fontSize: 28,
        marginBottom: 20,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
        paddingHorizontal: "5%",
        marginTop: "15%",
    },
    headerText: {
        color: "#FFE600",
        fontSize: 24,
        fontFamily: "Poppins-Medium",
        paddingLeft: 15,
    },
    likeIcon: {
        marginHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    iconsContainer: {
        flexDirection: 'row',
        marginRight: 20,
        alignItems: 'center',
    },
    wordText: {
        color: '#FFFFFF',
        fontSize: 20,
        fontFamily: "Inter-Medium",
        marginLeft: 10,
    },
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        width: '100%',
        flex: 1,
        paddingTop: 20,
    },
    imageItem: {
        width: '33%',
        height: 120,
        marginBottom: 2,
        justifyContent: 'center', 
        alignItems: 'center',      
        overflow: 'hidden',  
        //flex: 1,
    },
    gridImage: {
        width: '100%',
        height: '100%', 
        resizeMode: 'cover',
        borderRadius: 10, 
        borderColor: '#FFFFFF',
        borderWidth: 1,
    },
});
  
export default BookmarkedEventScreen;