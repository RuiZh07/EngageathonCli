import React from "react";
import { View, TouchableOpacity } from "react-native";
import { SvgUri } from "react-native-svg";
import { toggleEvents, togglePeople } from "../../utils/icons";

const DiscoverToggleSwitch = ({ selectedTab, onTabChange }) => {
    const getSvgUri = () => {
        return selectedTab === 'events' ? toggleEvents : togglePeople;
    };

    return (
        <View style={{ flexDirection: "row" }}>
            <TouchableOpacity
                onPress={() => onTabChange(selectedTab === 'people' ? 'events' : 'people')}
            >
                <SvgUri
                    width="160"
                    height="31"
                    uri={getSvgUri()}
                />
            </TouchableOpacity>
        </View>
      );
};

export default DiscoverToggleSwitch;