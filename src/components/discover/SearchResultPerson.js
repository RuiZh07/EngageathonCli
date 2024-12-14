import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    StatusBar,
} from "react-native";

const SearchResultPerson = ({profilePicture, name, description, hasDescription, onPress}) => {
    return (
        <TouchableOpacity onPress={onPress}>
          <View style={styles.container}>
            <View style={styles.postHeader}>
              <Image
                  source={profilePicture}
                  style={styles.pfp}
                />
                <View style={styles.postUser}>
                  <View>
                    <Text style={styles.userNameText}>{name}</Text>
                    {/* 
                    {
                      hasDescription?
                      <Text style={styles.userDescriptionText}>
                        {description}
                      </Text>
                      :undefined
                    }
                    */}
                  </View>
                </View>
              </View>
            </View>
          </TouchableOpacity>
      );
};


export default SearchResultPerson;

const styles = StyleSheet.create({
    container: {
      width: "100%",
      justifyContent: "space-between",
      alignItems: 'center',
      paddingBottom: 20,
      paddingHorizontal: 22,
      flexDirection: "row",
    },
    postHeader: {
      paddingHorizontal: 20,
      flexDirection: "row",
      gap: 10,
      alignItems: "center",
    },
    pfp:{
      width: 38, 
      height: 38, 
      borderRadius: 18,
      borderWidth: 2, 
      borderColor: "#FFFFFF",
      resizeMode: "contain"
    },
    postUser: {
      flexDirection: "row",
      justifyContent: "space-between",
      flex: 1,
    },
    userNameText: {
      color: "#F5F4F4",
      fontFamily: "inter",
      fontSize: 20,
      fontWeight: "500",
      lineHeight: 26,
      letterSpacing: 0.4,
      textAlign: "left",
      paddingLeft: 8,
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
});
  