const jwt = require('jsonwebtoken')
const config = require('config')

module.exports = function (req, res, next) {
    // Get token from header
    const token = req.header('x-auth-token')

    // check if no token
    if (!token) return res.status(401).json({ msg: 'Not Token, Unauthorized' })

    try {
        const decoded = jwt.verify(token, config.get('jwtSecret'))

        req.user = decoded.user // add user property to the request
        next()
    } catch (error) {
        return res.status(401).json({ msg: 'Token is not valid' })
    }
}