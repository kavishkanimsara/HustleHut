import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import axios from "axios";

function ProgressDetails({ progress, onSaveFeedback, userRole }) {
  const [schedule, setSchedule] = useState("");
  const [feedbackComments, setFeedbackComments] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (progress) {
      setSchedule(progress.schedule || "");
      setFeedbackComments(progress.comments || "");
      setCurrentImageIndex(0);
    }
  }, [progress]);

  if (!progress) {
    return (
      <div className="flex h-64 items-center justify-center text-gray-400">
        <p className="text-center">
          Select a progress item from the right column to review and give
          feedback.
        </p>
      </div>
    );
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
      prev === 0 ? progress.images.length - 1 : prev - 1,
    );
  };

  const handleNext = () => {
    setCurrentImageIndex((prev) =>
      prev === progress.images.length - 1 ? 0 : prev + 1,
    );
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await axios.put(
        `/coach/progress/${progress.id}/feedback`,
        {
          schedule,
          comments: feedbackComments,
        },
        {
          withCredentials: true,
        },
      );

      // Call the parent callback if provided
      if (onSaveFeedback) {
        await onSaveFeedback(schedule, feedbackComments);
      }

      console.log("Feedback saved successfully:", response.data);
    } catch (err) {
      console.error("Error saving feedback:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const isTrainer = userRole === "COACH";

  return (
    <div className="w-full rounded-lg border border-slate-700 bg-slate-900 p-4 md:p-6">
      {/* Image Carousel */}
      <div className="relative mb-4 w-full overflow-hidden rounded-lg">
        <img
          src={getImageUrl(progress.images[currentImageIndex])}
          alt={`Progress ${currentImageIndex + 1}`}
          className="h-48 w-full rounded-lg object-cover md:h-64"
        />

        {/* Carousel Navigation Buttons */}
        {progress.images.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-2 top-1/2 -translate-y-1/2 transform rounded-full border-none bg-black/50 p-2 text-2xl text-white transition-colors hover:bg-black/70"
            >
              ‹
            </button>
            <button
              onClick={handleNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 transform rounded-full border-none bg-black/50 p-2 text-2xl text-white transition-colors hover:bg-black/70"
            >
              ›
            </button>
          </>
        )}

        {/* Pagination Dots */}
        {progress.images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 transform space-x-2">
            {progress.images.map((_, index) => (
              <span
                key={index}
                className={`h-2 w-2 rounded-full transition-all duration-300 ${
                  currentImageIndex === index ? "bg-purple-400" : "bg-gray-400"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Description */}
      <div className="mb-6">
        <h3 className="mb-2 text-lg font-semibold text-purple-400 md:text-xl">
          {progress.description}
        </h3>
        <p className="text-sm text-gray-400">
          Date: {new Date(progress.createdAt).toLocaleDateString()}
        </p>
      </div>

      {/* Trainer Schedule */}
      <div className="mb-6">
        <h4 className="mb-2 font-semibold text-purple-400">Trainer Schedule</h4>
        {schedule && <p className="mb-2 text-sm text-gray-400">{schedule}</p>}
        {isTrainer && (
          <textarea
            value={schedule}
            onChange={(e) => setSchedule(e.target.value)}
            rows="2"
            placeholder="Schedule..."
            className="w-full cursor-text resize-none rounded-lg border border-slate-700 bg-slate-800 p-3 text-purple-400 transition-colors hover:border-slate-600 focus:border-purple-400 focus:outline-none"
          />
        )}
      </div>

      {/* Trainer Comments */}
      <div className="mb-6">
        <h4 className="mb-2 font-semibold text-purple-400">Trainer Comments</h4>
        {feedbackComments && (
          <p className="mb-2 text-sm text-gray-400">{feedbackComments}</p>
        )}
        {isTrainer && (
          <textarea
            value={feedbackComments}
            onChange={(e) => setFeedbackComments(e.target.value)}
            rows="4"
            placeholder="Comments..."
            disabled={!isTrainer}
            className={`w-full resize-none rounded-lg border border-slate-700 bg-slate-800 p-3 text-purple-400 transition-colors focus:border-purple-400 focus:outline-none ${
              isTrainer
                ? "cursor-text hover:border-slate-600"
                : "cursor-not-allowed opacity-60"
            }`}
          />
        )}

        {isTrainer && (
          <button
            onClick={handleSave}
            disabled={isSaving}
            className={`mt-3 rounded-lg px-6 py-2 font-semibold text-white transition-colors ${
              isSaving
                ? "cursor-not-allowed bg-gray-600"
                : "cursor-pointer bg-purple-600 hover:bg-purple-700"
            }`}
          >
            {isSaving ? "Saving..." : "Save Feedback"}
          </button>
        )}
      </div>
    </div>
  );
}

ProgressDetails.propTypes = {
  progress: PropTypes.shape({
    id: PropTypes.string.isRequired,
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
