import React, { useState, useEffect, memo } from "react";
import { TouchableOpacity, 
    View, 
    Image, 
    Modal, 
    StyleSheet, 
    TextInput, 
    Text,
    ScrollView,
    Linking,
    FlatList,
    Keyboard,
    Platform,
    Alert,
} from "react-native";
import { SvgUri } from "react-native-svg";
import LinearGradient from "react-native-linear-gradient";
import { magnifyingGlassIcon, shareInstagram, shareLink, shareWhatsApp, shareMessage } from "../../utils/icons";
import baseUrl from "../../utils/api";
import axios from 'axios';
import { useNavigation } from "@react-navigation/native";

const IconWithText = ({ icon, name, onPress }) => (
    <TouchableOpacity onPress={onPress} style={styles.iconContainer}>
        {icon}
        <Text style={styles.iconName}>{name}</Text>
    </TouchableOpacity>
);

const copyToClipboard = async (link) => {
    try {
        await Clipboard.setStringAsync(link);
        
        if (Platform.OS === 'android') {
            ToastAndroid.show('Link copied to clipboard!', ToastAndroid.SHORT);
        } else {
            Alert.alert('Link copied', 'Link copied to clipboard!');
        }
    } catch (error) {
        console.error('Failed to copy link:', error);
    }
  };
const ShareModal = memo(({ isVisible, onClose, link }) => {
    const [dropdownData, setDropdownData] = useState([]);
    const [searchQuery, setSearchQuery] = useState(''); 
    const [userInfo, setUserInfo] = useState([]);
    const [noUsersFound, setNoUsersFound] = useState(false);
    const navigation = useNavigation();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = await AsyncStorage.getItem('AccessToken');
                if (!token) {
                    console.error('No token found');
                    return;
                };

                const response = await axios.get(`${baseUrl}/search/profiles/?${searchParams}`, {
                    headers: {
                        "Authorization": `Token ${token}`,
                        'Content-Type': 'application/json',
                    },
                    params: {
                        search: 'r'
                    }
                });
        
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                };
        
                const userInfo = await response.json();
                setUserInfo(userInfo);
            } catch (error) {
                console.log("Error fetching user data", error);
            }
        };
        fetchUserData();
        }
    );

    useEffect(() => {
        const updateDropdownData = () => {
            const lowercasedQuery = searchQuery.toLowerCase();
            const filteredUsers = userInfo.filter(user => 
                user.first_name.toLowerCase().includes(lowercasedQuery),
                user.last_name.toLowerCase().includes(lowercasedQuery)
            );

            let mappedData;

            if (searchQuery) {
                mappedData = filteredUsers.map(user => ({
                    label: `${user.first_name} ${user.last_name}`,
                    value: user.id,
                }))

                if (mappedData.length === 0) {
                    setNoUsersFound(true)
                } else {
                    setNoUsersFound(false);
                }
            } else {
                mappedData = userInfo.slice(0, 4).map(user => ({
                    label: `${user.first_name} ${user.last_name}`,
                    value: user.id,
                }));
                setNoUsersFound(false);
            }
            setDropdownData(mappedData);
        }; 

        if (userInfo.length > 0) {
            updateDropdownData();
        }
    }, [searchQuery, userInfo]);

    const renderUserItem = ({ item }) => {
        const fullUser = userInfo.find(user => user.id === item.value);
        return (
            <TouchableOpacity style={styles.itemContainer}>
                <Image
                    source={fullUser?.profile_photo ? { uri: `data:image/jpeg;base64,${fullUser.image_url}` } : require("../../assets/default_profile.png")}
                    style={styles.profileImage}
                />
                <Text style={styles.userName}>{item.label}</Text>
            </TouchableOpacity>
        )
    };
    const keyExtractor = (item) => {
        return item.value.toString(); 
      };

    const shareOnWhatsApp = () => {
        if (link) {
          const message = `Check out this event: ${link}`;
          Linking.openURL(`whatsapp://send?text=${encodeURIComponent(message)}`)
            .catch(err => console.error("Failed to open WhatsApp:", err));
        }
    };
    
    const shareOnInstagram = () => {
        if (link) {
          const message = `Check out this event: ${link}`;
          Linking.openURL(`instagram://app?${encodeURIComponent(message)}`)
            .catch(err => console.error("Failed to open Instagram:", err));
        }
    };
    
    const shareOnMessages = () => {
        if (link) {
          const message = `Check out this event: ${link}`;
          Linking.openURL(`sms:?body=${encodeURIComponent(message)}`)
            .catch(err => console.error("Failed to open Messages:", err));
        }
    };

    return (
        <View style={StyleSheet.container}>
            <Modal
                animationType="slide"
                visible={isVisible}
                onRequestClose={() => {
                    onClose();
                }}
                transparent={true}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                    <View style={styles.searchBar}>
                        <SvgUri
                        style={styles.searchIcon}
                        uri={magnifyingGlassIcon}/>

                        <LinearGradient
                            colors={["#FF8D00", "#FFE600"]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.gradientBorder}
                        >
                        <View style={styles.innerContainer}> 
                            <TextInput style={styles.searchInput}
                                    value={searchQuery}
                                    onChangeText={setSearchQuery} />
                        </View>
                        </LinearGradient>

                        <TouchableOpacity onPress={() => {
                        
                        onClose(); 
                        }}>
                        <Text style={styles.cancelButton}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                        
                    <FlatList
                        data={dropdownData}
                        keyExtractor={keyExtractor}
                        renderItem={renderUserItem}
                        style={styles.userList}
                        ItemSeparatorComponent={() => <View style={styles.separator} />}
                        contentContainerStyle={styles.listContainer} 
                    />
                    
                    <View style={styles.separator} />
                    <View style={styles.iconsContainer}>
                    <IconWithText 
                        icon={<Image 
                            source={require("../../assets/icons/ShareLinkPng.png")} 
                        />} 
                        name="Copy Link" 
                        onPress={() => copyToClipboard(link)} 
                    />
                        <IconWithText icon={
                            <Image 
                                source={require("../../assets/icons/ShareWhatsAppPng.png")} 
                            />
                        } name="WhatsApp" onPress={shareOnWhatsApp}/>
                        <IconWithText icon={<Image 
                                source={require("../../assets/icons/ShareInstagramPng.png")} 
                            />} name="Feed" onPress={shareOnInstagram}/>
                        <IconWithText icon={<Image 
                                source={require("../../assets/icons/ShareMessagePng.png")} 
                            />} name="Messages" onPress={shareOnMessages} />
                    </View>
                </View>
            </View>
        </Modal>
    </View>
    )
});

