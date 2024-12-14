import React from "react";
import { TouchableOpacity, View, Image } from "react-native";
import { SvgUri } from "react-native-svg";
import { commentIcon } from "../../utils/icons";

const Comment = () => {
    const handlePress = () => {
        //handel comment
    };

    return (
        <TouchableOpacity onPress={handlePress}>
            <SvgUri 
                uri={commentIcon}
                width="16" 
                height="14"  
            />
        </TouchableOpacity>
    );
}

export default Comment;