import React, { useState, useRef } from "react";
import Picker from "emoji-picker-react";
import "./EmojiPicker.css";

const EmojiPicker = ({ message, setMessage }) => {
  
  // Handle emoji selection
  const onEmojiClick = (emojiData) => {
    if (emojiData && emojiData.emoji) {
      setMessage((prev) => prev + emojiData.emoji);
    }
  };

  return (
    <div className="emoji-picker">
      <Picker onEmojiClick={onEmojiClick} />
    </div>
  );
};

export default EmojiPicker;
