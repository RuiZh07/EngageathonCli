import React from "react";
import { SvgUri } from "react-native-svg";
import {
    StyleSheet,
    TouchableOpacity,
    View,
} from "react-native";
import { bellIcon, settingsIcon, engageathonIcon } from "../../utils/icons";

const HomeHeader = ({ onFilterPress }) => {
    return (
        <View style={styles.container}>
            <SvgUri uri={engageathonIcon} />

            <View style={styles.settingsContainer}>
                <TouchableOpacity onPress={onFilterPress}>
                    <SvgUri uri={settingsIcon} />
                </TouchableOpacity>

                <TouchableOpacity>
                    <SvgUri uri={bellIcon} />
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default HomeHeader;

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

