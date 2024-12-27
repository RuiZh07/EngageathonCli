//optimze the data format
import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    ImageBackground,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import DiscoverHeader from "../../components/discover/DiscoverHeader";
import DiscoverPost from '../../components/discover/DiscoverPost';
import DiscoverSearchHeader from "../../components/discover/DiscoverSearchHeader";
import DiscoverPeople from "../../components/discover/DiscoverPeople";
import SearchResultPerson from '../../components/discover/SearchResultPerson';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { parseISO } from 'date-fns';
import baseUrl from "../../utils/api";
import apiClient from "../../services/apiClient";

const DiscoverScreen = () => {
    const [isSearching, setSearch] = useState(false);
    const [viewingUser, setViewUser] = useState(false);
    const [token, setToken] = useState(null);
    const [recommendedEvent, setRecommendedEvent] = useState(null);
    const [currentTab, setCurrentTab] = useState('events');
    const [recommendedUser, setRecommendedUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchEvent, setSearchEvent] = useState([]);
    const [searchProfile, setSearchProfile] = useState([]);
    const [searchInput, setSearchInput] = useState('');
    const navigation = useNavigation(); 

    const handleTabChange = (tab) => {
        setCurrentTab(tab);
    };

    useEffect(() => {
        const fetchRecommendedEvent = async () => {
            try {
                const token = await AsyncStorage.getItem("AccessToken");
                if(!token) {
                    console.error("no token found");
                    return;
                }
        
                const response = await apiClient.get(`${baseUrl}/events/recommend/`, {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                    },
                });
        
                setRecommendedEvent(response.data);
            } catch (error) {
                console.error("error to fetch data", error);
            } finally {
                setLoading(false); 
            }
        };
        fetchRecommendedEvent();
    }, []);

    useEffect(() => {
        const fetchRecommendedUser = async () => {
            try {
                const token = await AsyncStorage.getItem("AccessToken");
                if(!token) {
                    console.error("no token found");
                    return;
                }

                const response = await apiClient.get(`${baseUrl}/profiles/recommend/`, {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                    },
                });
    
                setRecommendedUser(response.data);
            } catch (error) {
                console.error("error to fetch recommended users", error);
            } finally {
              setLoading(false); 
            }
        };
          fetchRecommendedUser();
    }, []);

    useEffect(() => {
        const fetchSearchEvent = async () => {
            try {
                const token = await AsyncStorage.getItem("AccessToken");
                if(!token) {
                    console.error("no token found");
                    return;
                }
  
                const response = await apiClient.get(`${baseUrl}/events/search/?`, {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    params: {
                        search: searchInput,
                    }
                });
                setSearchEvent(response.data);
            } catch (error) {
                console.error("error to fetch search event", error);
            }
        };
          fetchSearchEvent();
    }, [searchInput]);
        
    useEffect(() => {
        const fetchSearchProfile = async () => {
            try {
                const token = await AsyncStorage.getItem("AccessToken");
                if(!token) {
                    console.error("no token found");
                    return;
                }

                const response = await apiClient.get(`${baseUrl}/search/profiles/?`, {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    params: {
                        search: searchInput,
                    }
                });
                setSearchProfile(response.data);
            } catch (error) {
                console.error("error to fetch search profile", error);
            }
        };
        fetchSearchProfile();
    }, [searchInput]);
    {/*
    const formatEventDate = (dateString) => {
        try {
            if (!dateString) {
                throw new Error('Date string is undefined or null');
            }
            const date = parseISO(dateString);
        
            if (isNaN(date.getTime())) {
                throw new Error('Invalid date value');
            }
        
            const options = {
                timeZone: 'America/New_York', 
                weekday: 'short', 
                month: 'short', 
                day: 'numeric', 
                hour: 'numeric', 
                minute: 'numeric', 
                hour12: true, 
                timeZoneName: 'short' 
            };
            const formattedDate = date.toLocaleString('en-US', options);
            return formattedDate;
        } catch (error) {
            console.error('Error formatting date:', error.message);
            return 'Invalid date';
        }
    };
*/}
    const handleSearchToggle = () => {
        if (isSearching) {
            setSearchInput('');
        }
        setSearch(!isSearching);
      };
    
    const handleSearchInput = (input) => {
        setSearchInput(input);
    };
    
    const filteredEvent = searchEvent.filter((event) => {
        const eventNameMatch = event.name && event.name.toLowerCase().includes(searchInput.toLowerCase());
        return eventNameMatch;
        }
    );
    const filteredUser = searchProfile.filter((profile) => {
        const usernameMatch = profile.username && profile.username.toLowerCase().includes(searchInput.toLowerCase());
        return usernameMatch;
        }
    );

    const combinedFilteredData = [
        ...filteredUser.map(user => ({ type: 'user', data: user })),
        ...filteredEvent.map(event => ({ type: 'event', data: event }))
    ];

    return (
        <ImageBackground
            source={require("../../assets/main-background.png")}
            style={styles.mainBackground}
        >
            <View style={styles.container}>
                {isSearching ? (
                    <>
                        <DiscoverSearchHeader 
                            onSearchToggle={handleSearchToggle} 
                            onSearchInput={handleSearchInput} 
                        />
                        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                            {searchInput ? (
                                combinedFilteredData.length > 0 ? (
                                    combinedFilteredData.map((item, index) => {
                                        const data = item.data;
                                        if (item.type === 'user') {
                                            return (
                                                <SearchResultPerson 
                                                    key={`${data.username}-${index}`}
                                                    profilePicture={
                                                        data?.profile_photo 
                                                            ? { uri: `data:image/jpeg;base64,${data.image_url}` } 
                                                            : require("../../assets/default_white_profile.png")
                                                    } 
                                                    name={data.username} 
                                                    hasDescription={true} 
                                                    onPress={()=>navigation.navigate('UserProfileScreen', { userID: data.id })}
                                                />
                                            );
                                        }
            
                                        if (item.type === 'event') {
                                            //const formattedDate = formatEventDate(data.datetime_start);
                                            return (
                                                <DiscoverPost 
                                                    key={data.id}
                                                    eventName={data.name}
                                                    profilePicture={
                                                        data?.profile_photo_url 
                                                        ? { uri: `data:image/jpeg;base64,${data.profile_photo_url}` } 
                                                        : require("../../assets/default_profile.png")
                                                    }  
                                                    userID={data.organizer} 
                                                    name={data.username} 
                                                    title={data.event_type}
                                                    description={data.description}
                                                    location={data.location}
                                                    //date={formattedDate}
                                                    coverImageUrl={{ uri: `data:image/jpeg;base64,${data.image_urls[0].image_url}` }}
                                                    isFullView={false}
                                                    onPress={()=>navigation.navigate('DiscoverPostDetailScreen', { event: data })}
                                                    post={data}
                                                />
                                            );
                                        }
                                    })
                                ) : (
                                    <Text style={styles.noResultsText}>No matching users or events found.</Text>
                                )
                            ) : (
                                <Text style={styles.placeholderSearchText}>Start typing to search for users and events...</Text>
                            )}
                        </ScrollView>
                    </>
                ) : (
                <>
                    <DiscoverHeader onSearchToggle={handleSearchToggle}
                        selectedTab={currentTab}
                        onTabChange={handleTabChange} 
                    />
                    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                        {loading ? (
                            <Text style={styles.loadingText}>Loading...</Text>
                        ) : currentTab === 'events' ? ( 
                            recommendedEvent && recommendedEvent.map((event, index) => {
                                //const formattedDate = formatEventDate(event.datetime_start);
                                return (  
                                    <DiscoverPost 
                                        key={event.id}
                                        eventName={event.name}
                                        profilePicture={
                                            event?.profile_photo_url 
                                            ? { uri: `data:image/jpeg;base64,${event.profile_photo_url}` } 
                                            : require("../../assets/default_profile.png")
                                        }  
                                        userID={event.organizer} 
                                        name={event.username} 
                                        title={event.event_type}
                                        description={event.description}
                                        location={event.location}
                                        //date={formattedDate}
                                        coverImageUrl={{ uri: `data:image/jpeg;base64,${event.image_urls[0].image_url}` }}
                                        onPress={()=>navigation.navigate('DiscoverPostDetailScreen', { event })}
                                        post={event}
                                    />
                                );
                            })
                        ) : (
                            Object.entries(recommendedUser ?? {}).map(([category, users], index) => (
                                users.length > 0 && (
                                    <View key={index} style={styles.categorySection}>
                                        <Text style={styles.categoryText}>{category}</Text>
                                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.userScroll}>
                                            {users.map((user, userIndex) => (
                                                <DiscoverPeople
                                                    key={userIndex}
                                                    category={category}
                                                    profilePicture={
                                                        user?.profile_photo_url 
                                                        ? { uri: `data:image/jpeg;base64,${user.profile_photo_url}` } 
                                                        : require("../../assets/default_profile.png")
                                                    } 
                                                    userID={user.owner} 
                                                    name={`${user.first_name} ${user.last_name}`}
                                                    isFullView={false}
                                                    onPress={()=>navigation.navigate('UserProfileScreen', { userID: user.owner })}
                                                />
                                            ))}
                                        </ScrollView>
                                    </View>
                                )
                            ))
                        )}
                    </ScrollView>
                </>
                )}      
            </View>
        </ImageBackground>
    );
};


