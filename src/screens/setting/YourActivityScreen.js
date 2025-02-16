import React, { useState } from "react";
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Alert,
    ImageBackground,
    Switch,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import baseUrl from "../../utils/api";
import { backArrow, gradientLine, heartGradient, bookmarkGradient, whiteRightArrow } from "../../utils/icons";
import { SvgUri } from "react-native-svg";
import apiClient from "../../services/apiClient";
import LikedEventScreen from "./LikedEventScreen";

const YourActivityScreen = () => {
    const [isPrivate, setIsPriavte] = useState(false);
    const navigation = useNavigation();

    const togglePrivacy = async () => {
        try {
            const token = await AsyncStorage.getItem("AccessToken");

            const response = await apiClient.put(`${baseUrl}/auth/privateuser/`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.data) {
                setIsPriavte(previousState => !previousState);
                console.log(response.data);
                Alert.alert(response.data.message);
            } else {
                console.log("Error: update your account privacy");
            }
        } catch (error) {
            console.error("Error updating your account privacy", error);
        }
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
                <Text style={styles.headerText}>Your Activity</Text>
            </View>
            
            <View style={styles.container}>
                <SvgUri uri={gradientLine} />
                <TouchableOpacity style={styles.likeIcon} onPress={() => navigation.navigate('LikedEventScreen')}>
                    <View style={styles.iconsContainer}>
                        <SvgUri uri={heartGradient} />
                        <Text style={styles.wordText}>Likes</Text>
                    </View>
                        <SvgUri uri={whiteRightArrow} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.likeIcon}>
                    <View style={styles.iconsContainer}>
                        <SvgUri uri={bookmarkGradient} />
                        <Text style={styles.wordText}>Saves</Text>
                    </View>
                        <SvgUri uri={whiteRightArrow} />
                </TouchableOpacity>
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
    infoTextContainer: {
        marginTop: 30,
        marginHorizontal: 10,
    },
});
  
export default YourActivityScreen;