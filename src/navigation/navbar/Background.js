import React from "react";
import { SvgUri } from "react-native-svg";
import { Dimensions, TouchableWithoutFeedback, StyleSheet } from "react-native";
import { Image } from "react-native";
import background from "../../assets/icons/TabBackground.png";

const { width: screenWidth } = Dimensions.get("window");

const Background = ({ style }) => {
    return (
        <Image source={background} style={[styles.background, style]}/>
    )
};

const styles = StyleSheet.create({
    background: {
        width: screenWidth,  
        height: undefined,   
        aspectRatio: 1,     
        resizeMode: 'contain', 
    }
});
export default Background;