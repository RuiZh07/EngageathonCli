import React, { useState } from "react";
import { TouchableOpacity } from "react-native";
import { SvgUri } from "react-native-svg";
import { heartIconFilled, heartIconOutline } from "../../utils/icons";

const Heart = () => {
    const [liked, setLiked] = useState(false);
  
    const handlePress = () => {
      setLiked(!liked);
    };
  
    const heartIcon = liked ? heartIconFilled : heartIconOutline;
  
    return (
        <TouchableOpacity onPress={handlePress}>
            <SvgUri
                uri={heartIcon}
                width="16" 
                height="14" 
            />
        </TouchableOpacity>
    );
};
  
export default Heart;