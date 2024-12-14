import React, { useState, useEffect } from "react";
import { SvgUri } from "react-native-svg";
import {
    View,
    Text,
    StyleSheet,
    Image,
    StatusBar,
    TextInput,
} from "react-native";
import { searchIcon } from "../../utils/icons";

const DiscoverSearchHeader = ({onSearchToggle, onSearchInput}) => {
    const handleTextChange = (text) => {
        onSearchInput(text);
    };
  
    return (
        <View style={styles.container}>
            <View style={styles.textContainer}>
            <SvgUri
                onPress={onSearchToggle}
                uri={searchIcon}
                width="30"
                height="30"
                style={styles.searchIcon}
            />
    
            <TextInput 
                style={styles.searchBar}
                placeholder="Search..."
                onChangeText={handleTextChange}
            />
    
            </View>    
            <Text onPress={onSearchToggle} style={styles.cancelText}>Cancel</Text>
        </View>
    );
  };
  
  export default DiscoverSearchHeader;
  
  const styles = StyleSheet.create({
    //Container for entire header
    container: {
        width: "100%",
        justifyContent: "space-between",
        alignItems: 'center',
        paddingBottom: 30,
        paddingHorizontal: 22,
        flexDirection: "row",
    },
    //Container for TextInput + Search Icon
    textContainer: {
        backgroundColor: "#FFF",
        height: 45,
        flex: 1,
        alignItems: 'center',
        flexDirection: 'row',
        marginRight: 10,
        paddingRight: 20,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: "#FF8D00"
    },
    //Icon for Search Bar
    searchIcon: {
        marginLeft: 12,
        marginRight: 10,
    },
    //TextInput for Search Bar
    searchBar: {
        backgroundColor: "#FFF",
        flex: 1,
        height: '100%',
        overflow: "hidden",
        fontFamily: 'inter-medium',
        fontSize: 16,
    },
    cancelText: {
        fontFamily: "inter-medium",
        color: "#F5F4F4",
        fontSize: 14,
    }
});
    