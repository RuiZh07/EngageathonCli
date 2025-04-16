import React, { useEffect, useState, useCallback } from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    ScrollView,
    TouchableOpacity,
    TouchableWithoutFeedback,
    BackHandler,
    ImageBackground,
    Alert,
    RefreshControl,
    Platform,
} from "react-native";
import MessageHeader from "../../components/message/MessageHeader";

const MessageScreen = () => {
    return (
        <ImageBackground
            source={require("../../assets/main-background.png")}
            style={styles.backgroundImage}
        >
            <View style={styles.container}>
                <MessageHeader />
                <Text style={styles.comingText}>Coming soon....</Text>
            </View>
        </ImageBackground>
    )
};

const styles = StyleSheet.create({
    backgroundImage: {
        flex: 1,
        width: "100%",
    },
    container: {
        flexGrow: 1,
        position: "relative",
        paddingTop: Platform.OS === "android" ? "6%": "15%",
    },
    comingText: {
        color:'white',
        fontSize: 24,
        alignSelf: 'center',
    },
})

export default MessageScreen;