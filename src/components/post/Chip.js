import React from "react";
import { View, Text, StyleSheet } from "react-native";
import LinearGradient from "react-native-linear-gradient";

const Chip = ({ label }) => {
    return (
        <View style={styles.container}>
            <LinearGradient  
                colors={["#FF8D00", "#FFBA00", "#FFE600"]}
                locations={[0.72, 0.86, 1]}  
                start={{ x: 0, y: 0 }}      
                end={{ x: 1, y: 0 }} 
                style={styles.gradient}
            >
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
       // marginVertical: 10,
    },
    gradient: {
        borderRadius: 50,
        overflow: "hidden",
    },
    content: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },
    label: {
        fontFamily: 'Inter-Medium',
        fontSize: 12,
        color: "#000000",
        textTransform: "capitalize",
        textAlign: "center",
        paddingHorizontal: 10,
        paddingVertical: 6,
    },
});