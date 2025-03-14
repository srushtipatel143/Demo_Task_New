const errorHandler = require("../helpers/errors/errorHandler");
const User = require("../models/usermodel");
const bcrypt = require("bcrypt");
const { sendToken } = require("../helpers/jwtToken/tokenHelper");

const signup = async (req, res, next) => {
    try {
        const data = req.body;
        let savedUser;
        const IsAvailableUser = await User.findOne({ email: data.email });
        if (!IsAvailableUser) {
            const newUser = new User(data);
            savedUser = await newUser.save();
            sendToken(savedUser, 201, res);
        }
        else {
            const isMatchPwd = await bcrypt.compare(data.password, IsAvailableUser.password);
            if (!isMatchPwd) {
                return res.status(401).json({ message: "Invalid password" })
            }
            sendToken(IsAvailableUser, 201, res);
        }
    } catch (error) {
        return next(new errorHandler("Database error", 500, error));
    }
};


const signIn = async (req, res, next) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(404).json({
                message: "User is not registered",
            });
        }
        sendToken(user, 201, res);
    } catch (error) {
        return next(new errorHandler("Database error", 500, error));
    }
};



module.exports = { signup, signIn };