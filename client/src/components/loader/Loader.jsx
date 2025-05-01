import React from 'react';
import './loader.css';

export default function Loader({ size = 40, color = '#0167ff' }) {
    
    const loaderStyle = {
        width: `${size}px`,
        height: `${size}px`,
        borderColor: `${color} transparent ${color} transparent`
    };

    return (
        <div className="loader-container">
            <div className="loader" style={loaderStyle}></div>
        </div>
    );
}
