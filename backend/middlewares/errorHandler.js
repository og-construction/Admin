const notFound = (req, res, next) => {
    const error = new Error(`Not found: ${req.originalUrl}`);
    res.status(404);
    next(error);
};

const errorHandler = (err, req, res, next) => {
    console.error(err); // Log the error for debugging

    let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    
    // Customize the response for specific errors if needed
    if (err.name === 'ValidationError') {
        statusCode = 400;
    } else if (err.name === 'MongoServerError') {
        statusCode = 409; // Conflict
    }

    res.status(statusCode).json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
};

module.exports = { notFound, errorHandler };