export default DiscoverScreen;

const styles = StyleSheet.create({
    mainBackground: {
        flex: 1,
        width: "100%",
    },
    container: {
        flex: 1,
        position: "relative",
        paddingTop: "20%",
    },
    text: {
        fontSize: 20,
        fontWeight: "bold",
    },
    discoverContainer: {
        marginBottom: 70,
    },
    post: {
        backgroundColor: "#fff",
        borderRadius: 30,
        paddingHorizontal: 5,
        paddingVertical: 30,
        margin: 20,
    },
    postInteraction: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 25,
        marginBottom: 20,
    },
    description: {
        paddingHorizontal: 25,
        marginBottom: 20,
    },
    descriptionText: {
        fontFamily: "inter",
    },
    userNameText: {
        fontFamily: "poppins-regular",
        fontSize: 17,
        fontWeight: "500",
        lineHeight: 26,
        letterSpacing: 0.4,
        textAlign: "left",
    },
    userDescriptionText: {
        fontFamily: "inter",
        fontSize: 13,
        fontWeight: "400",
        lineHeight: 16,
        letterSpacing: 0,
        textAlign: "left",
        color: "rgba(163, 163, 163, 1);\n",
    },
    categoryText: {
        fontSize: 20,
        color: "white",
        fontFamily: 'poppins-semibold',
        marginLeft: 20,
        marginBottom: 5,
    },
    categorySection: {
        //marginLeft: 20,
    },
    loadingText: {
        textAlign: "center",
        marginTop: 20,
        fontSize: 18,
        color: "#999",
    },
    placeholderSearchText: {
        marginTop: 20,
        textAlign: 'center',
        color: "white",
        fontSize: 18,
    },
    noResultsText: {
        marginTop: 20,
        textAlign: 'center',
        color: "white",
        fontSize: 18,
    }
});
