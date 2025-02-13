import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import LinearGradient from "react-native-linear-gradient";

const MainButton = ({ onPress, title, style, isDisabled=false }) => {
    return (
        <TouchableOpacity 
            onPress={isDisabled ? null : onPress}  // Prevent clicking if disabled
            style={[styles.buttonContainer, style, isDisabled && styles.disabledButton]}
        >
            <LinearGradient
                colors={["#FF8D00", "#FFBA00", "#FFE600"]}
                locations={[0.72, 0.86, 1]}  
                start={{ x: 0, y: 0 }}      
                end={{ x: 1, y: 0 }}
                style={styles.button}
            >
                <Text style={styles.buttonText}>
                    {title}
                </Text>
            </LinearGradient>
        </TouchableOpacity>
    );
};
  
export default MainButton;
  
const styles = StyleSheet.create({
    buttonContainer: {
        alignSelf: 'center',
        width: '90%',
    },
    button: {
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
    },
    buttonText: {
        fontFamily: "Poppins-SemiBold",
        fontSize: 16,
        lineHeight: 22,
        letterSpacing: 0.4,
        color: "#F5F4F4",
    },
    disabledButton: {
        opacity: 0.8,
    },
    disabledText: {
        color: "#2BAB47",
    },
});
  