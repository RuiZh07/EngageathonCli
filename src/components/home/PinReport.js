import React, { useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    Modal, 
    TextInput,
    StyleSheet,
    FlatList,
    TouchableWithoutFeedback,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";

const PinReport = ({ isModalVisible, setModalVisible }) => {
    const [isReportFormVisible, setIsReportFormVisible] = useState(false);
    const [reportReason, setReportReason] = useState("");
    const [customReason, setCustomReason] = useState("");
    const reportOptions = [
        "It's spam",
        "Scam or fraud",
        "Hate speech or symbols",
        "False information",
        "Suicide or self-injury",
        "Bullying or harassment",
        "Intellectural property violation",
        "Violence/Fangerous orgs.",
        "Other",
    ];

    const handleOpenReportForm = () => {
        setModalVisible(false);
        setIsReportFormVisible(true);
    }

    const handleSubmitReason = () => {
        const reasonToSubmit = 
            reportReason === "Other" ? customReason : reportReason;
        console.log("report reason", reasonToSubmit);
        setIsReportFormVisible(false);
        setModalVisible(false);
        setReportReason("");
        setCustomReason("");
        
    };

    const handleCancelReport = () => {
        setIsReportFormVisible(false);
        setModalVisible(false);
        setReportReason("");
        setCustomReason("");
    };

    const handleSelectOption = (item) => {
        if (reportReason === item) {
            setReportReason("");
            setCustomReason("");
        } else {
            setReportReason(item);
            if (item !== "Other") setCustomReason("");
        }
    };

    return (
        <View style={styles.container}>
            <Modal 
                visible={isModalVisible}
                transparent={true} 
                animationType="fade"
            >
                <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
                    <View style={styles.modalOverlay}>
                        <TouchableWithoutFeedback>
                        <View style={styles.mainModalContent}>
                            <TouchableOpacity>
                                <Text style={styles.pinText}>Pin Event</Text>
                            </TouchableOpacity>
                            <View style={styles.separator} />
                            <TouchableOpacity onPress={handleOpenReportForm}>
                                <Text style={styles.pinText}>Report Event</Text>
                            </TouchableOpacity>
                        </View>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>

            {isReportFormVisible && 
                <Modal
                    visible={isReportFormVisible}
                    transparent={true} 
                    animationType="fade"
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <Text style={styles.reportText}>Report This Post</Text>
                            <Text style={styles.helpUsText}>Help us to understand what's{"\n"}happening with this post</Text>
                            <View style={styles.separator} />
                            <View style={styles.flatListContainer}>
                                <FlatList 
                                    data={reportOptions}
                                    keyExtractor={(item) => item}
                                    renderItem={({ item }) => (
                                        <TouchableOpacity 
                                            style={styles.optionButton} 
                                            onPress={() => handleSelectOption(item)}
                                        >   
                                        <View style={styles.optionContainer}>
                                            <View style={[styles.circle,
                                                reportReason === item && styles.selectedCircle]} />
                                            <Text style={styles.optionText}>{item}</Text>
                                        </View>
                                        </TouchableOpacity>
                                    )}
                                />
                            </View>
                            {reportReason === "Other" && (
                                <TextInput
                                    style={styles.textInput}
                                    placeholder="Please specify ... "
                                    value={customReason}
                                    onChangeText={setCustomReason}
                                />
                            )}
                            <View style={styles.buttonContainer}>
                                <TouchableOpacity style={styles.cancelButton} onPress={handleCancelReport}>
                                    <Text style={styles.shareButtonText}>Cancel</Text>
                                </TouchableOpacity>
                                <LinearGradient
                                    colors={["#FF8D00", "#FFBA00", "#FFE600"]}
                                    locations={[0.7204, 0.8602, 1]} 
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    style={styles.shareButtonGradient}
                                >
                                    <TouchableOpacity
                                        style={styles.shareButton}
                                        onPress={handleSubmitReason}
                                        disabled={!reportReason || (reportReason === "Others" && ! customReason)}
                                    >
                                        <Text style={styles.shareButtonText}>Submit</Text>
                                    </TouchableOpacity>
                                </LinearGradient>
                            </View>
                        </View>
                    </View>
                </Modal>
            }
        </View>
    );
}

const styles= StyleSheet.create({
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    mainModalContent: {
        backgroundColor: '#FFFEFE',
        borderRadius: 25,
        borderWidth: 1,
        borderColor: "#FF8D00",
        paddingVertical: 15,
        width: '35%',
    },
    modalContent: {
        backgroundColor: '#FFFEFE',
        borderRadius: 25,
        borderWidth: 1,
        borderColor: "#FF8D00",
        paddingHorizontal: 25,
        paddingVertical: 15,
        width: '75%',
    },
    flatListContainer:{
        maxHeight: 250,
    },
    pinText: {
        fontFamily: "Poppins-medium",
        fontSize: 15,
        textAlign: "center",
    },
    separator: {
        height: 2,
        width: '100%',
        alignSelf: "center",
        backgroundColor: "#EEE7E7",
        marginVertical: 10,
    },
    reportText: {
        color: "#000000",
        fontFamily: "Poppins-Semibold",
        alignSelf: 'center',
        marginBottom: 10,
    },
    helpUsText: {
        color: "#000000",
        fontFamily: "Inter-regular",
        fontSize: 13,
    }, 
    optionContainer: {
        flexDirection: 'row',
    },
    circle: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderColor: "#5A5A5A",
        borderWidth: 3,
        marginRight: 12,
        backgroundColor: "#D9D9D9",
    },
    selectedCircle: {
        backgroundColor: "#FF8D00",
    },
    optionText: {
        fontFamily: "Inter-regular",
        paddingVertical: 4,
    },
    textInput: {
        borderBottomWidth: 2,
        borderRadius: 4,
        borderBottomColor: '#FFB900',
        paddingVertical: 5,
        paddingHorizontal: 5,

    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    cancelButton: {
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 30,
        backgroundColor: '#A3A3A3'
    },
    shareButtonGradient: {
        borderRadius: 30,
    },
    shareButton: {
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 30,
    },
    shareButtonText: {
        color: "#FFFFFF",
        fontSize: 14,
        fontFamily: "Poppins-Regular",
        paddingVertical: 5,
        paddingHorizontal: 25,
    },
})

export default PinReport;