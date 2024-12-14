import React from "react";
import {
    StyleSheet,
    TouchableOpacity,
    View,
} from "react-native"
import { SvgUri } from "react-native-svg";
import { bellIcon, engageathonIcon } from "../../utils/icons";

const DiscoverPostHeader = () => {
    return (
        <View style={styles.container}>
            <SvgUri uri={engageathonIcon} />
            <View style={styles.settingsContainer}>
                <TouchableOpacity>
                <SvgUri uri={bellIcon} />
                </TouchableOpacity>
            </View>
        </View>   
    );
}

export default DiscoverPostHeader;

const styles = StyleSheet.create({
    container: {
        width: "100%",
        justifyContent: "space-between",
        paddingBottom: 20,
        paddingHorizontal: 22,
        flexDirection: "row",
    },
    settingsContainer: {
        flexDirection: "row",
        gap: 5,
    },
});
