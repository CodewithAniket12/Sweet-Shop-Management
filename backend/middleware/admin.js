export default function(req, res, next) {
    // req.user is set by the auth middleware which runs before this one
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ msg: 'Access denied: Admin role required.' });
    }
};