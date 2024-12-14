import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TouchableOpacity, TextInput, StyleSheet, FlatList, Image, KeyboardAvoidingView, Platform } from 'react-native';
import axios from 'axios';
import baseUrl from '../../utils/api';
import { cancelGradient, sendGradient } from '../../utils/icons';
import { SvgUri } from "react-native-svg";

const CommentsModal = ({ postId, visible, onClose }) => {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const response = await axios.get(`${baseUrl}/comments/EV/${postId}/`);
                setComments(response.data);
            } catch (error) {
                console.error('Error fetching comments:', error);
            }
        };
    
        if (postId) {
            fetchComments();
        }
    }, [postId]);

    const handleAddComment = async () => {
        try {
            await axios.post(`${baseUrl}/comments/`, {
                postId,
                text: newComment,
            });
            setComments([...comments, { text: newComment, user: { avatar: '', name: 'You' }, timestamp: 'Just now' }]);
            setNewComment('');
        } catch (error) {
            console.error('Error posting comment:', error);
        }
    };

    const renderComment = ({ item }) => (
        <View style={styles.commentContainer}>
            <Image source={{ uri: item.user.avatar }} style={styles.avatar} />
            <View style={styles.commentContent}>
                <Text style={styles.commentUser}>{item.user.name}</Text>
                <Text style={styles.commentText}>{item.text}</Text>
                <Text style={styles.commentTimestamp}>{item.timestamp}</Text>
            </View>
        </View>
    );

    return (
        <Modal visible={visible} animationType="slide" transparent>
            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                <View style={styles.header}>
                    <Text style={styles.headerText}>Comments</Text>
                  
                    <TouchableOpacity onPress={onClose}>
                        <SvgUri uri={cancelGradient} />
                    </TouchableOpacity>
               
                </View>
                <FlatList
                    data={comments}
                    renderItem={renderComment}
                    keyExtractor={(item, index) => index.toString()}
                    contentContainerStyle={styles.commentsContainer}
                />
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        value={newComment}
                        onChangeText={setNewComment}
                        placeholder="Leave comment here"
                    />
                    <TouchableOpacity onPress={handleAddComment} style={styles.sendButton}>
                        <SvgUri uri={sendGradient} />
                    </TouchableOpacity>
                    
                </View>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 16,
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
        maxHeight: '80%',
        flex: 1,  // Ensure it takes up the available space
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    headerText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    commentsContainer: {
        paddingBottom: 8,
    },
    commentContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 8,
    },
    commentContent: {
        flex: 1,
    },
    commentUser: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    commentText: {
        fontSize: 16,
        marginVertical: 4,
    },
    commentTimestamp: {
        fontSize: 12,
        color: 'gray',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: '#ccc',
        paddingTop: 8,
        backgroundColor: 'white', // Ensures the input area has a solid background
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 25,
        padding: 10,
        paddingHorizontal: 16,
        marginRight: 8,
    },
    sendButton: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#FF8D00',
    },
});
  
export default CommentsModal;