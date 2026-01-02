import React, { useState, useEffect } from 'react';
import { Star, ChevronLeft, ChevronRight, ExternalLink, CheckCircle } from 'lucide-react';
import '../globe.css';

const GoogleReviews = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Configuration - Update these with your actual data
  const AVERAGE_RATING = 4.9;
  const TOTAL_REVIEWS = 681;
  const GOOGLE_BUSINESS_URL = 'https://www.google.com/maps/place/Your+Business+Name';

  // Sample reviews - Replace with real data from Google Places API
  const reviews = [
    {
      id: 1,
      name: 'Johnny Ho',
      profileImage: 'https://via.placeholder.com/40',
      date: '2 days ago',
      rating: 5,
      text: 'The cleaners from Call the Cleaners were very professional, polite and timely. They left no spot left uncleaned, especially the bathroom and kitchen. Everything was placed back in its original place. Couldn\'t have done a better job myself.',
      fullText: 'The cleaners from Call the Cleaners were very professional, polite and timely. They left no spot left uncleaned, especially the bathroom and kitchen. Everything was placed back in its original place. Couldn\'t have done a better job myself.'
    },
    {
      id: 2,
      name: 'Eugene Shcherban',
      profileImage: 'https://via.placeholder.com/40',
      date: '2 days ago',
      rating: 5,
      text: 'All went fine. Great service!',
      fullText: 'All went fine. Great service!'
    },
    {
      id: 3,
      name: 'Áine Hamilton',
      profileImage: 'https://via.placeholder.com/40',
      date: '2 days ago',
      rating: 5,
      text: 'We were very happy with the service provided by call the cleaners, they were friendly efficient and reasonably priced. We get a regular fortnightly clean. Would recommend their services.',
      fullText: 'We were very happy with the service provided by call the cleaners, they were friendly efficient and reasonably priced. We get a regular fortnightly clean. Would recommend their services.'
    },
    {
      id: 4,
      name: 'Daniel Eyre',
      profileImage: 'https://via.placeholder.com/40',
      date: '3 days ago',
      rating: 5,
      text: 'Very nice clean. Good job.',
      fullText: 'Very nice clean. Good job.'
    },
    {
      id: 5,
      name: 'Lisa Schaup',
      profileImage: 'https://via.placeholder.com/40',
      date: '4 days ago',
      rating: 5,
      text: 'We used Call the Cleaners for our end-of-lease clean in Randwick and couldn\'t be happier with the service — communication was great and we got our full bond back.',
      fullText: 'We used Call the Cleaners for our end-of-lease clean in Randwick and couldn\'t be happier with the service — communication was great and we got our full bond back.'
    },
  ];

  const maxVisible = 3; // Show 3 cards at a time on desktop
  const maxIndex = Math.max(0, reviews.length - maxVisible);

  // Auto-play carousel
  useEffect(() => {
    if (!isAutoPlaying || reviews.length <= maxVisible) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        if (prev >= maxIndex) {
          return 0; // Loop back to start
        }
        return prev + 1;
      });
    }, 6000); // Change every 6 seconds

    return () => clearInterval(interval);
  }, [isAutoPlaying, maxIndex, reviews.length]);

  const nextReview = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  const prevReview = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  const truncateText = (text, maxLength = 150) => {
    if (text.length <= maxLength) return { text, isTruncated: false };
    return { text: text.substring(0, maxLength) + '...', isTruncated: true };
  };

  const visibleReviews = reviews.slice(currentIndex, currentIndex + maxVisible);
  
  // Fill remaining slots if needed
  while (visibleReviews.length < maxVisible && reviews.length > 0) {
    visibleReviews.push(reviews[visibleReviews.length % reviews.length]);
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
            Based on <strong>{TOTAL_REVIEWS}</strong> reviews
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
            {reviews.map((review) => {
              const { text: displayText, isTruncated } = truncateText(review.text);
              
              return (
                <div key={review.id} className="google-review-card">
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
                        src={review.profileImage} 
                        alt={review.name}
                        className="google-review-avatar"
                      />
                    </div>
                    <div className="google-review-author">
                      <div className="google-review-name">{review.name}</div>
                      <div className="google-review-date">{review.date}</div>
                    </div>
                  </div>

                  <div className="google-review-rating">
                    {[...Array(review.rating)].map((_, i) => (
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
          {reviews.length > maxVisible && (
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
