import React, { useEffect, useState } from "react";
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { settingWhiteIcon, myActivityIcon, calendarIcon, qrCodeIcon, analyticsIcon } from "../../utils/icons";
import { SvgUri } from "react-native-svg";

const HamburgerBar = () => {
    const navigation = useNavigation();
    return (
        <View style={styles.container}>
            <TouchableOpacity  style={styles.subContainer} onPress={() => navigation.navigate("SettingScreen")}>
                <SvgUri uri={settingWhiteIcon} />
                <Text style={styles.name}>Settings and Privacy</Text>
            </TouchableOpacity>
            <View style={styles.separator} />

            <TouchableOpacity style={styles.subContainer} onPress={() => navigation.navigate("CalendarScreen")}>
                <SvgUri uri={calendarIcon} />
                <Text style={styles.name}>My Calendar</Text>
            </TouchableOpacity>
            <View style={styles.separator} />

            <TouchableOpacity style={styles.subContainer} onPress={() => navigation.navigate("UpcomingEventScreen")}>
                <SvgUri uri={qrCodeIcon} />
                <Text style={styles.name}>Event QR Codes</Text>
            </TouchableOpacity>
            <View style={styles.separator} />

            <TouchableOpacity style={styles.subContainer} onPress={() => navigation.navigate("")}>
                <SvgUri uri={myActivityIcon} />
                <Text style={styles.name}>Your Activity</Text>
            </TouchableOpacity>
            <View style={styles.separator} />

            <TouchableOpacity style={styles.subContainer} onPress={() => navigation.navigate("")}>
                <SvgUri uri={analyticsIcon} />
                <Text style={styles.name}>Analytics</Text>
            </TouchableOpacity>
            <View style={styles.separator} />
            
        </View>
    );
};

export default HamburgerBar;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: '25%',
        backgroundColor: '#404040',
        borderBottomRightRadius: 40,
        width: "100%",
        zIndex: 9999,
        
        //height: '100%',
    },
    separator: {
        height: 1,
        backgroundColor: "#6C6C6C",
    },
    subContainer: {
        flexDirection: 'row',
        paddingTop: 30,
        paddingBottom: 5,
        paddingHorizontal: 20,
    },
    name: {
        color: "#F5F4F4",
        fontFamily: "Poppins-Medium",
        fontSize: 17,
        paddingLeft: 10,
    }
})