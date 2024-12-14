import React, { useState } from "react";
import { TouchableOpacity } from "react-native";
import { SvgUri } from "react-native-svg";
import { saveIconFilled, saveIconOutline } from "../../utils/icons";

const Save = () => {
    const [saved, setSaved] = useState(false);
  
    const handlePress = () => {
        setSaved(!saved);
    };
  
    const saveIcon = saved ? saveIconFilled : saveIconOutline;
  
    return (
        <TouchableOpacity onPress={handlePress}>
            <SvgUri
                uri={saveIcon}
                width="16" 
                height="14" 
            />
        </TouchableOpacity>
    );
};
  
export default Save;