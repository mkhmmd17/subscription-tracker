const errorMiddleware = (err, req, res, next) => {
    try {
        let error = {...err};
        error.message = err.message;
        console.error(err);

        // Mongoose bad ObjectID
        if (err.name === 'CastError') {
            const message = 'Resource not found';
            error = new Error(message);
            error.status = 404;
        }

        // Mongoose duplicate key
        if (err.code === 11000) {
            const message = 'Duplicate field value entered';
            error = new Error(message);
            error.status = 400;
        }

        // Mongoose validation error
        if (err.name === 'ValidationError') {
            const message = Object.values(err.errors).map(val => val.message).join(', ');
            error = new Error(message);
            error.status = 400;
        }

        res.status(error.statusCode || 500).json({ success: false, error: error.message || 'Server Error'});

    } catch (error) {
        next(error);
    }
}

export default errorMiddleware;