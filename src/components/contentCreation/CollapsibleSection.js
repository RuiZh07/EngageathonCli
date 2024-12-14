import React, { useState, useEffect, useContext, useRef } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ImageBackground,
    ScrollView,
    Alert,
    Animated,
    Platform
} from "react-native";
import { SvgUri } from "react-native-svg";
import { upArrowIcon, downArrowIcon } from '../../utils/icons';
import CauseTypeBehavior from '../../components/contentCreation/CauseTypeBehavior';

const CollapsibleSection = ({ title, data, onPressItem, pressedStates }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [contentHeight, setContentHeight] = useState(0);
    const animatedHeight = useRef(new Animated.Value(185)).current;
    const THRESHOLD_HEIGHT = 170; // min height

    useEffect(() => {
        Animated.timing(animatedHeight, {
            toValue: isExpanded ? contentHeight : Math.min(contentHeight, THRESHOLD_HEIGHT),
            duration: 300,
            useNativeDriver: false,
        }).start();
    }, [isExpanded, contentHeight]);

    const handleToggle = () => {
        setIsExpanded(!isExpanded);
    };

    return (
        <View style={styles.eachContainer}>
            <View style={styles.causeTypeHeader}>
                <Text style={styles.causeTypeName}>{title}</Text>
            </View>
            <Animated.View
                style={[
                    styles.causeTypeContainer,
                    { height: animatedHeight, overflow: 'hidden' },
                ]}
            >
                <View
                    onLayout={(event) => {
                        setContentHeight(event.nativeEvent.layout.height);
                    }}
                    style={styles.causeTypeContent}
                >
                     {data.map((cause) => {
                        return (
                            <CauseTypeBehavior
                                key={cause.id}
                                onPress={() => onPressItem(cause)}
                                isPressed={pressedStates[cause.name] || false}  // Ensure default false if the cause name is not found in pressedStates
                                buttonText={cause.name}
                            />
                        );
                    })}
                </View>
            </Animated.View>

            {contentHeight > THRESHOLD_HEIGHT && (
                <TouchableOpacity onPress={handleToggle} style={styles.iconButton}>
                    <SvgUri 
                        uri={isExpanded ? upArrowIcon : downArrowIcon} 
                        size={20} 
                        color="#000" 
                    />
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    eachContainer: {
        backgroundColor: "#FFFFFF",
        height: "auto",
        borderRadius: 30,
        margin: 10,
        marginBottom: 10,
        paddingTop: 15,
    },
    causeTypeHeader: {
        flexDirection: 'row',
        //justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 5,
        borderBottomWidth: 1,
        borderBottomColor: '#D3D3D3',
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
    },
    causeTypeName: {
        fontSize: 22,
        fontFamily: "Poppins-Bold",
        color: '#000000',
        paddingLeft: 20,
        paddingBottom: 5,
    },
    causeTypeContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginLeft: 20,
        marginBottom: 10,
    },
    causeTypeContent: {
        flexDirection: "row",
        flexWrap: "wrap",
        marginTop: 10,
        marginBottom: 10,
        paddingBottom: 10,
    },
    iconButton: {
        alignItems: 'center',
        padding: 10,
    },
})

export default CollapsibleSection;