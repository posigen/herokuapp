module.exports = function(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    } else {
    	res.view('unauthorized');
        return res.send(403, { message: 'Not Authorized' });
    }
};