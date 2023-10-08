import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../css/Posts.css";
import axios from 'axios';

function Posts({ user }) {
  const [posts, setPosts] = useState([]);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [comments, setComments] = useState([]);
  const [editedPost, setEditedPost] = useState(null);
  const [editedComment, setEditedComment] = useState(null);
  const [newPost, setNewPost] = useState({ title: "", body: "" });
  const [newComment, setNewComment] = useState({ name: "", email: "", body: "" });
  const { postId } = useParams();
  const navigate = useNavigate();
  const postRef = useRef(null);
  const [isAddingPost, setIsAddingPost] = useState(false);
  const [isAddingComment, setIsAddingComment] = useState(false);
  const [filter, setFilter] = useState("all"); // Added filter state

  useEffect(() => {
    if (user && user.id) {
      axios.get(`http://localhost:3010/posts`)
        .then(response => {
          setPosts(response.data);
          console.log('success');
      })
        .catch(error => {
          console.error(error);
      });
    }
  }, [user]);
  const handleFilterChange = (e) => {
    setFilter(e.target.value);
    if(e.target.value==='my-posts')
    {
      if (user && user.id) {
      axios.get(`http://localhost:3010/users/${user.id}/posts`)
        .then(response => {
          setPosts(response.data);
          console.log('success');
      })
        .catch(error => {
          console.error(error);
      });
    }
    }
    else{
      if (user && user.id) {
        axios.get(`http://localhost:3010/posts`)
          .then(response => {
            setPosts(response.data);
            console.log('success');
        })
          .catch(error => {
            console.error(error);
        });
      }
    }
    

  };

  useEffect(() => {
    if (editedPost) {
      postRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [editedPost]);

  const newPostDraft = {
    title: newPost.title,
    body: newPost.body
  };

  const handleAddPost = () => {
    setIsAddingPost(true);
  };

  const handleCommentsClick = (postId) => {
    console.log(postId);
    setSelectedPostId(postId);
    axios
      .get(`http://localhost:3010/comments/${postId}`)
      .then((response) => {
        const comments = response.data;
        console.log(comments);
        setComments(comments);
      })
      .catch((error) => {
        console.error('Error retrieving comments:', error);
      });
  };

  const handleCloseCommentsClick = () => {
    setSelectedPostId(null);
  };

  const handlePostClick = (postId) => {
    navigate(`/Posts/${postId}`);
  };

  const handleEditPost = (postId) => {
    const selectedPost = posts.find((post) => post.id === postId);
    setEditedPost(selectedPost);
  };

  const handleSavePost = () => {
    if (editedPost) {
      axios
        .put(`http://localhost:3010/posts/${editedPost.id}`, editedPost)
        .then((response) => {
          console.log('Post updated successfully');
          setEditedPost(null);
        })
        .catch((error) => {
          console.error('Error updating post:', error);
        });
    }
  };

  const handleCancelEdit = () => {
    setEditedPost(null);
  };

  const handleDeletePost = (postId) => {
    axios
      .delete(`http://localhost:3010/posts/${postId}`)
      .then((response) => {
        console.log('Post deleted successfully');
        const updatedPosts = posts.filter((post) => post.id !== postId);
        setPosts(updatedPosts);
      })
      .catch((error) => {
        console.error('Error deleting post:', error);
      });
  };

  const handleNewPostChange = (e) => {
    setNewPost({ ...newPost, [e.target.name]: e.target.value });
  };

  const handleSaveNewPost = () => {
    const newPostWithId = {
      ...newPost,
      user_id: user.id,
    };
    console.log(newPostWithId);

    axios
      .post('http://localhost:3010/posts', newPostWithId)
      .then((response) => {
        const postId = response.data.id;
        console.log('New post created with ID:', postId);
        const updatedPosts = [...posts, newPostWithId];
        setPosts(updatedPosts);
        setNewPost({ title: "", body: "" });
        setIsAddingPost(false);
      })
      .catch((error) => {
        console.error('Error creating post:', error);
      });
  };

  const handleCancelAddPost = () => {
    setIsAddingPost(false);
  };

  const handleAddComment = () => {
    setIsAddingComment(true);
  };

  const handleSaveComment = () => {
    if (editedComment !== null) {
      // Logic to save the edited comment
      axios
        .put(`http://localhost:3010/comments/${editedComment.id}`, editedComment)
        .then((response) => {
          console.log('Comment updated successfully');
          const updatedComments = comments.map((comment) =>
            comment.id === editedComment.id ? editedComment : comment
          );
          setComments(updatedComments);
      setEditedComment(null);
        })
        .catch((error) => {
          console.error('Error updating comment:', error);
        });
    } else if(newComment) {
      // Logic to save the new comment
      const newCommentWithId = {
        ...newComment,
        post_id: selectedPostId,
      };

      axios
        .post("http://localhost:3010/comments", newCommentWithId)
        .then(response => {
          console.log("Comment added successfully");
          const updatedComments = [...comments, newCommentWithId];
          setComments(updatedComments);
          setNewComment({ name: "", email: "", body: "" });
          setIsAddingComment(false);
        })
        .catch(error => {
          console.error("Error adding comment:", error);
       // Handle error
        });
    
    }
  };

  
  
  
  const handleCancelEditComment = () => {
    setEditedComment(null);
  };

  const handleEditComment = (comment) => {
    setEditedComment(comment);
  };

  const handleDeleteComment = (commentId) => {
    axios
      .delete(`http://localhost:3010/comments/${commentId}`)
      .then((response) => {
        console.log('Comment deleted successfully');
    const updatedComments = comments.filter((comment) => comment.id !== commentId);
    setComments(updatedComments);
      })
      .catch((error) => {
        console.error('Error deleting comment:', error);
      });
  };

  const handleNewCommentChange = (e) => {
    setNewComment({ ...newComment, [e.target.name]: e.target.value });
  };

  

  return (
    <div>
      <div className="filtering-container">
        <label htmlFor="filter">Filter:</label>
        <select id="filter" value={filter} onChange={handleFilterChange}>
          <option value="all">All Posts</option>
          <option value="my-posts">My Posts</option>
        </select>
      </div>
      <div className="posts-container">
        {posts.map((post) => (
          <div
            key={post.id}
            ref={post.id === editedPost?.id ? postRef : null}
            className={postId === post.id ? "selected-post post" : "post"}
          >
            <h3>{post.title}</h3>
            {editedPost && editedPost.id === post.id ? (
              <textarea
                value={editedPost.body}
                onChange={(e) =>
                  setEditedPost({ ...editedPost, body: e.target.value })
                }
              />
            ) : (
              <p>{post.body}</p>
            )}
            {selectedPostId === post.id && (
              <div>
                <h4>Comments:</h4>
                {comments.map((comment, index) => (
                  <div key={comment.id} className="comment">
                    {editedComment && editedComment.id === comment.id ? (
                      <div>
                        <input
                          type="text"
                          name="name"
                          placeholder="Name"
                          value={editedComment.name}
                          onChange={(e) =>
                            setEditedComment({
                              ...editedComment,
                              name: e.target.value,
                              id:comment.id
                            })
                          }
                        />
                        <input
                          type="email"
                          name="email"
                          placeholder="Email"
                          value={editedComment.email}
                          onChange={(e) =>
                            setEditedComment({
                              ...editedComment,
                              email: e.target.value,
                              id:comment.id
                            })
                          }
                        />
                        <textarea
                          name="body"
                          placeholder="Comment body"
                          value={editedComment.body}
                          onChange={(e) =>
                            setEditedComment({
                              ...editedComment,
                              body: e.target.value,
                              id:comment.id
                            })
                          }
                        />
                        <button onClick={handleSaveComment}>Save</button>
                        <button onClick={handleCancelEditComment}>
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <>
                        <p>Name: {comment.name}</p>
                        <p>Email: {comment.email}</p>
                        <p>{comment.body}</p>
                        <button onClick={() => handleEditComment(comment, index)}>
                          Edit
                        </button>
                        <button onClick={() => handleDeleteComment(comment.id)}>
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                ))}
                {isAddingComment ? (
                  <div>
                    <input
                      type="text"
                      name="name"
                      placeholder="Name"
                      value={newComment.name}
                      onChange={handleNewCommentChange}
                    />
                    <input
                      type="email"
                      name="email"
                      placeholder="Email"
                      value={newComment.email}
                      onChange={handleNewCommentChange}
                    />
                    <textarea
                      name="body"
                      placeholder="Comment body"
                      value={newComment.body}
                      onChange={handleNewCommentChange}
                    />
                    <button onClick={handleSaveComment}>Save</button>
                    <button onClick={() => setIsAddingComment(false)}>
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button onClick={handleAddComment}>Add Comment</button>
                )}
              </div>
            )}
            {selectedPostId === post.id ? (
              <button onClick={handleCloseCommentsClick}>Close Comments</button>
            ) : (
              <button onClick={() => handleCommentsClick(post.id)}>
                View Comments
              </button>
            )}
            {editedPost && editedPost.id === post.id ? (
              <>
                <button onClick={handleSavePost}>Save</button>
                <button onClick={handleCancelEdit}>Cancel</button>
              </>
            ) : (
              <button onClick={() => handleEditPost(post.id)}>Edit</button>
            )}
            <button onClick={() => handleDeletePost(post.id)}>Delete</button>
          </div>
        ))}
      </div>
      <div className="add-post-container">
        <button className="add-post-button" onClick={handleAddPost}>
          Add Post
        </button>
      </div>

      {isAddingPost && (
        <div className="post">
          <h3>New Post</h3>
          <input
            type="text"
            name="title"
            placeholder="Post title"
            value={newPostDraft.title}
            onChange={handleNewPostChange}
          />
          <textarea
            name="body"
            placeholder="Post body"
            value={newPostDraft.body}
            onChange={handleNewPostChange}
          />
          <button onClick={handleSaveNewPost}>Save</button>
          <button onClick={handleCancelAddPost}>Cancel</button>
        </div>
      )}
    </div>
  );
}

export default Posts;
