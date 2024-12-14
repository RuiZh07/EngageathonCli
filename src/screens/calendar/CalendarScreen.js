//need to fix
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ImageBackground } from 'react-native';
import { Calendar } from 'react-native-calendars';
import homeService from '../../services/homeService';
import { useNavigation } from '@react-navigation/native';
import { Platform } from "react-native";
import moment from 'moment';
import { backArrow } from '../../utils/icons';
import { SvgUri } from "react-native-svg";

const CalendarScreen = () => {
    const navigation = useNavigation();
    const [events, setEvents] = useState([]);
    const [selectedDate, setSelectedDate] = useState('');
    const [markedDates, setMarkedDates] = useState({});
    const today = new Date().toISOString().split('T')[0]; // Current date in YYYY-MM-DD format

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const response = await homeService.getUserEvents();
            console.log('eventcal', response);
        
            const eventsData = response.data;
            setEvents(eventsData);
        
            // Create the markedDates object with full-day highlight for event dates
            const dates = eventsData.reduce((acc, event) => {
                const date = event.datetime_start.split('T')[0]; // Use UTC date directly
                acc[date] = { marked: true, dotColor: '#FF8D00', selected: true, selectedColor: '#FF8D00' };
                return acc;
            }, {});
        
            // Highlight selected date
            if (selectedDate && !dates[selectedDate]) {
                dates[selectedDate] = { selected: true, selectedColor: '#FF8D00' };
            }
        
            // Highlight today's date in grey color
            dates[today] = { selected: true, selectedColor: '#A9A9A9', selectedTextColor: '#FFFFFF' };
        
            setMarkedDates(dates);
        } catch (error) {
            console.error('Error fetching events:', error);
        }
    };
    
    useEffect(() => {
        if (selectedDate) {
            fetchEvents();
        }
    }, [selectedDate]);
    
    const handleDayPress = (day) => {
        setSelectedDate(day.dateString);
    };
    
    const handleEventPress = (event) => {
        console.log('Navigating to QRCodeScreen with event:', event);
        navigation.navigate('QRCodeScreen', { event });
    };
    
    const filteredEvents = events.filter(event => {
        const eventDate = event.datetime_start.split('T')[0]; // Compare using UTC date
        return eventDate === selectedDate;
    });
    
    const upcomingEvents = events.filter(event => {
        const eventDate = event.datetime_start.split('T')[0];
        return new Date(eventDate) >= new Date(today);
    });
    
    let date = moment(new Date()).format('MM/DD/YYYY');

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
                        todayTextColor: '#FFE600',
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
                {selectedDate ? (
                filteredEvents.length > 0 ? (
                    <FlatList
                    data={filteredEvents}
                    keyExtractor={(item) => item.event.toString()}
                    renderItem={({ item }) => (
                        <TouchableOpacity onPress={() => handleEventPress(item)}>
                        <View style={styles.eventItem}>
                            <Text style={styles.eventName}>{item.name}</Text>
                            <Text style={styles.eventDate}>
                            {new Date(item.datetime_start).toLocaleString('en-GB', { timeZone: 'UTC' })}
                            </Text>
                        </View>
                        </TouchableOpacity>
                    )}
                    ListEmptyComponent={<Text style={styles.noEvents}>No events for selected date</Text>}
                    />
                ) : (
                    <Text style={styles.noUpcomingEvents}>No events for selected date</Text>
                )
                ) : (
                upcomingEvents.length > 0 ? (
                    <FlatList
                    data={upcomingEvents}
                    keyExtractor={(item) => item.event.toString()}
                    renderItem={({ item }) => (
                        <TouchableOpacity onPress={() => handleEventPress(item)}>
                        <View style={styles.eventItem}>
                            <Text style={styles.eventName}>{item.name}</Text>
                            <Text style={styles.eventDate}>
                            {new Date(item.datetime_start).toLocaleString('en-GB', { timeZone: 'UTC' })}
                            </Text>
                        </View>
                        </TouchableOpacity>
                    )}
                    ListEmptyComponent={<Text style={styles.noEvents}>No events for selected date</Text>}
                    />
                ) : (
                    <Text style={styles.noUpcomingEvents}>No upcoming events</Text>
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
        marginTop: '20%',
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
        backgroundColor: '#1f1f1e',
        padding: 15,
        marginVertical: 5,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#FF8D00',
    },
    eventName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FFE600',
    },
    eventDate: {
        fontSize: 14,
        color: '#F5F4F4',
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
});
    
export default CalendarScreen;