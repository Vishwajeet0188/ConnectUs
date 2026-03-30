import React, { useState, useEffect } from "react";

const API = process.env.REACT_APP_API_URL;


function PostFeed() {

  const currentUser = "You";

  const [content, setContent] = useState("");
  const [anonymous, setAnonymous] = useState(true);
  const [commentText, setCommentText] = useState({});
  const [posts, setPosts] = useState([]);

  // Fetch posts from MongoDB
  useEffect(() => {

    const fetchPosts = async () => {

      try {

        const res = await fetch(`${API}/post/all`);
        const data = await res.json();

        const formatted = data.map(p => ({
          id: p._id,
          author: p.author,
          content: p.content,
          likes: p.likes,
          comments: p.comments.map(c => c.text),
          time: new Date(p.createdAt).toLocaleString(),
          owner: p.author
        }));

        setPosts(formatted);

      } catch (error) {

        console.log("Error fetching posts:", error);

      }

    };

    fetchPosts();

  }, []);


  // Share Story (Save to MongoDB)
  const handleSubmit = async () => {

    if (!content.trim()) return;

    const author = anonymous ? "Anonymous" : currentUser;

    try {

      const res = await fetch(`${API}/post/add`, {

        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({
          author,
          content
        })

      });

      const data = await res.json();

      const newPost = {
        id: data.post._id,
        author: data.post.author,
        content: data.post.content,
        likes: data.post.likes,
        comments: [],
        time: "Just now",
        owner: currentUser
      };

      setPosts([newPost, ...posts]);

      setContent("");
      setAnonymous(true);

    } catch (error) {

      console.log("Error creating post:", error);

    }

  };


  // Like post
  const handleLike = async (id) => {

    const res = await fetch(
      `${API}/post/like/${id}`,
      {
        method: "PUT",
        credentials: "include"
      }
    );

    const updated = await res.json();

    setPosts(
      posts.map(post =>
        post.id === updated._id
          ? {
              ...post,
              likes: updated.likes
            }
          : post
      )
    );

  };


  // Delete post (frontend only)
  const handleDelete = (id) => {

    setPosts(posts.filter(post => post.id !== id));

  };


  // Comment
  const handleComment = async (id) => {

    if (!commentText[id]?.trim()) return;

    const res = await fetch(
      `${API}/post/comment/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({
          text: commentText[id]
        })
      }
    );

    const updated = await res.json();

    setPosts(
      posts.map(post =>
        post.id === updated._id
          ? {
              ...post,
              comments: updated.comments.map(c => c.text)
            }
          : post
      )
    );

    setCommentText({ ...commentText, [id]: "" });

  };


  return (

    <div className="community-wrapper">

      <div className="community-container">

        {/* Share Section */}
        <div className="share-card">

          <h2>💚 Share Your Journey</h2>

          <p className="subtitle">
            If this community helped you, share your experience and inspire others.
          </p>

          <div className="share-row">

            <textarea
              placeholder="How did this community help you?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />

            <div className="share-side">

              <label className="anonymous-check">
                <input
                  type="checkbox"
                  checked={anonymous}
                  onChange={(e) => setAnonymous(e.target.checked)}
                />
                Anonymous
              </label>

              <button
                className="share-btn"
                onClick={handleSubmit}
                disabled={!content.trim()}
              >
                ✨ Share
              </button>

            </div>

          </div>

        </div>


        {/* Stories */}
        <div className="stories-section">

          {posts.map(post => (

            <div key={post.id} className="story-card">

              <div className="story-header">

                <div>
                  <strong>👤 {post.author}</strong>
                  <div className="time">{post.time}</div>
                </div>

                {post.owner === currentUser && (
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(post.id)}
                  >
                    🗑
                  </button>
                )}

              </div>

              <p>{post.content}</p>

              <div className="story-stats">
                ❤️ {post.likes} &nbsp; 💬 {post.comments.length}
              </div>

              <div className="story-actions">
                <button onClick={() => handleLike(post.id)}>
                  ❤️ Like
                </button>
              </div>

              <div className="comment-section">

                <input
                  type="text"
                  placeholder="Write something supportive..."
                  value={commentText[post.id] || ""}
                  onChange={(e) =>
                    setCommentText({
                      ...commentText,
                      [post.id]: e.target.value
                    })
                  }
                />

                <button onClick={() => handleComment(post.id)}>
                  Comment
                </button>

              </div>

              {post.comments.length > 0 && (

                <div className="comment-list">

                  {post.comments.map((c, index) => (
                    <div key={index} className="comment">
                      💬 {c}
                    </div>
                  ))}

                </div>

              )}

            </div>

          ))}

        </div>

      </div>

    </div>

  );

}

export default PostFeed;