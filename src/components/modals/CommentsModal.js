import React, { useState, useEffect, useCallback, useRef } from 'react';
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
import Heart from '../post/Heart';
import { cancelGradient, sendGradient, reply, yellowTriangle } from '../../utils/icons';
import { SvgUri } from "react-native-svg";
import apiClient from '../../services/apiClient';

const CommentsModal = ({ post, visible, onClose }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');

    console.log('post',post.id);
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
            setComments(response.data);
        
        } catch (error) {
            console.error('Error fetching comments and replies:', error);
        } finally {
            setIsLoading(false);
        }
    }, [post.id]);

    useEffect(() => {
        if (!post?.id) return;
        fetchComments();
    }, [post.id, fetchComments]);

    // Handle add new comments
    const handleAddComment = async () => {
        try {
            const response = await apiClient.post(`${baseUrl}/comments/`, {
                content: newComment,
                content_type: 'EV',
                content_object_id: post.id,
            });
           
            const newComentObj = {
                id: response.data.id,
                content: response.data.content,
                profilephoto_url: response.data.profilephoto_url,
                user: response.data.user,
                created_at: formatTimestamp(response.data.created_at),
                replies:[]
            };

            setComments((prevComments) => [newComentObj, ...prevComments]);
            setNewComment('');
        } catch (error) {
            console.error('Error posting comment:', error);
        }
    };
  
    // Handle add new reply
    const handleAddReply = async (parentId, replyText) => {
        if (!replyText.trim()) return;

        try {
            const response = await apiClient.post(`${baseUrl}/comments/`, {
                parent: parentId,
                content: replyText,
                content_type: 'EV',
                content_object_id: post.id,
            });

            const newReplyObj = {
                id: response.data.id,
                content: response.data.content,
                profilephoto_url: response.data.profilephoto_url,
                user: response.data.user,
                created_at: response.data.created_at,
                parentId: parentId,
                replies: []
            };

            const addReplyRecursively = (comments) => {
                return comments.map(comment => {
                    if (comment.id === parentId) {
                        return { ...comment, replies: [...comment.replies, newReplyObj] };
                    } else if (comment.replies.length > 0) {
                        return { ...comment, replies: addReplyRecursively(comment.replies) };
                    }
                    return comment;
                });
            };
    
            setComments(prevComments => addReplyRecursively(prevComments));
    
        } catch (error) {
            console.error('Error posting Reply:', error);
        }
    };
    
    // Comm
    const CommentItem = ({ item }) => {
        const [isReplying, setIsReplying] = useState(false);
        const [showReplies, setShowReplies] = useState(false);
        const [replyText, setReplyText] = useState('');
        const replyInputRef = useRef(null);

        const handleReplyPress= () => {
            setIsReplying(true);
            setTimeout(() => replyInputRef.current?.focus(), 100);
        }
        return (
            <View style={styles.commentContainer}>
                <Image 
                    source={{ uri: `data:image/jpeg;base64,${item.profilephoto_url}` }}  
                    style={styles.avatar} 
                />
                <View style={styles.commentContent}>
                    <Text style={styles.commentUser}>{item.user}</Text>
                    <Text style={styles.commentTimestamp}>{formatTimestamp(item.created_at)}</Text>
                    <Text style={styles.commentText}>{item.content}</Text>
                    <View style={styles.iconsContainer}>
                        {/*like*/}
                        <TouchableOpacity onPress={handleReplyPress}>
                            <SvgUri uri={reply} width={14} height={14} />
                        </TouchableOpacity>

                        {/* Show replies button */}
                        {item.replies.length > 0 && ( 
                            <TouchableOpacity onPress={() => setShowReplies(prev => !prev)}>
                                <Text style={styles.totalReplies}>
                                    {showReplies ? "-- Hide replies" : `-- View ${item.replies.length} replies`}
                                </Text>
                            </TouchableOpacity>
                        )}
                    </View>

                    {isReplying && (
                        <TextInput 
                            ref={replyInputRef}
                            style={styles.replyInput}
                            placeholder="Write a reply..."
                            value={replyText}
                            onChangeText={setReplyText}
                            onSubmitEditing={async () => {
                                if (replyText.trim()) {
                                    await handleAddReply(item.id, replyText);
                                    setReplyText('');  
                                    setTimeout(() => replyInputRef.current?.focus(), 100);  
                                }
                            }}
                        />
                    )}

                    {showReplies && <RepliesList parentUser={item.user} replies={item.replies} />}

                </View>
            </View>
        );
    }

    const ReplyItem = ({ replyItem, parentUser }) => {
        console.log('replyItems', replyItem);
        console.log('commentItem', parentUser);
        const [isReplying, setIsReplying] = useState(false);
        const [replyText, setReplyText] = useState('');
        const replyInputRef = useRef(null);

        const handleReplyPress= () => {
            setIsReplying(true);
            setTimeout(() => replyInputRef.current?.focus(), 100);
        };

        return (
            <View style={styles.commentContainer}>
                <Image 
                    source={{ uri: `data:image/jpeg;base64,${replyItem.profilephoto_url}` }} 
                    style={styles.avatar} 
                />

                <View style={styles.commentContent}>
                    <View style={styles.replyUsernameContainer}>
                        <Text style={styles.commentUser}>{replyItem.user}</Text>
                        <SvgUri uri={yellowTriangle} />
                        <Text style={styles.commentUser}>{parentUser}</Text>
                    </View>
                    <Text style={styles.commentTimestamp}>{formatTimestamp(replyItem.created_at)}</Text>
                    <Text style={styles.commentText}>{replyItem.content}</Text>
                
                    <View style={styles.iconsContainer}>
                        {/*like*/}
                        <TouchableOpacity onPress={handleReplyPress}>
                            <SvgUri uri={reply} width={14} height={14} />
                        </TouchableOpacity>
                    </View>

                    {isReplying && (
                        <TextInput 
                            ref={replyInputRef}
                            style={styles.replyInput}
                            placeholder="Write a reply..."
                            value={replyText}
                            onChangeText={setReplyText}
                            onSubmitEditing={async () => {
                                if (replyText.trim()) {
                                    await handleAddReply(replyItem.id, replyText);
                                    setReplyText('');  
                                    setTimeout(() => replyInputRef.current?.focus(), 100);  
                                }
                            }}  
                            onBlur={() => setIsReplying(false)}
                        />
                    )}

                    {/* Recursively Render Replies */}
                    {replyItem.replies.length > 0 && <RepliesList replies={replyItem.replies} parentUser={parentUser} />}
                </View>
            </View>

        );
    }

    const RepliesList = ({ parentUser, replies }) => {
        console.log('repliesList', replies);
        const [visibleReplies, setVisibleReplies] = useState(3);

        const handleShowMore = () => {
            setVisibleReplies((prev) => (prev + 3));
        };

        return (
            <View>
                {replies.length > 0 && (
                    <View style={styles.replyListContainer}>
                        <FlatList
                            data={replies.slice(0, visibleReplies)} 
                            keyExtractor={(item) => String(item.id)}
                            renderItem={({ item }) => {
                                console.log('renderitem in relieslist',item);
                                return <ReplyItem replyItem={item} parentUser={parentUser} />;
                            }}
                        />
                        {replies.length > visibleReplies && (
                        <TouchableOpacity onPress={handleShowMore}>
                            <Text>-- Show more</Text>
                        </TouchableOpacity>
                    )}
                    </View>
                )}
            </View>
        );
    };

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
                        renderItem={({ item }) => <CommentItem item={item} />}
                        keyExtractor={(item, index) => String(item.id)}
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
        fontSize: 14,
        fontFamily: 'Inter-Regular',
        color: '#000000',
    },
    commentText: {
        fontSize: 15,
        fontFamily: 'Inter-Regular',
        marginVertical: 4,
        color: '#595959',
    },
    iconsContainer: {
        flexDirection: 'row',
        alignItems:'center',
        //justifyContent: 'center',
        gap: 10,
    },
    totalReplies: {
        marginTop: 3,
    },
    replyUsernameContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
    },
    commentTimestamp: {
        fontSize: 12,
        color: 'gray',
    },
    replyListContainer: {
        marginTop: 10,
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