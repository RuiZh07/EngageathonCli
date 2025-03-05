import React, { useState, useEffect, useCallback } from 'react';
import { 
    Modal, 
    View, 
    Text, 
    TouchableOpacity, 
    TextInput,
    StyleSheet, 
    FlatList, 
    Image, 
    KeyboardAvoidingView, 
    Platform,
    ActivityIndicator
 } from 'react-native';
import baseUrl from '../../utils/api';
import { cancelGradient, sendGradient } from '../../utils/icons';
import { SvgUri } from "react-native-svg";
import apiClient from '../../services/apiClient';

const CommentsModal = ({ post, visible, onClose }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');

    // Function to format time
    const formatTimestamp = (timestamp) => {
        const now = new Date();
        const createdAt = new Date(timestamp);

        const diffInSeconds = Math.floor((now - createdAt) / 1000); 
        const diffInMinutes = Math.floor(diffInSeconds / 60); 
        const diffInHours = Math.floor(diffInMinutes / 60); 
        const diffInDays = Math.floor(diffInHours / 24); 

        if (diffInSeconds < 60) {
            return 'Just now';
        } else if (diffInMinutes < 60) {
            return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
        } else if (diffInHours < 24) {
            return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
        } else if (diffInDays < 7) {
            return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
        } else {
            return createdAt.toLocaleDateString(); 
        }
    };

    const fetchComments = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await apiClient.get(`${baseUrl}/comments/EV/${post.id}/`);

            const transformedComments = response.data.map(comment => {
                return {
                    text: comment?.content,  
                    user: {
                        avatar: `data:image/jpeg;base64, ${comment?.profilephoto_url}`,
                        name: comment?.user,
                    },
                    timestamp: formatTimestamp(comment?.created_at),
                };
            });
    
            setComments(transformedComments);
        } catch (error) {
            console.error('Error fetching comments:', error);
        } finally {
            setIsLoading(false);
        }
    }, [post.id]);

    useEffect(() => {
        if (post.id) {
            fetchComments();
        }
    }, [post.id, fetchComments]);

    // Handle add new comments
    const handleAddComment = async () => {
        try {
            await apiClient.post(`${baseUrl}/comments/`, {
                content: newComment,
                content_type: 'EV',
                content_object_id: post.id,
            });

            const newComentObj = {
                text: newComment,
                user: { avatar: post.profile_photo_url, name: post.username },
                timestamp: formatTimestamp(new Date().toISOString()),
            };

            setComments((prevComments) => [newComentObj, ...prevComments, ]);
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
                <Text style={styles.commentTimestamp}>{item.timestamp}</Text>
                <Text style={styles.commentText}>{item.text}</Text>
                
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

                {isLoading ? (
                    <ActivityIndicator size="large" color="#FF8D00" style={styles.loader} />
                ) : comments.length === 0 ? (
                    <Text style={styles.noCommentsText}>Be the first one to comment!</Text>
                ): (
                    <FlatList
                        data={comments}
                        renderItem={renderComment}
                        keyExtractor={(item, index) => index.toString()}
                        contentContainerStyle={styles.commentsContainer}
                    />
                )}

                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        value={newComment}
                        onChangeText={setNewComment}
                        placeholder="Leave comment here"
                    />
                    <TouchableOpacity onPress={handleAddComment} >
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
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        maxHeight: '80%',
        flex: 1,  
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    headerText: {
        fontSize: 20,
        fontFamily: "Poppins-Medium",
    },
    commentsContainer: {
        flexGrow: 1,
        paddingBottom: 8,
    },
    commentContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 12,
        flex: 1,
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
        fontFamily: 'Inter-Regular',
    },
    commentText: {
        fontSize: 15,
        fontFamily: 'Inter-Regular',
        marginVertical: 4,
        color: '#595959',
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
        justifyContent: "flex-end",
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
    noCommentsText: {
        fontSize: 16,
        fontFamily: "Poppins-Regular",
        marginTop: 20,  
        alignSelf: 'center',
        height: '83%',
    },
    loader: {
        marginTop: 20,  
        alignSelf: 'center',
        height: '83%',
    },
});
  
export default CommentsModal;