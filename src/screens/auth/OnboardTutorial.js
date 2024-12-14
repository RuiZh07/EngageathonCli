import React, { useRef } from "react";
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    Animated,
    Dimensions,
    Image,
    TouchableOpacity,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get("window");
const cardWidth = width;

const images = [
    require("../../assets/tutorial/onboarding.png"),
    require("../../assets/tutorial/onboarding_1.png"),
    require("../../assets/tutorial/onboarding_2.png"),
    require("../../assets/tutorial/onboarding_3.png"),
    require("../../assets/tutorial/onboarding_4.png"),
    require("../../assets/tutorial/onboarding_5.png"),
];


export default function ImageSlider() {
    const stack = useNavigation();
    const handleGetStartedButton = () => {
        stack.navigate('Splash');
    };

    const animate = useRef(new Animated.Value(0)).current;

    // Add a state to track the number of slide user has slide. If the user reached the end of the tutorial onboard, the count would be 5 == show "Get Started" button
    const [currentTutorialIndex, setCurrentTutorialIndex] = React.useState(1);

    // Add an effect to update the index when the ScrollView is scrolled
    const handleScrollEnd = (event) => {
        const contentOffset = event.nativeEvent.contentOffset.x;
        const currentIndex = Math.round(contentOffset / width);
        setCurrentTutorialIndex(currentIndex + 1);
    };

    return (
        <View style={styles.mainBackgroundColor}>
            <View style={styles.container}>
                <ScrollView
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    decelerationRate="fast"
                    onScroll={Animated.event(
                        [{ nativeEvent: { contentOffset: { x: animate } } }],
                        { useNativeDriver: false }
                    )}
                    onMomentumScrollEnd={handleScrollEnd}
                >
                    {images.map((image, index) => (
                        <TouchableOpacity
                            key={index}
                            style={styles.cardContainer}
                            activeOpacity={0.9}
                        >
                            <Image source={image} style={styles.card} />
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                <View style={styles.indicator}>
                    {images.map((_, i) => {
                        const translateX = animate.interpolate({
                            inputRange: [-width + i * width, width * i, width + i * width],
                            outputRange: [-20, 0, 20],
                        });

                        return (
                            <View key={i} style={styles.dot}>
                                <Animated.View
                                    style={[
                                        styles.animatedDot,
                                        { transform: [{ translateX: translateX }] },
                                    ]}
                                />

                            </View>
                        );
                    })}
                    <TouchableOpacity
                        style={styles.startedButton}
                        onPress={handleGetStartedButton}
                    >
                        {currentTutorialIndex < images.length ? (
                            <Text style={styles.skipButtonText}>Skip</Text>
                        ) : (
                            <Text style={[styles.skipButtonText, styles.beginButtonText]}>Let's Begin!</Text>
                        )}
                    </TouchableOpacity>
                </View>

            </View>
        </View>

    );
}

const styles = StyleSheet.create({
    mainBackgroundColor: {
        backgroundColor: "#1f1f1e"
    },
    container: {
        marginVertical: 0
    },
    cardContainer: {
        width: cardWidth,
        height: height,
    },
    card: {
        flex: 1,
        width: '100%',
        height: '100%',
        resizeMode: "cover"
    },
    indicator: {
        flexDirection: "row",
        position: "absolute",
        bottom: 20,
        alignSelf: "center",
    },
    dot: {
        height: 10,
        width: 10,
        backgroundColor: "#fff",
        borderRadius: 5,
        marginHorizontal: 5,
        overflow: "hidden",
    },
    animatedDot: {
        height: 10,
        width: 10,
        backgroundColor: "#2BAB47",
        position: "absolute",
    },
    startedButton: {
        marginTop: -6,
        marginLeft: 10,
    },
    skipButtonText: {
        color: 'white',
        fontFamily: 'Poppins-SemiBold',
    },
    beginButtonText: {
        color: '#FFDE1A',
    },
});