import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
    windowMs: 1000 * 3, // 3 seconds
    max: 2, // Limit each IP to 2 requests per windowMs
    message: 'Too many requests from this IP, please try again later.', // Custom message
});

export default limiter;