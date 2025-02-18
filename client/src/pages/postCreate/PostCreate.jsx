import { useState } from "react";
import { ImagePlus, RefreshCw, User, Calendar, Briefcase, Hash, X, Check, SendHorizontal, ChevronRight, ChevronLeft } from "lucide-react";
import { TfiThought } from "react-icons/tfi";
import { useNavigate } from "react-router-dom";
import { usePostStore } from "../../store/usePostStore";
import "./PostCreate.css";

const CreatePost = () => {
  const [media, setMedia] = useState([]); // Array to store multiple media files
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0); // Index of the currently displayed media
  const [description, setDescription] = useState(""); // State for post description
  const [tag, setTag] = useState("Personal"); // State for post tag
  const [endDate, setEndDate] = useState(""); // State for event end date
  const navigate = useNavigate();
  const { createPost, loading } = usePostStore(); // Destructure createPost and loading from the store

  const handleMediaUpload = (event) => {
    const files = Array.from(event.target.files); // Convert FileList to an array
    const mediaUrls = files.map(file => ({
      file, // Store the file object for upload
      url: URL.createObjectURL(file), // Create a preview URL
      type: file.type.startsWith("video") ? "video" : "image" // Determine if the file is a video or image
    }));
    setMedia([...media, ...mediaUrls]); // Add new media to the existing media array
  };

  const handleReload = () => {
    setMedia([]); // Clear all media
    setCurrentMediaIndex(0); // Reset the media index
  };

  const handleDiscard = () => {
    setDescription("");
    setTag("Personal");
    setMedia([]); // Clear all media
    setCurrentMediaIndex(0); // Reset the media index
  }

  const handleNextMedia = () => {
    setCurrentMediaIndex((prevIndex) => (prevIndex + 1) % media.length); // Move to the next media
  };

  const handlePreviousMedia = () => {
    setCurrentMediaIndex((prevIndex) => (prevIndex - 1 + media.length) % media.length); // Move to the previous media
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare the data to be sent to the backend
    const formData = new FormData();
    formData.append("description", description);
    formData.append("tag", tag);
    if (tag === "Event") {
      formData.append("endDate", endDate);
    }

    // Append media files to the FormData
    media.forEach((mediaItem, index) => {
      formData.append("media", mediaItem.file); // Append the file object
    });

    // Call the createPost function from the store
    await createPost(formData);

    // Reset the form after successful submission
    if (!loading) {
      setDescription("");
      setMedia([]);
      setTag("Personal");
      setEndDate("");
    }
  };

  return (
    <div className="createpost-container">
      <h2 className="createpost-title">Upload a New Post</h2>
      <div className="createpost-box">
        <div className="createpost-header">
          <TfiThought className="createpost-icon" />
          <span className="createpost-text">Write What's On Your Mind About This Post</span>
          <X className="createpost-close" onClick={() => navigate("/")} />
        </div>
        <textarea
          placeholder="Description of the post"
          className="createpost-textarea"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>
        <div className="createpost-media">
          <label className="createpost-upload">
            <ImagePlus /> Upload media
            <input type="file" accept="image/*,video/*" multiple onChange={handleMediaUpload} hidden />
          </label>
          {media.length > 0 && <RefreshCw className="createpost-refresh" onClick={handleReload} />}
        </div>
        {media.length > 0 && (
          <div className="createpost-media-display">
            {media.length > 1 && (
              <ChevronLeft className="createpost-navigate-left" onClick={handlePreviousMedia} />
            )}
            {media[currentMediaIndex].type === "video" ? (
              <video controls className="createpost-image" key={media[currentMediaIndex].url}>
                <source src={media[currentMediaIndex].url} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            ) : (
              <img src={media[currentMediaIndex].url} alt="Uploaded" className="createpost-image" key={media[currentMediaIndex].url} />
            )}
            {media.length > 1 && (
              <ChevronRight className="createpost-navigate-right" onClick={handleNextMedia} />
            )}
          </div>
        )}
        <div className="createpost-tags">
          <span className="createpost-tag"><Hash style={{ backgroundColor: "white", color: "black", borderRadius: "10%" }} /> Tag :</span>
          <span className="createpost-option checked" onClick={() => setTag("Personal")}>
            {tag === "Personal" && <div className="createpost-tick-button">
              <Check className="createpost-tick-icon" />
            </div>}
            <User /> Personal
          </span>
          <span className="createpost-option checked" onClick={() => setTag("Event")}>
            {tag === "Event" && <div className="createpost-tick-button">
              <Check className="createpost-tick-icon" />
            </div>}
            <Calendar /> Event</span>
          <span className="createpost-option checked" onClick={() => setTag("Job & Internship")}>
            {tag === "Job & Internship" && <div className="createpost-tick-button">
              <Check className="createpost-tick-icon" />
            </div>}
            <Briefcase /> Job & Internship</span>
        </div>
        <div className="createpost-footer">
          {tag === "Event" && <div className="createpost-date-container">
            <label className="createpost-date">End Date:
              <input type="date" className="createpost-dateinput" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            </label>
          </div>}
        </div>
        <div className="createpost-buttons">
          <button className="createpost-post" onClick={handleSubmit} disabled={loading}>
            {loading ? "Posting..." : "POST"} <SendHorizontal size={18} />
          </button>
          <button className="createpost-discard" onClick={handleDiscard} disabled={loading}>DISCARD</button>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;