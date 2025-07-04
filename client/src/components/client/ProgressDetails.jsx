import { useState, useEffect } from "react";
import PropTypes from 'prop-types';

function ProgressDetails({ progress, onSaveFeedback, userRole }) {
  const [schedule, setSchedule] = useState('');
  const [feedbackComments, setFeedbackComments] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (progress) {
      setSchedule(progress.schedule || '');
      setFeedbackComments(progress.comments || '');
      setCurrentImageIndex(0);
    }
  }, [progress]);

  if (!progress) {
    return <p>Select a progress item from the right column to review and give feedback.</p>;
  }

  const getImageUrl = (imagePath) => {
    try {
      new URL(imagePath);
      return imagePath;
    } catch {
      return `${import.meta.env.VITE_APP_IMAGE_URL}${imagePath}`;
    }
  };

  const handlePrev = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? (progress.images.length - 1) : prev - 1
    );
  };

  const handleNext = () => {
    setCurrentImageIndex((prev) =>
      prev === (progress.images.length - 1) ? 0 : prev + 1
    );
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSaveFeedback(schedule, feedbackComments);
    } catch (err) {
      console.error('Error during save:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const isTrainer = userRole === 'trainer';

  return (
    <div style={styles.container}>
      <div style={styles.imageContainer}>
        <img
          src={getImageUrl(progress.images[currentImageIndex])}
          alt={`Progress ${currentImageIndex + 1}`}
          style={styles.image}
        />
        <div style={styles.carouselButtons}>
          <button onClick={handlePrev} style={styles.carouselButton}>‹</button>
          <button onClick={handleNext} style={styles.carouselButton}>›</button>
        </div>
        <div style={styles.pagination}>
          {progress.images.map((_, index) => (
            <span
              key={index}
              style={{
                ...styles.dot,
                backgroundColor: currentImageIndex === index ? '#00b96b' : '#ccc',
              }}
            />
          ))}
        </div>
      </div>

      <div style={styles.descriptionContainer}>
        <h3 style={styles.title}>{progress.description}</h3>
        <p style={styles.date}>Date: {new Date(progress.createdAt).toLocaleDateString()}</p>
      </div>

      <div style={styles.commentSection}>
        <h4>Trainer Schedule</h4>
        <textarea
          value={schedule}
          onChange={(e) => setSchedule(e.target.value)}
          rows="2"
          placeholder="Schedule..."
          disabled={!isTrainer}
          style={{
            ...styles.textarea,
            backgroundColor: isTrainer ? '#fff' : '#f0f0f0',
            cursor: isTrainer ? 'text' : 'not-allowed'
          }}
        />
      </div>

      <div style={styles.commentSection}>
        <h4>Trainer Comments</h4>
        <textarea
          value={feedbackComments}
          onChange={(e) => setFeedbackComments(e.target.value)}
          rows="4"
          placeholder="Comments..."
          disabled={!isTrainer}
          style={{
            ...styles.textarea,
            backgroundColor: isTrainer ? '#fff' : '#f0f0f0',
            cursor: isTrainer ? 'text' : 'not-allowed'
          }}
        />
        {isTrainer && (
          <button
            onClick={handleSave}
            disabled={isSaving}
            style={{
              ...styles.button,
              backgroundColor: isSaving ? '#ccc' : '#00b96b',
              cursor: isSaving ? 'not-allowed' : 'pointer',
            }}
          >
            {isSaving ? 'Saving...' : 'Save Feedback'}
          </button>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: '10px',
    boxShadow: '0 0 10px rgba(0,0,0,0.1)',
    padding: '20px',
    fontFamily: 'Arial'
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    borderRadius: '10px',
    overflow: 'hidden',
    marginBottom: '10px'
  },
  image: {
    width: '100%',
    height: 'auto',
    borderRadius: '10px'
  },
  carouselButtons: {
    position: 'absolute',
    top: '50%',
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    transform: 'translateY(-50%)'
  },
  carouselButton: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    color: '#fff',
    border: 'none',
    fontSize: '24px',
    padding: '8px 16px',
    cursor: 'pointer',
    borderRadius: '50%'
  },
  pagination: {
    position: 'absolute',
    bottom: '10px',
    width: '100%',
    display: 'flex',
    justifyContent: 'center'
  },
  dot: {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    margin: '0 5px',
    transition: 'all 0.3s ease'
  },
  descriptionContainer: { marginTop: '10px' },
  title: { fontSize: '18px', margin: '5px 0' },
  date: { color: '#666', fontSize: '14px' },
  commentSection: { marginTop: '20px' },
  textarea: {
    width: '100%',
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid #ccc',
    marginBottom: '15px',
    fontSize: '14px'
  },
  button: {
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    padding: '10px 20px',
    fontWeight: 'bold'
  }
};

ProgressDetails.propTypes = {
  progress: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    images: PropTypes.arrayOf(PropTypes.string).isRequired,
    description: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
    schedule: PropTypes.string,
    comments: PropTypes.string,
  }),
  onSaveFeedback: PropTypes.func.isRequired,
  userRole: PropTypes.string.isRequired, // 'trainer' or 'user'
};

export default ProgressDetails;
