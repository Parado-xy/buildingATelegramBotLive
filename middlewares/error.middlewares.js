// Error handling middleware

const errorMiddleware = (err, req, res, next) => {
    // Log the error to the console
    console.error(`AN ERROR OCCURRED: ${err.stack || err}`);
    
    if (err) {
        const statusCode = err.status || err.statusCode || 500;
        const message = err.message || 'Internal Server Error';
        
        return res.status(statusCode).json({
            success: false,
            message: message,
            ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
        });
    }
    
    // If no error, continue to next middleware
    next();
};

export default errorMiddleware;