const jwt = require("jsonwebtoken")
const auth = (req,res,next) => {
    const authHeader = req.headers['authorization'] 
    if (authHeader == null) return res.status(401).json({ message: 'Authorization header missing' })
    jwt.verify(authHeader, Constant.ACCESS_TOKEN_SECRET,(err, user) =>
    {
        if (err) return res.status(403).json({ message: err.message });
        req.user = user;
        next()
  })
}

module.exports = auth