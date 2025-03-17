import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ImageBackground, Image } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { useNavigation } from '@react-navigation/native';
import { backArrow } from '../../utils/icons';
import { SvgUri } from "react-native-svg";
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiClient from '../../services/apiClient';
import baseUrl from '../../utils/api';
import moment from 'moment-timezone';

const CalendarScreen = ({ route }) => {
    const navigation = useNavigation();
    const [attendEvents, setAttendEvents] = useState([]);
    const [selectedDate, setSelectedDate] = useState('');
    const [markedDates, setMarkedDates] = useState({});
    const [upcomingEvents, setUpcomingEvents] = useState([]);
    const [calendarData, setCalendarData] = useState([]);
    const today = moment().format('YYYY-MM-DD'); // Current date in YYYY-MM-DD format
    const { post } = route.params || {};

    // Automatically select the current date when navigating to the calendar (in EST)
    useEffect(() => {
        const localDate = moment().format('YYYY-MM-DD');  // Use local timezone
        setSelectedDate(localDate);
    }, []);

    // Fetch the events in the calendar
    useEffect(() => {
        const fetchCalendarEvents = async () => {
            try {
                const token = await AsyncStorage.getItem("AccessToken");
                if(!token) {
                    console.error("no token found");
                    return;
                }

                const response = await apiClient.get(`${baseUrl}/events/calendar/`, {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                    },
                });
                const data = response.data.slice(0,-1);
                setCalendarData(data);

                //markUpcomingEvents();
            } catch (error) {
                console.error('Error to fetch calendar events', error);
            }
        };
        fetchCalendarEvents();
    }, []);
    
    // Add the post to the attendEvents list
    useEffect(() => {
        if (post) {
            handleAddPost(post); 
        }
    }, [post]);

    // Handle adding post to the list
    const handleAddPost = (newPost) => {
        // Check if the newPost exists in calendarData
        const postExistsInCalendarData = calendarData.some(
            (existingEvent) => existingEvent.id === newPost.id
        );
    
        // If it's not in calendarData, check if it's already in attendEvents
        if (!postExistsInCalendarData) {
            const postExistsInAttendEvents = attendEvents.some(
                (existingPost) => existingPost.id === newPost.id
            );
    
            // If it's not in attendEvents, add it to attendEvents
            if (!postExistsInAttendEvents) {
                const updatedAttend = [...attendEvents, newPost];
                setAttendEvents(updatedAttend);
            } else {
                console.log('Post already exists in attendEvents.');
            }
        } else {
            console.log('Post already exists in calendarData.');
        }
    };
    
    // Combine the events in the calendar and attend events
    const combinedEvents = [
        ...attendEvents.filter((event) => !calendarData.some((e) => e.id === event.id)),
        ...calendarData,
    ];


    useEffect(() => {
        markUpcomingEvents();
    }, [selectedDate, attendEvents, calendarData]);

    // Mark events with yellow dots and handle selection
    const markUpcomingEvents = () => {
        let updatedMarkedDates = { ...markedDates };

        // Mark the dates for all upcoming events with a yellow dot
        combinedEvents.forEach(event => {
            console.log("Event datetime_start:", event.datetime_start);
            // Check if datetime_start is a valid string
            if (event.datetime_start && typeof event.datetime_start === 'string') {
                //const eventDate = event.datetime_start.split('T')[0]; // Get the date (YYYY-MM-DD)
                const eventDate = moment(event.datetime_start).local().format('YYYY-MM-DD');  // Use local timezone
                updatedMarkedDates[eventDate] = { marked: true, dotColor: '#FF8D00' };
            }
        });
        
        // If a date is selected, mark it with a yellow circle and remove any previous yellow circle
        if (selectedDate) {
            // Remove previous yellow circle from any other date
            Object.keys(updatedMarkedDates).forEach(date => {
                if (updatedMarkedDates[date].selected) {
                    updatedMarkedDates[date].selected = false;  // Unselect the previous yellow circle
                }
            });

            // Mark the selected date with a yellow circle
            updatedMarkedDates[selectedDate] = {
                selected: true,
                selectedColor: '#FF8D00',
                selectedTextColor: '#FFFFFF',
            };
        }
         // Ensure today's date remains marked with a grey circle (even if the selected date is today)
        const localDate = moment().format('YYYY-MM-DD');
        updatedMarkedDates[localDate] = {
            selected: true,
            selectedColor: '#A9A9A9',
            selectedTextColor: '#FFFFFF',
        };

        // Set the updated marked dates
        setMarkedDates(updatedMarkedDates);
    };

    // Handle day press
    const handleDayPress = (day) => {
        if (day.dateString !== selectedDate) {
            setSelectedDate(day.dateString); // Update the selected date only if it's different
        }
    };

    // Filter out events that are today or in the future
    useEffect(() => {        
        // Remove duplicates using reduce() based on event id
        const uniqueEvents = combinedEvents.reduce((acc, event) => {
            if (!acc.some(e => e.id === event.id)) {
                acc.push(event);
            }
            return acc;
        }, []);
        
        // Filter out events that are today or in the future
        const filteredUpcomingEvents = uniqueEvents.filter(event => {
            const eventDate = event.datetime_start ? event.datetime_start.split('T')[0] : ''; 
            const eventDateLocal = moment.utc(eventDate).local().startOf('day');  // Convert to local timezone
            const todayLocal = moment().local().startOf('day'); 
            return eventDateLocal.isSameOrAfter(todayLocal); 
        });
        
        
        // Set the filtered upcoming events
        setUpcomingEvents(filteredUpcomingEvents);
        console.log(filteredUpcomingEvents);
    }, [attendEvents, calendarData, selectedDate]);
    
    
    const handleEventPress = (event) => {
        navigation.navigate('QRCodeScreen', { event });
    };
    
    // Filter events based on selected date
    const filteredEvents = combinedEvents.filter(event => {
        const eventDateLocal = moment.utc(event.datetime_start).local().format('YYYY-MM-DD');
        const selectedDateLocal = moment(selectedDate).local().format('YYYY-MM-DD');
        return eventDateLocal === selectedDateLocal;
    });
    
    
    let date = moment().format('MM/DD/YYYY');

    return (
        <ImageBackground source={require("../../assets/main-background.png")} style={styles.backgroundImage}>
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                <SvgUri uri={backArrow} />
                </TouchableOpacity>
                <Text style={styles.headerText}>Calendar</Text>
            </View>
            <View style={styles.container}>
                <Calendar
                    onDayPress={handleDayPress}
                    markedDates={markedDates}
                    theme={{
                        backgroundColor: 'transparent',
                        calendarBackground: 'transparent',
                        textSectionTitleColor: '#FFFFFF',
                        dayTextColor: '#FFFFFF',
                       // todayTextColor: '#FFE600',
                        todayTextColor: '#FFFFFF',
                        selectedDayBackgroundColor: '#FF8D00',
                        selectedDayTextColor: '#FFFFFF',
                        arrowColor: '#FFFFFF',
                        monthTextColor: '#FFFFFF',
                        textDayFontWeight: '300',
                        textMonthFontWeight: 'bold',
                        textDayHeaderFontWeight: '500',
                        textDayFontSize: 16,
                        textMonthFontSize: 16,
                        textDayHeaderFontSize: 14
                    }}
                />
                <Text style={styles.todayText}>Today: {date}</Text>
                {selectedDate === today ? (
                    // If today's date is selected, show today's events and upcoming events
                    upcomingEvents.length > 0 ? (
                        <>
                            <Text style={styles.upcomingEvents}>Upcoming Events</Text>
                            <FlatList
                                data={upcomingEvents}
                                keyExtractor={(item) => item.id.toString()}
                                renderItem={({ item }) => (
                                    <TouchableOpacity onPress={() => handleEventPress(item)}>
                                        <View style={styles.eventItem}>
                                            <View style={styles.circle}>
                                                <Image
                                                    source={item?.profile_photo_url ? { uri: item.profile_photo_url } : require("../../assets/default_white_profile.png")}
                                                    style={styles.pfp}
                                                />
                                            </View>
                                            <View style={styles.eventNameContainer}>
                                                <Text style={styles.eventName}>{item.name}</Text>
                                                <Text style={styles.userName}>{item.username}</Text> 
                                            </View>
                                                
                                            <View style={styles.dateTimeContainer}>
                                                <Text style={styles.eventDate}>
                                                    {moment(item.datetime_start).local().format('MM/DD/YYYY')}
                                                </Text>
                                                <Text style={styles.eventTime}>
                                                    {moment(item.datetime_start).local().format('h:mmA z')}
                                                </Text>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                )}
                                ListEmptyComponent={<Text style={styles.noEvents}>No upcoming events for today</Text>}
                            />
                        </>
                    ) : (
                        <Text style={styles.noUpcomingEvents}>No upcoming events for today</Text>
                    )
                ) : (
                    // If a specific date is selected (not today), show events for that date only
                    filteredEvents.length > 0 ? (
                        <FlatList
                            data={filteredEvents}
                            keyExtractor={(item) => item.id ? item.id.toString() : 'defaultKey'}
                            renderItem={({ item }) => (
                                <TouchableOpacity onPress={() => handleEventPress(item)}>
                                    <View style={styles.eventItem}>
                                            <View style={styles.circle}>
                                                <Image
                                                    source={item?.profile_photo_url ? { uri: item.profile_photo_url } : require("../../assets/default_white_profile.png")}
                                                    style={styles.pfp}
                                                />
                                            </View>
                                            <View style={styles.eventNameContainer}>
                                                <Text style={styles.eventName}>{item.name}</Text>
                                                <Text style={styles.userName}>{item.username}</Text> 
                                            </View>
                                                
                                            <View style={styles.dateTimeContainer}>
                                                <Text style={styles.eventDate}>
                                                    {moment(item.datetime_start).local().format('MM/DD/YYYY')}
                                                </Text>
                                                <Text style={styles.eventTime}>
                                                    {moment(item.datetime_start).local().format('h:mmA z')}
                                                </Text>
                                            </View>
                                        </View>
                                </TouchableOpacity>
                            )}
                            ListEmptyComponent={<Text style={styles.noEvents}>No events for selected date</Text>}
                        />
                    ) : (
                        <Text style={styles.noUpcomingEvents}>No events for selected date</Text>
                    )
                )}

            </View>
        </ImageBackground>
    );
};
    
