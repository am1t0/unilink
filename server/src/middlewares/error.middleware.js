// errorHandler.js
const handleError = (err, req, res, next) => {
    const { statusCode, message, success, error } = err;
    res.status(statusCode || 500).json({
        success: success || false,
        statusCode: statusCode || 500,
        message: message || "Internal Server Error",
        error: error || []
    });
};

export default handleError;
