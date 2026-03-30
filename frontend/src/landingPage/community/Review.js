import React, { useState, useEffect } from "react";
import "./Review.css"; // Create this CSS file for additional styles

const API = process.env.REACT_APP_API_URL;

function Review() {
  const [reviews, setReviews] = useState([
    {
      id: 1,
      name: "Alex",
      rating: 5,
      comment: "This platform helped me find support during my hardest semester.",
      role: "Junior Student"
    },
    {
      id: 2,
      name: "Priya",
      rating: 5,
      comment: "The anonymous check-in made it easier to reach out.",
      role: "Senior Student"
    },
    {
      id: 3,
      name: "Jordan",
      rating: 4,
      comment: "Finally a space where I can talk without fear.",
      role: "Graduate Student"
    }
  ]);

  const [showReviewForm, setShowReviewForm] = useState(false);
  const [hoveredRating, setHoveredRating] = useState(0);

  const [newReview, setNewReview] = useState({
    rating: 5,
    comment: "",
    name: ""
  });

  // Fetch reviews from MongoDB
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch(`${API}/review/all`);
        const data = await res.json();
        const formatted = data.map(r => ({
          id: r._id,
          name: r.userName,
          rating: r.rating,
          comment: r.reviewText,
          role: "Community Member"
        }));
        setReviews(prev => [...prev, ...formatted]);
      } catch (error) {
        console.log("Error fetching reviews:", error);
      }
    };
    fetchReviews();
  }, []);

  // Submit review
  const handleReviewSubmit = async (e) => {
  e.preventDefault();

  if (newReview.comment.trim()) {
    try {
      const res = await fetch(`${API}/review/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({
          userId: localStorage.getItem("userId"),
          userName: newReview.name || "Anonymous",
          reviewText: newReview.comment,
          rating: newReview.rating
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to save review");
      }

      console.log("Saved in DB:", data);

      const review = {
        id: data._id || Date.now(),
        name: newReview.name || "Anonymous",
        rating: newReview.rating,
        comment: newReview.comment,
        role: "Community Member"
      };

      setReviews([review, ...reviews]);

      setNewReview({
        rating: 5,
        comment: "",
        name: ""
      });

      setShowReviewForm(false);

    } catch (error) {
      console.log("Error saving review:", error);
      alert("Review not saved!");
    }
  }
};

  // Star rating component
  const StarRating = ({ rating, onRatingChange, interactive = false }) => {
    const [hover, setHover] = useState(0);
    
    return (
      <div className="star-rating">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`star ${(interactive ? (hover || rating) >= star : rating >= star) ? 'filled' : ''}`}
            onClick={() => interactive && onRatingChange(star)}
            onMouseEnter={() => interactive && setHover(star)}
            onMouseLeave={() => interactive && setHover(0)}
            style={{ cursor: interactive ? 'pointer' : 'default' }}
          >
            ★
          </span>
        ))}
        {interactive && (
          <span className="rating-text">
            {rating === 5 && "Excellent"}
            {rating === 4 && "Good"}
            {rating === 3 && "Average"}
            {rating === 2 && "Below Average"}
            {rating === 1 && "Poor"}
          </span>
        )}
      </div>
    );
  };

  return (
    <div className="reviews-section">
      <h2 className="mt-3 p-3 text-center">What Students Say</h2>

      {/* Reviews Grid - 3 columns */}
      <div className="reviews-grid">
        {reviews.map(review => (
          <div key={review.id} className="review-card">
            <div className="rating">
              <StarRating rating={review.rating} />
            </div>
            <p className="review-comment">
              "{review.comment}"
            </p>
            <div className="reviewer">
              <strong>— {review.name}</strong>
              <span className="reviewer-role">
                {review.role}
              </span>
            </div>
          </div>
        ))}
      </div>

      {!showReviewForm ? (
        <button
          className="write-review-btn"
          onClick={() => setShowReviewForm(true)}
        >
          ✍️ Write a Review
        </button>
      ) : (
        <div className="review-form-container">
          <h3>Share Your Experience</h3>
          <form onSubmit={handleReviewSubmit}>
            <div className="rating-input">
              <label>Your Rating:</label>
              <StarRating
                rating={newReview.rating}
                onRatingChange={(value) =>
                  setNewReview({
                    ...newReview,
                    rating: value
                  })
                }
                interactive={true}
              />
            </div>

            <div className="form-group">
              <label>Your Name (optional):</label>
              <input
                type="text"
                placeholder="Leave blank for anonymous"
                value={newReview.name}
                onChange={(e) =>
                  setNewReview({
                    ...newReview,
                    name: e.target.value
                  })
                }
              />
            </div>

            <div className="form-group">
              <label>Your Review:</label>
              <textarea
                placeholder="Tell others about your experience..."
                value={newReview.comment}
                onChange={(e) =>
                  setNewReview({
                    ...newReview,
                    comment: e.target.value
                  })
                }
                rows={3}
                required
              />
            </div>

            <div className="form-actions">
              <button
                type="button"
                onClick={() => {
                  setShowReviewForm(false);
                  setHoveredRating(0);
                }}
                className="cancel-btn"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="submit-review"
              >
                Submit Review
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default Review;