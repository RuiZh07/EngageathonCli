import React from "react";
import { View } from "react-native";
import { SvgUri } from "react-native-svg";
import { commentIcon } from "../../utils/icons";

const Comment = () => {
    return (
        <View>
            <SvgUri 
                uri={commentIcon}
                width="16" 
                height="14"  
            />
        </View>
    );
}

export default Comment;