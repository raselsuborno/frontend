import React, { useState, useEffect } from 'react';
import { Star, ChevronLeft, ChevronRight, ExternalLink, CheckCircle } from 'lucide-react';
import api from '../../lib/api.js';
import '../globe.css';

const GoogleReviews = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(4.9);
  const [totalReviews, setTotalReviews] = useState(693);
  const [loading, setLoading] = useState(true);

  const GOOGLE_BUSINESS_URL = 'https://g.page/r/CRWe6uKXT9JrEAI/review';

  // Default sample reviews (fallback)
  const defaultReviews = [
    {
      author_name: 'Johnny Ho',
      profile_photo_url: '',
      relative_time_description: '2 days ago',
      rating: 5,
      text: "The cleaners from Call the Cleaners were very professional, polite and timely. They left no spot left uncleaned, especially the bathroom and kitchen. Everything was placed back in its original place. Couldn't have done a better job myself.",
      time: Date.now() - 2 * 24 * 60 * 60 * 1000,
    },
    {
      author_name: 'Eugene Shcherban',
      profile_photo_url: '',
      relative_time_description: '2 days ago',
      rating: 5,
      text: 'All went fine. Great service!',
      time: Date.now() - 2 * 24 * 60 * 60 * 1000,
    },
    {
      author_name: 'Áine Hamilton',
      profile_photo_url: '',
      relative_time_description: '2 days ago',
      rating: 5,
      text: 'We were very happy with the service provided by call the cleaners, they were friendly efficient and reasonably priced. We get a regular fortnightly clean. Would recommend their services.',
      time: Date.now() - 2 * 24 * 60 * 60 * 1000,
    },
    {
      author_name: 'Daniel Eyre',
      profile_photo_url: '',
      relative_time_description: '3 days ago',
      rating: 5,
      text: 'Very nice clean. Good job.',
      time: Date.now() - 3 * 24 * 60 * 60 * 1000,
    },
    {
      author_name: 'Lisa Schaup',
      profile_photo_url: '',
      relative_time_description: '4 days ago',
      rating: 5,
      text: 'We used Call the Cleaners for our end-of-lease clean in Randwick and couldn\'t be happier with the service — communication was great and we got our full bond back.',
      time: Date.now() - 4 * 24 * 60 * 60 * 1000,
    },
    {
      author_name: 'Louise Rigby',
      profile_photo_url: '',
      relative_time_description: '2 days ago',
      rating: 5,
      text: 'My cleaner was so professional and worked really hard. She checked in at the end that I was happy and I was over the moon!',
      time: Date.now() - 2 * 24 * 60 * 60 * 1000,
    },
    {
      author_name: 'Ceci Yu',
      profile_photo_url: '',
      relative_time_description: '2 days ago',
      rating: 5,
      text: 'I booked a general clean in Pyrmont. Very happy with the service.',
      time: Date.now() - 2 * 24 * 60 * 60 * 1000,
    },
  ];

  // Fetch reviews from backend API
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const response = await api.get('public/reviews');
        if (response.data) {
          setReviews(response.data.reviews || []);
          setAverageRating(response.data.averageRating || 4.9);
          setTotalReviews(response.data.totalReviews || 693);
        }
      } catch (error) {
        console.error('Failed to fetch Google reviews:', error);
        // Fallback to sample reviews on error
        setReviews(defaultReviews);
        setAverageRating(4.9);
        setTotalReviews(693);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  // Use fetched reviews or fallback to default
  const displayReviews = reviews.length > 0 ? reviews : defaultReviews;
  const maxVisible = 3; // Show 3 cards at a time on desktop
  const maxIndex = Math.max(0, displayReviews.length - maxVisible);

  // Auto-play carousel
  useEffect(() => {
    if (!isAutoPlaying || displayReviews.length <= maxVisible) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        if (prev >= maxIndex) {
          return 0; // Loop back to start
        }
        return prev + 1;
      });
    }, 6000); // Change every 6 seconds

    return () => clearInterval(interval);
  }, [isAutoPlaying, maxIndex, displayReviews.length]);

  const nextReview = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  const prevReview = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  const truncateText = (text, maxLength = 150) => {
    if (!text) return { text: '', isTruncated: false };
    if (text.length <= maxLength) return { text, isTruncated: false };
    return { text: text.substring(0, maxLength) + '...', isTruncated: true };
  };

  // Format date from Google Reviews format
  const formatDate = (relativeTimeDescription) => {
    return relativeTimeDescription || 'Recently';
  };

  // Generate avatar URL from profile photo or create one with initials
  const getAvatarUrl = (review) => {
    if (review.profile_photo_url) {
      return review.profile_photo_url;
    }
    // Generate avatar with initials as fallback
    const name = review.author_name || 'User';
    const initials = name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0b5c28&color=fff&size=128&bold=true`;
  };

  const visibleReviews = displayReviews.slice(currentIndex, currentIndex + maxVisible);
  
  // Fill remaining slots if needed
  while (visibleReviews.length < maxVisible && displayReviews.length > 0) {
    visibleReviews.push(displayReviews[visibleReviews.length % displayReviews.length]);
  }

  if (loading && displayReviews.length === 0) {
    return (
      <div className="google-reviews-widget-container">
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <p className="muted">Loading reviews...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="google-reviews-widget-container">
      <div className="google-reviews-layout">
        {/* Left Side - Rating Summary */}
        <div className="google-reviews-summary-panel">
          <div className="google-reviews-excellent">EXCELLENT</div>
          <div className="google-reviews-stars-large">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                size={24} 
                fill="#FFB800" 
                color="#FFB800"
                style={{ margin: '0 2px' }}
              />
            ))}
          </div>
          <div className="google-reviews-count-text">
            Based on <strong>{totalReviews}</strong> reviews
          </div>
          <div className="google-reviews-logo">
            <img 
              src="https://cdn.trustindex.io/assets/platform/Google/logo.svg" 
              alt="Google" 
              width="110" 
              height="35"
              style={{ filter: 'grayscale(0)' }}
            />
          </div>
        </div>

        {/* Right Side - Review Cards Carousel */}
        <div className="google-reviews-carousel-wrapper">
          <div 
            className="google-reviews-carousel"
            style={{
              transform: `translateX(-${currentIndex * (100 / maxVisible)}%)`,
            }}
          >
            {displayReviews.map((review, index) => {
              const { text: displayText, isTruncated } = truncateText(review.text || '');
              const reviewId = review.time || index;
              const avatarUrl = getAvatarUrl(review);
              
              return (
                <div key={reviewId} className="google-review-card">
                  <div className="google-review-header">
                    <div className="google-review-platform-icon">
                      <img 
                        src="https://cdn.trustindex.io/assets/platform/Google/icon.svg" 
                        alt="Google" 
                        width="20" 
                        height="20"
                      />
                    </div>
                    <div className="google-review-profile">
                      <img 
                        src={avatarUrl} 
                        alt={review.author_name || 'Reviewer'}
                        className="google-review-avatar"
                        onError={(e) => {
                          // Fallback to initials avatar if image fails to load
                          const name = review.author_name || 'User';
                          e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0b5c28&color=fff&size=128&bold=true`;
                        }}
                      />
                    </div>
                    <div className="google-review-author">
                      <div className="google-review-name">{review.author_name || 'Anonymous'}</div>
                      <div className="google-review-date">{formatDate(review.relative_time_description)}</div>
                    </div>
                  </div>

                  <div className="google-review-rating">
                    {[...Array(review.rating || 5)].map((_, i) => (
                      <Star 
                        key={i} 
                        size={16} 
                        fill="#FFB800" 
                        color="#FFB800"
                      />
                    ))}
                    <span className="google-review-verified">
                      <CheckCircle size={14} fill="#4285F4" color="#4285F4" />
                    </span>
                  </div>

                  <div className="google-review-text">
                    {displayText}
                  </div>

                  {isTruncated && (
                    <button className="google-review-read-more">
                      Read more
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {/* Navigation Arrows */}
          {displayReviews.length > maxVisible && (
            <>
              <button 
                className="google-review-nav google-review-nav-prev"
                onClick={prevReview}
                aria-label="Previous review"
              >
                <ChevronLeft size={20} />
              </button>
              <button 
                className="google-review-nav google-review-nav-next"
                onClick={nextReview}
                aria-label="Next review"
              >
                <ChevronRight size={20} />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Read More Reviews Button */}
      <div className="google-reviews-footer">
        <a
          href={GOOGLE_BUSINESS_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="google-reviews-read-all-btn"
        >
          Read More Reviews
          <ExternalLink size={16} />
        </a>
      </div>
    </div>
  );
};

export default GoogleReviews;
