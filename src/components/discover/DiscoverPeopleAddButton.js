import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { LinearGradient } from "react-native-linear-gradient";

const DiscoverPeopleAddButton = ({ onPress, title, clicked }) => {
    return (
        <TouchableOpacity onPress={onPress} style={styles.buttonContainer}>
            <LinearGradient
                colors={clicked ? ["#2BAB47", "#2BAB47"] : ["#FF8D00", "#FFB900", "#FFE600"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.button}
            >
                <Text style={styles.buttonText}>{clicked ? "Request Sent!" : title}</Text>
            </LinearGradient>
        </TouchableOpacity>
    );
};

export default DiscoverPeopleAddButton;

const styles = StyleSheet.create({
    buttonContainer: {
        alignItems: "center",
        marginHorizontal: 10, 
        marginVertical: 10, 
    },
    button: {
        width: 110,
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
    },
    buttonText: {
        fontFamily: "Poppins-SemiBold",
        fontSize: 13,
        lineHeight: 22,
        letterSpacing: 0.4,
        color: "#F5F4F4",
    },
});
