import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ImageBackground, Platform, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { SvgUri } from "react-native-svg";
import { backArrow } from '../../utils/icons';
import baseUrl from "../../utils/api";
import MainButton from '../../components/common/MainButton';
export default function DeleteAccountScreen() {
    const navigation = useNavigation();

    const handleDeleteAccount = async () => {
        try {
            const response = await axios.delete(`${baseUrl}/auth/delete/`);
            if (response.status === 200) {
                Alert.alert('Success', 'Your account has been deleted.', [
                    { text: 'OK', onPress: () => navigation.navigate('Login') },
                ]);
            }
        } catch (error) {
            Alert.alert('Error', 'There was an issue deleting your account. Please try again.');
        }
    };

    return (
        <ImageBackground
            source={require("../../assets/main-background.png")}
            style={styles.backgroundImage}
        >
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => navigation.goBack()}
                    >
                        <SvgUri uri={backArrow} />
                    </TouchableOpacity>
                    <Text style={styles.headerText}>Are you sure you would like to delete your account?</Text>
                </View>
        
                <Text style={styles.infoText}>
                    If you delete your account, all of your posts and interactions will be <Text style={styles.permanentlyText}>permanently</Text> deleted.
                </Text>
        
                <View style={styles.buttonContainer}>
                    <MainButton style={styles.cancelButton} onPress={() => navigation.goBack()} title="Cancel"/>
                    <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteAccount}>
                        <Text style={styles.deleteButtonText}>Delete Account</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    backgroundImage: {
        flex: 1,
        width: '100%',
    },
    container: {
        flex: 1,
        padding: 20,
    },
    backButton: {
        position: 'absolute',
        top: 24,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
        paddingHorizontal: "5%",
        marginTop: "10%",
    },
    headerText: {
        color: "#FFFFFF",
        fontSize: 24,
        marginLeft: '6%',
        marginTop: '5%',
        fontFamily: "Poppins-Medium",
    },
    infoText: {
        fontSize: 20,
        color: '#FFF',
        textAlign: 'left',
        marginBottom: 60,
        marginTop: '20%',
        fontFamily: "Poppins-Medium",
    },
    permanentlyText: {
        color: 'red',
    },
    buttonContainer: {
        flexDirection: 'column',
        alignContent: 'center',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        marginTop: '40%',
    },
    cancelButton: {
        width: "90%",
        marginBottom: '6%',
    },
    cancelButtonText: {
        color: '#FFF',
        fontSize: 16,
        lineHeight: 24,
    },
    deleteButton: {
        backgroundColor: 'grey',
        borderRadius: 10,
        paddingVertical: 15,
        paddingHorizontal: 20,
        alignItems: 'center',
        width: '90%',
    },
    deleteButtonText: {
        color: '#FFF',
        fontSize: 16,
        lineHeight: 24,
        fontFamily: "Poppins-Semibold",
    },
  });