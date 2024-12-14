import React from 'react';
import { View, StyleSheet } from 'react-native';

const ProgressBar = ({ stage }) => {
    return (
        <View style={StyleSheet.progressBarContainer}>
            <View style={styles.progressLineContainer}>
                <View style={[styles.progressLine, { width: stage >= 2 ? '50%' : '0%' }]} />
                <View style={[styles.progressLine, { width: stage === 3 ? '50%' : '0%' }]} />
            </View>
            <View style={styles.dotContainer}>
                <View style={[styles.progressDot, stage === 1 && styles.stageOneDot, stage === 2 && styles.stageTwoDot, stage === 3 && styles.stageThreeDot ]} />
            </View>
        </View>
    );
};

export default ProgressBar;

const styles = StyleSheet.create({
    progressBarContainer: {
        flexDirection: 'row',
        marginHorizontal: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    progressLineContainer: {
        width: '90%',
        height: 2,
        backgroundColor: '#FFFFFF',
        marginHorizontal: 20,
        marginVertical: 30,
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'relative',
    },
    progressLine: {
        height: 2,
        backgroundColor: 'orange',
        position: 'absolute',
        left: 0,
        top: 0,
    },
    dotContainer: {
        width: '90%',
        flexDirection: 'row',
        position: 'absolute',
        top: 13,

    },
    progressDot: {
        width: 36,
        height: 36,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: 'grey',
        backgroundColor: '#DADADA',
        position: 'absolute',
    },
    activeDot: {
        backgroundColor: 'orange',
    },
    stageOneDot: {
        left: '5%',
    },
    stageTwoDot: {
        left: '50%',
    },
    stageThreeDot: {
        right: '0%',
    },
})