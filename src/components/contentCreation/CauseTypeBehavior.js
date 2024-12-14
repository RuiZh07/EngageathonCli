import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import LinearGradient from "react-native-linear-gradient";

const CauseTypeBehavior = ({ onPress, isPressed, buttonText }) => {
    return (
        <TouchableOpacity
            onPress={onPress}
            style={[
                isPressed ? styles.gradientCauseTypeObject : styles.causeTypeObject,
                isPressed && {
                    paddingVertical: 0,
                    paddingHorizontal: 0,
                    margin: 0,
                },
            ]}
        >
            {isPressed ? (
                <LinearGradient
                    colors={['#FF8D00', '#FFE600']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.gradientCauseTypeObject}
                >
                    <Text>{buttonText}</Text>
                </LinearGradient>
            ) : (
                <Text>{buttonText}</Text>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    causeTypeObject: {
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 16,
        margin: 5,
        marginLeft: 0,
        textAlign: "center",
        overflow: "hidden",
        backgroundColor: "#D3D3D3",
        color: "black",
    },
    gradientCauseTypeObject: {
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 16,
        margin: 5,
        marginLeft: 0,
        textAlign: 'center',
        overflow: 'hidden',
    },
});

export default CauseTypeBehavior;
