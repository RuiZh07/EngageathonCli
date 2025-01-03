import { React, useState, useEffect } from 'react';
import { ImageBackground,
    StyleSheet,
    View,
    Text,
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import { SvgUri } from "react-native-svg";
import RenderHTML from 'react-native-render-html';
import { useWindowDimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import baseUrl from '../../utils/api';
import { useNavigation } from "@react-navigation/native";
import { backArrow, gradientLine } from '../../utils/icons';
import apiClient from '../../services/apiClient';

const PrivacyPolicyScreen = () => {
    const navigation = useNavigation();
    const { width } = useWindowDimensions();
    const [privacyPolicyInfo, setPrivacyPolicyInfo] = useState("");

    useEffect(() => {
        const fetchPrivacyPolicy = async () => {
            try {
                const token = await AsyncStorage.getItem("AccessToken");
                if(!token) {
                    console.error("no token found");
                    return;
                }
                const response = await apiClient.get(`${baseUrl}/auth/privacypolicy/`, {
                    headers: {
                        "Authorization": `Token ${token}`,
                    },
                });
    
                if (response.status < 200 || response.status >= 300) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const privacyPolicyInfo = await response.data;
               // const plainText = privacyPolicyInfo.replace(/<\/?[^>]+(>|$)/g, "");
                setPrivacyPolicyInfo(privacyPolicyInfo);
            } catch (error) {
                console.error("error to fetch data", error);
            }
        };
          fetchPrivacyPolicy();
    }, []);

    const tagsStyles = {
        h1: {
            color: 'white',
            fontSize: 20,
            fontFamily: 'inter',
        },
        p: {
            color: 'white',
            fontSize: 16,
            fontFamily: 'inter',
            textAlign: 'justify',
            lineHeight: 20,
        },
    };

    return (
        <ImageBackground
            source={require("../../assets/main-background.png")}
            style={styles.container}
        >
            <View style={styles.header}>
                <TouchableOpacity style={styles.headerLeft} onPress={() => navigation.goBack()}>
                    <SvgUri uri={backArrow} />
                </TouchableOpacity>
                <Text style={styles.headerText}>Privacy Policy</Text>
            </View>
            <SvgUri uri={gradientLine} style={styles.gradientLine} />
            <ScrollView  
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContentContainer}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.policyContainer}>
                    <Text style={styles.policy}>
                        <RenderHTML
                            contentWidth={width}
                            source={{ html: privacyPolicyInfo }}
                            tagsStyles={tagsStyles}
                        />
                    </Text>
                </View>
            </ScrollView>
        </ImageBackground>
    );
};

export default PrivacyPolicyScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "flex-start",
    },
    scrollView: {
        flex: 1,
        marginTop: 20,
        width: "100%",
    },
    scrollContentContainer: {
        flexGrow: 1,
        alignItems: "center",
        paddingBottom: 30,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 70,
        marginLeft: 30,
    },
    headerText: {
        marginLeft: 20,
        color: "#FFE600",
        fontSize: 24,
        fontFamily: 'poppins-Medium',
    },
    gradientLine: {
        marginTop: 10,
        alignSelf: "center",
    },
    policyContainer: {
        marginLeft: 20,
        marginRight: 20,
    },
    policy: {
        color: 'white',
        fontSize: 16,
        fontFamily: 'Inter-Regular',
    }
});