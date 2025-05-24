import React, { useEffect, useRef } from "react";
import './overlay.css'

const Overlay = (props) => {
    const { show, setShow, children, heading, subheading } = props;
    const boxRef = useRef();
    
    //closing the component on click outside
    useEffect(() => {
        // eslint-disable-next-line no-unused-vars
        const handleClickOutside = (event) => {
            if (boxRef.current && !boxRef.current.contains(event.target)) {
                setShow(!show);
            }
        };
        
        if (show) document.addEventListener("mousedown", handleClickOutside);
        
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [setShow, show]);
    
    if (!show) return null;

  return (
    <div className="overlay">
      <div className="overlay-item" ref={boxRef}>
        {/* Overlay header row: heading and close button, perfectly aligned */}
        {(heading || subheading) && (
          <div className="overlay-header-row">
            <div className="overlay-header-texts">
              {heading && <h2 className="overlay-title">{heading}</h2>}
              {subheading && <p className="overlay-subtitle">{subheading}</p>}
            </div>
            <button className="overlay-close-btn" onClick={()=> setShow(!show)} title="Close">×</button>
          </div>
        )}
        {children}
      </div>
    </div>
  );
};

export default Overlay;