const styles = StyleSheet.create({
    backgroundImage: {
        flex: 1,
        width: '100%',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        paddingHorizontal: '5%',
        marginTop: Platform.OS === "android" ? "8%": "20%",
    },
    backButton: {
        marginTop: '-1%',
    },
    headerText: {
        color: '#FFE600',
        fontSize: 32,
        position: 'absolute',
        left: '15%', // Adjusted based on your preference
    },
    container: {
        flex: 1,
        padding: 10,
    },
    todayText: {
        color: '#FFE600',
        fontSize: 22,
        marginVertical: 10,
        left: '6%',
        fontFamily: "Poppins-Medium",
    },
    eventItem: {
        //backgroundColor: '#1f1f1e',
        backgroundColor: 'white',
        padding: 10,
        marginVertical: 4,
        marginHorizontal: 16,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#FF8D00',
        flexDirection: 'row',
    },
    eventName: {
        fontSize: 15,
        fontFamily: 'Poppins-Medium',
        //color: '#FFE600',
        color: 'black',
        paddingBottom: 1,
    },
    userName: {
        fontSize: 14,
        fontFamily: 'Poppins-Regular',
        //color: '#FFE600',
        color: 'black',
    },
    eventDate: {
        fontSize: 14,
        //color: '#F5F4F4',
        color: 'black',
        paddingBottom: 3,
    },
    noEvents: {
        fontSize: 17,
        color: '#F5F4F4',
        textAlign: 'center',
        marginVertical: 20,
        fontFamily: "Inter-Medium",
    },
    noUpcomingEvents: {
        fontSize: 17,
        color: '#F5F4F4',
        textAlign: 'center',
        marginVertical: 20,
        fontFamily: "Inter-Medium",
    },
    upcomingEvents: {
        fontSize: 17,
        color: '#F5F4F4',
        textAlign: 'left',
        fontFamily: "Inter-Medium",
        marginLeft: 20,
        marginTop: 15,
        marginBottom: 5,
    },
    circle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: "#2BAB47", // Set border color to green
        alignItems: "center",
        justifyContent: "center",
        position: 'relative',
        paddingHorizontal: 2,
        paddingVertical: 2,
    },
    pfp: {
        width: '100%', 
        height: '100%', 
        borderRadius: 20, 
        resizeMode: 'cover',
        borderWidth: 1,
        borderColor: '#2BAB47',
    },
    eventNameContainer: {
        marginLeft: 10,
    },
    dateTimeContainer: {
        marginLeft:'auto',
        alignItems: 'center',
    },
});

    
export default CalendarScreen;