const express = require('express')
const router = express.Router() // for putting routes in other directory
const User = require('../../models/User')
const gravatar = require('gravatar')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('config')
const { check, validationResult } = require('express-validator');

const registerValidators = [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include valid email address').isEmail(),
    check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 })
]

// @router POST api/users
// @desc Register user
// @access Public
router.post('/', registerValidators, async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    const { name, email, password } = req.body

    try {
        let user = await User.findOne({ email })

        if (user) return res.status(400).json({ errors: [{ msg: 'User already exist' }] });

        const avatar = gravatar.url(email, { s: '200', r: 'pg', d: 'mm' })

        user = new User({ name, email, password, avatar })

        const salt = await bcrypt.genSalt(10)
        user.password = await bcrypt.hash(password, salt)

        await user.save()
        const payload = {
            user: {
                id: user.id
            }
        }

        jwt.sign(payload, config.get('jwtSecret'), { expiresIn: 360000 }, (err, token) => {
            if (err) throw err;
            return res.json({ token })
        })
    } catch (err) {
        console.log(err.message)
        return res.status(500).send('Server error')
    }
})

module.exports = router