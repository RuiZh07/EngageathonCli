import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { cancelGradient } from '../../utils/icons';
import { SvgUri } from "react-native-svg";

const FilterDropdown = ({ selectedFilters, onToggleFilter, onClose }) => {
    return (
        <View style={styles.dropdownContainer}>
            {/* Close Button */}
            <TouchableOpacity 
                style={styles.closeButton}
                onPress={onClose}
            >
                <View style={styles.circle}>
                    <SvgUri uri={cancelGradient} width={14} />
                </View>
            </TouchableOpacity>
            
            {/* Option for Events */}
            <TouchableOpacity 
                style={styles.option}
                onPress={() => { onToggleFilter("events"); }}
            >
                <View style={styles.checkboxContainer}>
                {selectedFilters.includes("events") && <View style={styles.checkedBox} />}
                </View>
                <Text style={styles.optionText}>Events</Text>
            </TouchableOpacity>
            
            {/* Option for Posts */}
            <TouchableOpacity 
                style={styles.optionOne}
                onPress={() => { onToggleFilter("posts"); }}
            >
                <View style={styles.checkboxContainer}>
                {selectedFilters.includes("posts") && <View style={styles.checkedBox} />}
                </View>
                <Text style={styles.optionText}>Posts</Text>
            </TouchableOpacity>
        </View>
      );
};
    
const styles = StyleSheet.create({
    dropdownContainer: {
        position: 'absolute',
        top: 70,
        right: 20,
        backgroundColor: '#fff',
        borderRadius: 15,
        borderWidth: 2,
        borderColor: '#FF8D00',
        padding: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        width: 150, // Increased width to accommodate the close button
        zIndex: 1000,

    },
    closeButton: {
        position: 'absolute',
        top: -2,
        right: -3, // Position the button in the upper right corner
        padding: 10,
        zIndex: 10,
      
    },
    /*
    circle: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: '#FF8D00',
        borderWidth: 1,
    },
   */
    option: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 15,
        marginTop: 10, // Add margin to avoid overlap with the close button
       
    },
    optionOne: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 15,
        
    },
    checkboxContainer: {
        width: 16,
        height: 16,
        borderWidth: 2,
        borderColor: '#FF8D00',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    checkedBox: {
        width: 11,
        height: 11,
        backgroundColor: '#FF8D00',
    },
    optionText: {
        fontSize: 13,
        fontWeight: 'bold',
        color: '#333',
    },
});
    
export default FilterDropdown;