export default ShareModal;



const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    modalOverlay: {
      flex: 1,
      justifyContent: 'flex-end',
      backgroundColor: "transparent",
    },
    modalContainer: {
      width: '100%',
      height: '65%',
      backgroundColor: 'white',
      borderTopLeftRadius: 60,
      borderTopRightRadius: 60,
      padding: 40,
      paddingTop: 40,
    },
    searchBar: {
      flexDirection: 'row',
    },
    searchIcon: {
      width: 20,
      height: 20,
      position: "absolute",
      left: 10,
      top: "45%",
      transform: [{ translateY: -9 }], 
      zIndex: 10,
    },
    gradientBorder: {
      borderRadius: 50,
      padding: 2,
      width: '84%',
      height: 32,
    },
    innerContainer: {
      borderRadius: 50,
      backgroundColor: 'white',
    },
    searchInput: {
      width: "100%",
      height: 28,
      fontSize: 15,
      paddingVertical: 3,
      paddingLeft: 35,
      borderRadius: 50,
      padding: 10,
      borderWidth: 0,
    },
    cancelButton: {
      padding: 10,
      paddingTop: 5,
      color: 'grey',
      fontSize: 16,
    },
    userList: {
      flex: 1,
      paddingTop: 20,
    },
    userItem: {
      margin: 5, // Space between items
      borderRadius: 8,
    },
    userName: {
      //fontWeight: 'bold',
      fontFamily: "PoppinsRegular",
      fontStyle: "normal",
      fontWeight: "400",
      fontSize: 18,
      paddingLeft: 20,
      paddingTop: 10,
    },
    separator: {
      height: 1,
      backgroundColor: "#ddd",
      marginVertical: 10,
    },
    listContainer: {
      flexGrow: 1,
    },
    iconsContainer: {
      marginTop: 20,
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItem: 'center',
    },
    iconContainer: {
      alignItems: 'center',
    },
    icon: {
      padding: 10,
      borderRadius: 50,
      alignItems: 'center',
      justifyContent: 'center',
    },
    iconName: {
      marginTop: 5,
      fontSize: 12,
      color: 'black',
    },
    itemContainer: {
      flexDirection: 'row',
      paddingVertical: 5,
    },
    profileImage: {
      width: 50, 
      height: 50, 
      resizeMode: "cover",
      marginVertical: 1,
      borderRadius: 10,
      borderColor: 'black',
      borderWidth: 2,
    },
  
  })
  
  