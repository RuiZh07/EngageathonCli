import React from "react";
import { View, Text, StyleSheet } from "react-native";
import LinearGradient from "react-native-linear-gradient";

const Chip = ({ label }) => {
    return (
        <View style={styles.container}>
            <LinearGradient colors={["#FF8D00", "#FFE600"]} style={styles.gradient}>
                <View style={styles.content}>
                    <Text style={styles.label}>{label}</Text>
                </View>
            </LinearGradient>
        </View>
    );
};

export default Chip;

const styles = StyleSheet.create({
    container: {
        marginVertical: 10,
    },
    gradient: {
        borderRadius: 50,
        overflow: "hidden",
    },
    content: {
        padding: 6,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
    },
    label: {
        fontWeight: "600",
        fontSize: 10,
        lineHeight: 10,
        color: "#F5F4F4",
        textTransform: "capitalize",
        textAlign: "center",
    },
});