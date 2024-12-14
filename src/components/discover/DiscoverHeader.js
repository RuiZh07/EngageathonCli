import React from "react";
import { SvgUri } from "react-native-svg";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
} from "react-native";
import DiscoverToggleSwitch from './DiscoverToggleSwitch';
import { discoverSelectedIcon } from "../../utils/icons";

const DiscoverHeader = ({ onSearchToggle, selectedTab, onTabChange }) => {
  return (
    <View style={styles.container}>
        <Text style={styles.discoverText}>Discover</Text>
        <DiscoverToggleSwitch 
            selectedTab={selectedTab} 
            onTabChange={onTabChange} 
        />
        <TouchableOpacity onPress={onSearchToggle}>
            <SvgUri
                uri={discoverSelectedIcon}
            />
        </TouchableOpacity>
    </View>
  );
};

export default DiscoverHeader;

const styles = StyleSheet.create({
    container: {
        width: "100%",
        justifyContent: "space-between",
        alignItems: 'center',
        paddingBottom: 20,
        paddingHorizontal: 22,
        flexDirection: "row",
    },
    settingsContainer: {
        flexDirection: "row",
        gap: 5,
    },
    discoverText: {
        color:'#FFE600',
        fontFamily: 'poppins-semibold',
        fontSize: 24,
    }
});
  