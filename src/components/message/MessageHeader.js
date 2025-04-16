import React from "react";
import { SvgUri } from "react-native-svg";
import {
    StyleSheet,
    TouchableOpacity,
    View,
    Text,
} from "react-native";
import { bellIcon } from "../../utils/icons";

const MessageHeader = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.messageText}>Message</Text>
            <View style={styles.settingsContainer}>
                <TouchableOpacity>
                    <SvgUri uri={bellIcon} />
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default MessageHeader;

const styles = StyleSheet.create({
    container: {
        width: "100%",
        justifyContent: "space-between",
        paddingBottom: 20,
        paddingHorizontal: 22,
        flexDirection: "row",
    },
    messageText: {
        color: '#FFE600',
        fontFamily: 'Poppins-Medium',
        fontSize: 24,
    },
    settingsContainer: {
        flexDirection: "row",
    },
});

