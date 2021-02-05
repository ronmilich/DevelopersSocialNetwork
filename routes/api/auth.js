const express = require('express')
const router = express.Router()
const auth = require('../../middleware/auth')
const User = require('../../models/User')
const { check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const config = require('config')

const registerValidators = [
    check('email', 'Please include valid email address').isEmail(),
    check('password', 'Password is required').exists()
]

// @router GET api/auth
// @desc authenticate user route
// @access Public
router.get('/', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password')
        return res.json(user)
    } catch (error) {
        console.error(error.message)
        return res.status(500).send('An Error Ocurred!!!')
    }
})


// @router POST api/auth
// @desc Authenticate user & get token
// @access Public
router.post('/', registerValidators, async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { email, password } = req.body

    try {
        let user = await User.findOne({ email })

        if (!user) return res.status(400).json({ errors: [{ msg: 'Invalid credatials' }] });

        const isMatch = await bcrypt.compare(password, user.password)

        if (!isMatch) return res.status(400).json({ errors: [{ msg: 'Invalid credatials' }] });

        const payload = {
            user: {
                id: user.id
            }
        }

        jwt.sign(payload, config.get('jwtSecret'), { expiresIn: 360000 }, (err, token) => {
            if (err) throw err;
            return res.status(200).json({ token })
        })
    } catch (err) {
        console.log(err.message)
        return res.status(500).send('Server error')
    }
})

module.exports = router