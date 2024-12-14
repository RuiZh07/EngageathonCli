import React from "react";
import { TouchableOpacity, View, Image } from "react-native";
import { SvgUri } from "react-native-svg";
import { shareIcon } from "../../utils/icons";

const Share = () => {
    return (
        <View>
            <SvgUri width="16" height="14" uri={shareIcon} />
        </View>

    );
};

export default Share;