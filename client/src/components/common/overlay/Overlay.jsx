import React, { useEffect, useRef } from "react";
import './overlay.css'

const Overlay = (props) => {
    
    const { show, setShow, children } = props;
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
        <button className="overlay-close" onClick={()=> setShow(!show)}>
          ×
        </button>
        {children}
      </div>
    </div>
  );
};

export default Overlay;
