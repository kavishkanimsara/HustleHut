import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import DialogBox from "./DialogBox.jsx";
import { useSelector } from "react-redux";

function ProgressForm() {
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [previews, setPreviews] = useState([]);
  const [showDialog, setShowDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);

  // Load BMI data on mount if user exists

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
    const filePreviews = files.map((file) => URL.createObjectURL(file));
    setPreviews(filePreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (images.length === 0) {
      setDialogMessage("Please select at least one image");
      setShowDialog(true);
      return;
    }

    try {
      setLoading(true);
      const userId = user?.email;
      if (!userId) throw new Error("User not logged in.");

      const formData = new FormData();
      formData.append("description", description);
      images.forEach((img) => formData.append("images", img));

      await axios.post("/client/progress", formData, {
        withCredentials: true,
      });

      setDialogMessage("✅ Progress uploaded successfully!");
      setDescription("");
      setImages([]);
      setPreviews([]);
      e.target.reset();
    } catch (err) {
      setDialogMessage(
        "❌ Upload failed: " + (err.response?.data?.message || err.message),
      );
    } finally {
      setLoading(false);
      setShowDialog(true);
    }
  };

  const handleHistoryClick = () => {
    navigate("/client/progress/history");
  };

  return (
    <div className="flex w-full flex-col-reverse items-center justify-center gap-4 bg-slate-900 py-8 text-purple-400">
      <div className="mb-4 flex justify-end">
        <button
          type="button"
          onClick={handleHistoryClick}
          className="rounded border border-purple-400 bg-slate-800 px-4 py-2 font-bold text-purple-400 transition-colors hover:bg-purple-700 hover:text-white"
        >
          Progress History
        </button>
      </div>
      <div className="w-full max-w-lg rounded-lg border border-slate-700 bg-slate-900 p-8 shadow-xl shadow-slate-700/10">
        <h2 className="mb-8 text-center text-2xl font-bold text-purple-400">
          📋 Upload Progress
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div>
            <label className="mb-2 block font-semibold text-purple-400">
              Description
            </label>
            <textarea
              rows="4"
              maxLength="500"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Write your description..."
              className="w-full resize-none rounded border border-slate-700 bg-slate-900 px-3 py-2 text-purple-400 focus:border-purple-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-2 block font-semibold text-purple-400">
              Upload Images
            </label>
            <div className="flex justify-center">
              <label className="flex w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-700 bg-slate-800 p-6 transition-colors hover:border-purple-400">
                {previews.length > 0 ? (
                  <div className="flex flex-wrap justify-center gap-2">
                    {previews.map((src, index) => (
                      <img
                        key={index}
                        src={src}
                        alt="Preview"
                        className="max-h-40 max-w-full rounded-md border border-slate-700 object-contain"
                      />
                    ))}
                  </div>
                ) : (
                  <>
                    <div className="mb-2 text-4xl">📤</div>
                    <div className="font-bold text-purple-400">
                      Click or drag images here
                    </div>
                    <div className="mt-1 text-xs text-gray-400">
                      JPG, PNG, or GIF formats supported
                    </div>
                  </>
                )}
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          <button
            type="submit"
            className={`rounded bg-purple-600 px-4 py-2 font-bold text-white transition-colors hover:bg-purple-700 ${loading ? "cursor-not-allowed opacity-60" : ""}`}
            disabled={loading}
          >
            {loading ? "Uploading..." : "Submit"}
          </button>
        </form>
        {showDialog && (
          <DialogBox
            message={dialogMessage}
            onClose={() => setShowDialog(false)}
          />
        )}
      </div>
    </div>
  );
}

export default ProgressForm;
