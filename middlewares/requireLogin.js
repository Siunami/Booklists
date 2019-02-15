module.exports = (req, res, next) => {
	if (!req.user){
		return res.status(401).send({ error: 'You must login!' });
	}
	// If everything is okay, then allow this request to continue on through server
	next();
};