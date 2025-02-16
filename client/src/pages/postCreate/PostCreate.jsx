import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faRotateRight, faXmark } from "@fortawesome/free-solid-svg-icons";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "./PostCreate.css";

const PostCreate = () => {
  const [postContent, setPostContent] = useState("");
  const [image, setImage] = useState(null);
  const [selectedTag, setSelectedTag] = useState("Personal");
  const [endDate, setEndDate] = useState("");

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };

  const handleTagChange = (tag) => {
    setSelectedTag(tag);
  };

  const handlePostSubmit = () => {
    console.log({
      postContent,
      image,
      selectedTag,
      endDate: selectedTag === "Event" ? endDate : null,
    });
  };

  return (
    <div className="post-create-body">
      <h3>Upload a New Post</h3>
    <div className="post-create">

      <ReactQuill
        value={postContent}
        onChange={setPostContent}
        placeholder="Write your post here..."
        modules={{
          toolbar: [["bold", "italic", "underline"], ["link"], [{ list: "ordered" }, { list: "bullet" }], ["clean"]],
        }}
      />

      <div className="upload-section">
        <label className="upload-btn">
          <input type="file" accept="image/*" onChange={handleImageUpload} hidden />
          <FontAwesomeIcon icon={faPlus} /> Upload Media
        </label>
        <FontAwesomeIcon icon={faRotateRight} className="refresh-icon" />

        {image && <img src={image} alt="Uploaded Preview" className="preview-img" />}
      </div>

      <div className="tags-section">
        <span>Tag :</span>
        {["Personal", "Event", "Job & Internship"].map((tag) => (
          <button
            key={tag}
            className={`tag-btn ${selectedTag === tag ? "active" : ""}`}
            onClick={() => handleTagChange(tag)}
          >
            {tag}
          </button>
        ))}
      </div>

      {selectedTag === "Event" && (
        <div className="date-picker">
          <label>End Date:</label>
          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
        </div>
      )}

      <div className="post-footer">
        <button className="discard-btn">DISCARD</button>
        <button className="post-btn" onClick={handlePostSubmit}>POST</button>
      </div>
    </div>
    </div>
  );
};

export default PostCreate;
