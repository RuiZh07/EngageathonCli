//optimze the data format
import React, { useEffect, useState, useCallback } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    ImageBackground,
    RefreshControl,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import DiscoverHeader from "../../components/discover/DiscoverHeader";
import DiscoverPost from '../../components/discover/DiscoverPost';
import DiscoverSearchHeader from "../../components/discover/DiscoverSearchHeader";
import DiscoverPeople from "../../components/discover/DiscoverPeople";
import SearchResultPerson from '../../components/discover/SearchResultPerson';
import AsyncStorage from '@react-native-async-storage/async-storage';
import baseUrl from "../../utils/api";
import apiClient from "../../services/apiClient";
import moment from 'moment-timezone';

const DiscoverScreen = () => {
    const [isSearching, setSearch] = useState(false);
    const [recommendedEvent, setRecommendedEvent] = useState(null);
    const [currentTab, setCurrentTab] = useState('events');
    const [recommendedUser, setRecommendedUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchEvent, setSearchEvent] = useState([]);
    const [searchProfile, setSearchProfile] = useState([]);
    const [searchInput, setSearchInput] = useState('');
    const navigation = useNavigation(); 

    // Handle tab change events or people
    const handleTabChange = (tab) => {
        setCurrentTab(tab);
    };

    // Fetch recommended events data
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

    // Fetch recommended users data
  
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
  

    // Fetch search results for events based on the search input
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
    }, [searchInput]); // This hook runs whenever `searchInput` changes
        
    // Fetch search results for profiles based on the search input
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

    useEffect(() => {
        fetchRecommendedEvent(); 
    }, []);
    
    useEffect(() => {
        fetchRecommendedUser();
    }, []);

    // Handle search toggle: switches between searching or not
    const handleSearchToggle = () => {
        if (isSearching) {
            // If already searching, clear the search input
            setSearchInput('');
        }
        setSearch(!isSearching);
      };
    
    const handleSearchInput = (input) => {
        setSearchInput(input);
    };
    
    // Filter events based on the search input
    const filteredEvent = searchEvent.filter((event) => {
        const eventNameMatch = event.name && event.name.toLowerCase().includes(searchInput.toLowerCase());
        return eventNameMatch;
        }
    );

    // Filter profiles based on the search input
    const filteredUser = searchProfile.filter((profile) => {
        const usernameMatch = profile.username && profile.username.toLowerCase().includes(searchInput.toLowerCase());
        return usernameMatch;
        }
    );

    // Combine filtered events and users into a single array
    const combinedFilteredData = [
        ...filteredUser.map(user => ({ type: 'user', data: user })),
        ...filteredEvent.map(event => ({ type: 'event', data: event }))
    ];

    // Handle pull-to-refresh
    const handleRefresh = useCallback(() => {
        setLoading(true);
        fetchRecommendedEvent(); 
        fetchRecommendedUser();
    }, []);

    useEffect(() => {
        //setLoading(true);  
        fetchRecommendedEvent();
        fetchRecommendedUser();
    }, []);

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
                        <ScrollView contentContainerStyle={{ flexGrow: 1 }} refreshControl={
                            <RefreshControl
                                refreshing={loading} 
                                onRefresh={handleRefresh}
                                colors={['#ffffff']}
                                tintColor="#ffffff"
                            />
                        }>
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
                                                            ? { uri: data.image_url } 
                                                            : require("../../assets/default_white_profile.png")
                                                    } 
                                                    name={data.username} 
                                                    hasDescription={true} 
                                                    onPress={()=>navigation.navigate('UserProfileScreen', { userID: data.id })}
                                                />
                                            );
                                        }
            
                                        if (item.type === 'event') {
                                            return (
                                                <DiscoverPost 
                                                    key={data.id}
                                                    eventName={data.name}
                                                    profilePicture={
                                                        data?.profile_photo_url 
                                                        ? { uri: data.profile_photo_url } 
                                                        : require("../../assets/default_profile.png")
                                                    }  
                                                    userID={data.organizer} 
                                                    name={data.username} 
                                                    title={data.event_type}
                                                    description={data.description}
                                                    location={data.location}
                                                    date={moment(data.datetime_start)
                                                        .local()
                                                        .format('MM/DD/YYYY h:mmA') + ' ' + moment().format('z')}
                                                    coverImageUrl={{ uri: data.image_urls[0]?.image_url || "/mnt/data/Media (7).jpg" }}
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
                   
                        {loading ? (
                            <Text style={styles.loadingText}>Loading...</Text>
                        ) : (  
                            <ScrollView contentContainerStyle={{ flexGrow: 1 }} refreshControl={
                                <RefreshControl
                                    refreshing={loading} 
                                    onRefresh={handleRefresh}
                                    tintColor="#ffffff"
                                    colors={['#ffffff']}
                                />
                            }>
                                {currentTab === 'events' ? ( 
                                    recommendedEvent && recommendedEvent.length > 0 ? 
                                        (recommendedEvent.map((event, index) => {
                                            return (  
                                                <DiscoverPost 
                                                    key={event.id}
                                                    eventName={event.name}
                                                    profilePicture={
                                                        event?.profile_photo_url 
                                                        ? { uri: event.profile_photo_url } 
                                                        : require("../../assets/default_profile.png")
                                                    }  
                                                    userID={event.organizer} 
                                                    name={event.username} 
                                                    title={event.event_type}
                                                    description={event.description}
                                                    location={event.location}
                                                    date={moment(event.datetime_start)
                                                        .local()
                                                        .format('MM/DD/YYYY h:mmA') + ' ' + moment().format('z')}
                                                    coverImageUrl={{ uri: event.image_urls[0]?.image_url || "/mnt/data/Media (7).jpg" }}
                                                    onPress={()=>navigation.navigate('DiscoverPostDetailScreen', { event })}
                                                    post={event}
                                                />
                                            );
                                        })
                                    ) : (
                                        <Text style={styles.noResultsText}>No recommended events found.</Text>
                                    )
                                ) : (
                                    Object.entries(recommendedUser ?? {}).length > 0 ? (
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
                                                                ? { uri: user.profile_photo_url } 
                                                                : require("../../assets/default_profile.png")
                                                            } 
                                                            userID={user.owner} 
                                                            name={`${user.first_name} ${user.last_name}`}
                                                            isFullView={false}
                                                            onPress={()=>navigation.navigate('UserProfileScreen', { userID: user.owner })}
                                                            followingStatus={user.followed} 
                                                            requestStatus={user.is_request}
                                                            privateAccount={user.private}
                                                        />
                                                    ))}
                                                </ScrollView>
                                            </View>
                                        )
                                    ))
                                ) : (
                                    <Text style={styles.noResultsText}>No recommended users found.</Text>
                                )
                            )}
                        </ScrollView>
                        )}
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
        flexGrow: 1,
        position: "relative",
        paddingTop: "20%",
        paddingBottom: 150,
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
