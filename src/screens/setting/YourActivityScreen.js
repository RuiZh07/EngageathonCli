import React, { useState } from "react";
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    ImageBackground,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { backArrow, gradientLine, heartGradient, bookmarkGradient, whiteRightArrow } from "../../utils/icons";
import { SvgUri } from "react-native-svg";

const YourActivityScreen = () => {
    const navigation = useNavigation();

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
                <TouchableOpacity style={styles.likeIcon} onPress={() => navigation.navigate('BookmarkedEventScreen')}>
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