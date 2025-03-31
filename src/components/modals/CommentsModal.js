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
import { cancelGradient, sendGradient, reply } from '../../utils/icons';
import { SvgUri } from "react-native-svg";
import apiClient from '../../services/apiClient';

const CommentsModal = ({ post, visible, onClose }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [replies, setReplies] = useState([]);
    const [activeCommentId, setActiveCommentId] = useState(null);
    const [newReply, setNewReply] = useState('');
    const [selectedCommentId, setSelectedCommentId] = useState(null);
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
            console.log('responsedata', response.data);
            const transformedComments = response.data.map(comment => ({
                id: comment?.id,
                text: comment?.content,  
                user: {
                    avatar: `data:image/jpeg;base64, ${comment?.profilephoto_url}`,
                    name: comment?.user,
                },
                timestamp: formatTimestamp(comment?.created_at),

                replies: comment?.replies?.map(reply => ({
                    id: reply?.id,
                    text: reply?.content,
                    user: {
                        avatar: `data:image/jpeg;base64, ${reply?.profilephoto_url}`,
                        name: reply?.user,
                    },
                    timestamp: formatTimestamp(reply?.created_at),
                    parentId: comment?.id
                })) || []
                
            }));

            const allReplies = response.data.flatMap(comment =>
                comment?.replies?.map(reply => ({
                    id: reply?.id,
                    text: reply?.content,
                    user: {
                        avatar: `data:image/jpeg;base64, ${reply?.profilephoto_url}`,
                        name: reply?.user,
                    },
                    timestamp: formatTimestamp(reply?.created_at),
                    parentId: comment?.id
                })) || []
            );

            setComments(transformedComments);
            setReplies(allReplies);
            console.log('allreplies',allReplies);
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
            await apiClient.post(`${baseUrl}/comments/`, {
                parent: parentId,
                content: replyText,
                content_type: 'EV',
                content_object_id: post.id,
            });

            const newReplyObj = {
                text: replyText,
                user: { avatar: post.profile_photo_url, name: post.username },
                timestamp: formatTimestamp(new Date().toISOString()),
                parentId: parentId,
            };

            setComments(prevComments =>
                prevComments.map(comment =>
                    comment.id === parentId
                        ? { ...comment, replies: [...comment.replies, newReplyObj] }
                        : comment
                )
            );
    
        } catch (error) {
            console.error('Error posting Reply:', error);
        }
    };
    
    // Comm
    const CommentItem = ({ item, comments }) => {
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
                <Image source={{ uri: item.user.avatar }} style={styles.avatar} />
                <View style={styles.commentContent}>
                    <Text style={styles.commentUser}>{item.user.name}</Text>
                    <Text style={styles.commentTimestamp}>{item.timestamp}</Text>
                    <Text style={styles.commentText}>{item.text}</Text>
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

                    {showReplies && <RepliesList parentId={item.id} replies={item.replies} comments={comments} />}

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

                </View>
            </View>
        );
    }

    const ReplyItem = ({ replyItem, commentItem }) => {
        const [isReplying, setIsReplying] = useState(false);
        const [replyText, setReplyText] = useState('');
        const replyInputRef = useRef(null);

        const handleReplyPress= () => {
            setIsReplying(true);
            setTimeout(() => replyInputRef.current?.focus(), 100);
        }
        return (
            <View style={styles.commentContainer}>
                <Image source={{ uri: replyItem.user.avatar }} style={styles.avatar} />
                <View style={styles.commentContent}>
                    <Text style={styles.commentUser}>{replyItem.user.name} replied to {commentItem?.user.name}</Text>
                    <Text style={styles.commentTimestamp}>{replyItem.timestamp}</Text>
                    <Text style={styles.commentText}>{replyItem.text}</Text>
                

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
                            
                        />
                    )}

                    {replyItem.replies?.length > 0 && (
                        <View style={styles.nestedRepliesContainer}>
                            {replyItem.replies.map((nestedReply) => (
                                <View key={nestedReply.id}>{renderReply({ replyItem: nestedReply, commentItem })}</View>
                            ))}
                        </View>
                    )}
                </View>
            </View>

        );
    }

    const RepliesList = ({ parentId, replies, comments }) => {
        const [visibleReplies, setVisibleReplies] = useState(5);
        const filteredReplies = replies.filter(reply => reply.parentId === parentId);
        const commentItem = comments.find(comment => comment.id === parentId);

        const handleShowMore = () => {
            setVisibleReplies((prev) => (prev + 5));
        };

        return (
            <View>
                {filteredReplies.length > 0 && (
                    <View style={styles.replyListContainer}>
                        <FlatList
                            data={filteredReplies.slice(0, visibleReplies)} 
                            keyExtractor={(item) => String(item.id)}
                            renderItem={({ item }) => <ReplyItem replyItem={item} commentItem={commentItem} />}
                        />
                        {filteredReplies.length > visibleReplies && (
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
                        renderItem={({ item }) => <CommentItem item={item} comments={comments} />}
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
        fontSize: 16,
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