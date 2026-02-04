import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Star, ThumbsUp, ThumbsDown, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const ProductReviews = ({ productId }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 5, title: '', content: '' });
  const [submitting, setSubmitting] = useState(false);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API}/products/${productId}/reviews`);
      setReviews(response.data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) return;

    setSubmitting(true);
    try {
      await axios.post(`${API}/products/${productId}/reviews`, {
        ...newReview,
        user_name: user.name,
        user_id: user.id
      });
      setNewReview({ rating: 5, title: '', content: '' });
      setShowReviewForm(false);
      fetchReviews();
    } catch (error) {
      console.error('Error submitting review:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleHelpful = async (reviewId, helpful) => {
    try {
      await axios.post(`${API}/reviews/${reviewId}/helpful`, { helpful });
      fetchReviews();
    } catch (error) {
      console.error('Error marking helpful:', error);
    }
  };

  const renderStars = (rating, interactive = false, onChange = null) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type={interactive ? 'button' : undefined}
            onClick={interactive ? () => onChange(star) : undefined}
            className={interactive ? 'cursor-pointer' : 'cursor-default'}
            disabled={!interactive}
          >
            <Star
              className={`w-5 h-5 ${
                star <= rating
                  ? 'fill-[#de7921] text-[#de7921]'
                  : 'text-gray-300'
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  const ratingBreakdown = [5, 4, 3, 2, 1].map((rating) => {
    const count = reviews.filter((r) => r.rating === rating).length;
    const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
    return { rating, count, percentage };
  });

  const averageRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : 0;

  if (loading) {
    return (
      <div className="py-8 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#febd69] border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6" id="reviews" data-testid="product-reviews">
      <h2 className="text-xl font-bold text-[#0f1111]">Customer reviews</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Rating Summary */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            {renderStars(Math.round(averageRating))}
            <span className="text-lg font-medium text-[#0f1111]">
              {averageRating} out of 5
            </span>
          </div>
          <p className="text-sm text-[#565959]">
            {reviews.length} global ratings
          </p>

          {/* Rating Breakdown */}
          <div className="space-y-2">
            {ratingBreakdown.map(({ rating, percentage }) => (
              <div key={rating} className="flex items-center gap-2 text-sm">
                <span className="w-16 text-[#007185] hover:text-[#c7511f] hover:underline cursor-pointer">
                  {rating} star
                </span>
                <div className="flex-1 h-5 bg-gray-200 rounded overflow-hidden">
                  <div
                    className="h-full bg-[#ffa41c]"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="w-10 text-[#007185]">{Math.round(percentage)}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Write Review */}
        <div className="border-l border-gray-200 pl-8">
          <h3 className="font-bold text-[#0f1111] mb-2">Review this product</h3>
          <p className="text-sm text-[#565959] mb-4">
            Share your thoughts with other customers
          </p>
          
          {isAuthenticated ? (
            !showReviewForm ? (
              <button
                onClick={() => setShowReviewForm(true)}
                className="w-full py-2 px-4 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors"
                data-testid="write-review-button"
              >
                Write a customer review
              </button>
            ) : (
              <form onSubmit={handleSubmitReview} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold mb-2">Overall rating</label>
                  {renderStars(newReview.rating, true, (rating) => 
                    setNewReview({ ...newReview, rating })
                  )}
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2">Add a headline</label>
                  <input
                    type="text"
                    value={newReview.title}
                    onChange={(e) => setNewReview({ ...newReview, title: e.target.value })}
                    placeholder="What's most important to know?"
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#e77600]"
                    required
                    data-testid="review-title-input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2">Add a written review</label>
                  <textarea
                    value={newReview.content}
                    onChange={(e) => setNewReview({ ...newReview, content: e.target.value })}
                    placeholder="What did you like or dislike? What did you use this product for?"
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#e77600] resize-none"
                    required
                    data-testid="review-content-input"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-4 py-2 bg-[#ffd814] hover:bg-[#f7ca00] rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                    data-testid="submit-review-button"
                  >
                    {submitting ? 'Submitting...' : 'Submit'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowReviewForm(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )
          ) : (
            <p className="text-sm text-[#565959]">
              <a href="/signin" className="text-[#007185] hover:text-[#c7511f] hover:underline">
                Sign in
              </a>{' '}
              to write a review
            </p>
          )}
        </div>
      </div>

      {/* Reviews List */}
      <div className="border-t border-gray-200 pt-6">
        <h3 className="font-bold text-[#0f1111] mb-4">Top reviews</h3>
        
        {reviews.length === 0 ? (
          <p className="text-sm text-[#565959]">No reviews yet. Be the first to review this product!</p>
        ) : (
          <div className="space-y-6">
            {reviews.map((review) => (
              <div key={review.id} className="pb-6 border-b border-gray-200" data-testid={`review-${review.id}`}>
                {/* Reviewer Info */}
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-full bg-[#232f3e] flex items-center justify-center text-white text-sm font-medium">
                    {review.user_name?.charAt(0).toUpperCase() || 'A'}
                  </div>
                  <span className="text-sm text-[#0f1111]">{review.user_name || 'Anonymous'}</span>
                </div>

                {/* Rating & Title */}
                <div className="flex items-center gap-2 mb-1">
                  {renderStars(review.rating)}
                  <span className="font-bold text-sm text-[#0f1111]">{review.title}</span>
                </div>

                {/* Date & Verified */}
                <div className="flex items-center gap-2 text-xs text-[#565959] mb-2">
                  <span>Reviewed on {new Date(review.created_at).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}</span>
                  {review.verified_purchase && (
                    <span className="flex items-center gap-1 text-[#c45500]">
                      <Check className="w-3 h-3" />
                      Verified Purchase
                    </span>
                  )}
                </div>

                {/* Content */}
                <p className="text-sm text-[#0f1111] mb-3">{review.content}</p>

                {/* Helpful */}
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-[#565959]">
                    {review.helpful_count || 0} people found this helpful
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleHelpful(review.id, true)}
                      className="flex items-center gap-1 px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 text-[#0f1111]"
                    >
                      <ThumbsUp className="w-4 h-4" />
                      Helpful
                    </button>
                    <button
                      onClick={() => handleHelpful(review.id, false)}
                      className="p-1 border border-gray-300 rounded hover:bg-gray-50"
                    >
                      <ThumbsDown className="w-4 h-4 text-[#565959]" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductReviews;
