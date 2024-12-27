import React, { useState } from "react";
import { useRoute } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";
import { View, StyleSheet, Modal, Text, TouchableOpacity } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../screens/home/HomeScreen";
import DiscoverScreen from "../screens/discover/DiscoverScreen";
import ProfileScreen from "../screens/profile/ProfileScreen";
import Home from "./navbar/Home";
import Discover from "./navbar/Discover";
import Post from "./navbar/Post";
import Messages from "./navbar/Messages";
import Profile from "./navbar/Profile";
import Background from "./navbar/Background";
import { createStackNavigator } from '@react-navigation/stack';
import { createEventIcon, createPostIcon } from "../utils/icons";
import { SvgUri } from "react-native-svg";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const Arrow = () => {
    return (
        <View style={styles.arrowContainer}>
            <View style={styles.arrow} />
        </View>
    );
  };

const Tabs = () => {
    const route = useRoute();
    const { userData } = route.params || {};
    const [modalVisible, setModalVisible] = useState(false);
    const navigation = useNavigation();

    const handlePostClick = () => {
        setModalVisible(true);
    };
    
    const navigateToCreatePost = () => {
        setModalVisible(false);
        navigation.navigate('CreatePostScreen');
    };
    
    const navigateToCreateEvent = () => {
        setModalVisible(false);
        navigation.navigate('CreateEventScreen');
    };

    return (
        <View style={styles.container}>
            <Tab.Navigator
                screenOptions={{
                tabBarShowLabel: false,
                tabBarStyle: styles.tabBar,
                tabBarHideOnKeyboard: true,
                headerShown: false,
                }}
            >
            
                <Tab.Screen
                    name="Home"
                    component={HomeScreen}
                    options={{
                        tabBarIcon: ({ focused }) => (
                        <View>
                            <Home selected={focused} />
                            <Background style={styles.background} />
                        </View>
                        ),
                    }}
                />
        
                <Tab.Screen
                    name="Discover"
                    component={DiscoverScreen}
                    options={{
                        tabBarIcon: ({ focused }) => (
                        <View style={styles.tab}>
                            <Discover selected={focused} />
                        </View>
                        ),
                    }}
                />
        
                <Tab.Screen
                    name="Post"
                    options={{
                        tabBarIcon: ({ focused }) => (
                        <TouchableOpacity style={styles.post} onPress={handlePostClick}>
                            <Post selected={focused} />
                        </TouchableOpacity>
                        ),
                    }}
                    >
                    {() => null}
                </Tab.Screen>
        
                <Tab.Screen
                    name="Messages"
                    component={DiscoverScreen}
                    options={{
                        tabBarIcon: ({ focused }) => (
                        <View style={styles.tab}>
                            <Messages selected={focused} />
                        </View>
                        ),
                    }}
                />
        
                <Tab.Screen
                    name="Profile"
                    options={{
                        tabBarIcon: ({ focused }) => (
                        <View style={styles.tab}>
                            <Profile selected={focused} />
                        </View>
                        ),
                    }}
                >
                {() => <ProfileScreen userData={userData} />}
                </Tab.Screen>
            </Tab.Navigator>
        
            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {setModalVisible(!modalVisible); }}
            >
                <TouchableOpacity
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPressOut={() => setModalVisible(false)}
                >
                    <TouchableOpacity style={styles.modalContainer} activeOpacity={1}>
                        <View style={styles.modalView}>
                            <View style={styles.iconContainer}>
                                <TouchableOpacity
                                    style={styles.postButton}
                                    onPress={navigateToCreatePost}
                                >
                                    <SvgUri uri={createPostIcon} />
                                    <Text style={styles.optionText}>Post</Text> 
                                </TouchableOpacity>
                            </View>
            
                            <View style={styles.iconContainer}>
                                <TouchableOpacity
                                    style={styles.eventButton}
                                    onPress={navigateToCreateEvent}
                                >
                                    <SvgUri uri={createEventIcon} />
                                    <Text style={styles.optionText}>Event</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <Arrow />
                    </TouchableOpacity>
                </TouchableOpacity>
            </Modal>
        </View>
    );

};

const styles = StyleSheet.create({
    container: {
        position: "relative",
        flex: 1,
    },
    background: {
        position: "absolute",
        backgroundColor: "transparent",
        left: -21,
        bottom: -180,
        //left: -11,
        //bottom: -20,
    },
    tabBar: {
        position: "absolute",
        borderTopWidth: 0,
        padding: 20,
        backgroundColor: "transparent",
    },
    tab: {
        alignItems: "center",
        justifyContent: "center",
    },
    post: {
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 70,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    modalContainer: {
        alignItems: 'center',
        marginBottom: 110,
    },
    arrowContainer: {
        height: 10,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent',
    },
    arrow: {
        width: 0,
        height: 0,
        borderLeftWidth: 10,
        borderRightWidth: 10,
        borderTopWidth: 10,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderTopColor: 'black',
        alignSelf: 'center',
    },
    modalView: {
        width: 200,
        padding: 10,
        backgroundColor: 'black',
        borderRadius: 10,
        justifyContent: 'space-around',
        flexDirection: 'row',
    },
    iconContainer: {
        borderWidth: 1,
        borderColor: 'orange',
        backgroundColor: 'white',
        borderRadius: 10,
    },
    eventButton: {
        alignItems: 'center',
        paddingVertical: 7,
        paddingHorizontal: 14,
    },
    postButton: {
        alignItems: 'center',
        paddingVertical: 7,
        paddingHorizontal: 15,
    },
    optionText: {
        marginTop: 5,
        fontSize: 10,
        color: 'black',
    },
});
  
export default Tabs;
  