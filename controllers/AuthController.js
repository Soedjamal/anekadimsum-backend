const User = require("../models/User")
const jwt = require("jsonwebtoken")

const generateToken = (id, name) => {
    return jwt.sign({ id, name }, process.env.JWT_SECRET, {
        expiresIn: "1h"
    })
}

exports.signIn = async (req, res) => {
    const { email, password } = req.body

    try {
        const user = await User.findOne({ email })

        if (!user) {
            return res.status(401).json({
                message: "User not register"
            })
        }

        if (user.password !== password) {
            return res.status(401).json({
                message: "invalid email or password"
            })
        }

        res.json({
            _id: user.id,
            name: user.name,
            role: user.role,
            email: user.email,
            token: generateToken(user._id, user.name)
        })

    } catch (error) {
        res.status(500).json({ message: error })
    }
}