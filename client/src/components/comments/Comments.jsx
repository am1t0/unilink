import React, { useEffect, useState } from "react";
import { Send, Heart, Trash } from "lucide-react";
import "./comments.css";
import { useCommentStore } from "../../store/useCommentStore";
import { useAuthStore } from "../../store/useAuthStore.js";

const Comments = ({setCommentCounts, postId }) => {
  const {
    comments,
    loading,
    error,
    fetchComments,
    addComment,
    removeComment,
    toggleCommentLike,
  } = useCommentStore();
  const { authUser } = useAuthStore();
  const [input, setInput] = useState("");
  const [replyInput, setReplyInput] = useState("");
  const [replyIndexes, setReplyIndexes] = useState({});
  const [showReplies, setShowReplies] = useState({});

  useEffect(() => {
    if (postId) {
      fetchComments(postId);
    }
  }, [postId, fetchComments]);

  const handleCommentSubmit = async () => {
    setCommentCounts((prev) => prev + 1);
    if (input.trim() !== "") {
      try {
        await addComment(postId, input);
        fetchComments(postId);
        setInput("");
      } catch (error) {
        console.error("Error adding comment:", error);
      }
    }
  };

  const handleReplySubmit = async (parentId) => {
    setCommentCounts((prev) => prev + 1);
    if (replyInput.trim() !== "") {
      try {
        await addComment(postId, replyInput, parentId);
        fetchComments(postId);
        setReplyInput("");
        setReplyIndexes((prev) => ({ ...prev, [parentId]: false }));
      } catch (error) {
        console.error("Error adding reply:", error);
      }
    }
  };

  const handleDeleteComment = async (commentId) => {
    setCommentCounts((prev) => prev - 1);
    const userConfirmed = window.confirm("Are you sure you want to delete this comment?");
    if (!userConfirmed) return;
    try {
      await removeComment(commentId);
      fetchComments(postId);
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  const handleLikeComment = async (commentId) => {
    try {
      await toggleCommentLike(commentId);
      // No need to fetch comments here if your store updates the state properly
    } catch (error) {
      console.error("Error toggling comment like:", error);
    }
  };

  const toggleReplies = (parentId) => {
    setShowReplies((prev) => ({ ...prev, [parentId]: !prev[parentId] }));
  };

  const toggleReplyBox = (commentId) => {
    setReplyIndexes((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  };

  if (loading) return <p>Loading comments...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="comments-container">
      <div className="comments-list">
        {comments.map((comment) => {
          // Get likedBy array or default to empty array
          const likedBy = Array.isArray(comment.likedBy) ? comment.likedBy : [];
          const isLiked = likedBy.includes(authUser._id);
          const likeCount = comment.likes || 0;

          return (
            <div key={comment._id} className="comment-item">
              <div className="comment-header">
                <img
                  src={comment.avatar || "default-avatar-url.jpg"}
                  alt="profile"
                  className="profile-pic"
                />
                <div className="comment-content">
                  <div className="comment-top">
                    <p className="comment-user">{comment.username}</p>
                    {authUser._id === comment.userId && (
                      <Trash
                        size={14}
                        className="delete-icon"
                        onClick={() => handleDeleteComment(comment._id)}
                      />
                    )}
                  </div>
                  <p className="comment-text">{comment.content}</p>
                  <div className="comment-actions">
                    <span
                      className="reply-button"
                      onClick={() => toggleReplyBox(comment._id)}
                    >
                      Reply
                    </span>
                    {comment.repliesCount > 0 && (
                      <span
                        className="toggle-replies"
                        onClick={() => toggleReplies(comment._id)}
                      >
                        {showReplies[comment._id]
                          ? `Hide ${comment.repliesCount} replies`
                          : `View ${comment.repliesCount} replies`}
                      </span>
                    )}
                  </div>
                  {replyIndexes[comment._id] && (
                    <div className="comment-input-container">
                      <input
                        type="text"
                        value={replyInput}
                        onChange={(e) => setReplyInput(e.target.value)}
                        className="comment-input"
                        placeholder="Write a reply..."
                      />
                      <button
                        onClick={() => handleReplySubmit(comment._id)}
                        className="comment-send-button"
                      >
                        <Send size={14} />
                      </button>
                    </div>
                  )}
                </div>
                <div className="like-section">
                  <span className="like-count">{likeCount}</span>
                  <Heart
                    size={18}
                    className={`like-icon ${isLiked ? "liked" : ""}`}
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent event bubbling
                      handleLikeComment(comment._id);
                    }}
                    fill={isLiked ? "red" : "none"}
                    color={isLiked ? "red" : "currentColor"}
                  />
                </div>
              </div>

              {/* Replies Section */}
              {showReplies[comment._id] && comment.replies.length > 0 && (
                <div className="replies-list">
                  {comment.replies.map((reply) => {
                    const replyLikedBy = Array.isArray(reply.likedBy)
                      ? reply.likedBy
                      : [];
                    const isReplyLiked = replyLikedBy.includes(authUser._id);
                    const replyLikeCount = reply.likes || 0;

                    return (
                      <div key={reply._id} className="comment-item reply-item">
                        <div className="comment-header">
                          <img
                            src={reply.avatar || "default-avatar-url.jpg"}
                            alt="profile"
                            className="profile-pic"
                          />
                          <div className="comment-content">
                            <div className="comment-top">
                              <p className="comment-user">{reply.username}</p>
                              {authUser._id === reply.userId && (
                                <Trash
                                  size={14}
                                  className="delete-icon"
                                  onClick={() => handleDeleteComment(reply._id)}
                                />
                              )}
                            </div>
                            <p className="comment-text">{reply.content}</p>
                          </div>
                          {/* <div className="like-section">
                            <span className="like-count">{replyLikeCount}</span>
                            <Heart
                              size={18}
                              className={`like-icon ${
                                isReplyLiked ? "liked" : ""
                              }`}
                              onClick={() => handleLikeComment(reply._id)}
                              fill={isReplyLiked ? "red" : "none"}
                            />
                          </div> */}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add a new comment */}
      <div className="comment-input-container">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="comment-input"
          placeholder="Add a comment..."
        />
        <button onClick={handleCommentSubmit} className="comment-send-button">
          <Send size={18} />
        </button>
      </div>
    </div>
  );
};

export default Comments;
