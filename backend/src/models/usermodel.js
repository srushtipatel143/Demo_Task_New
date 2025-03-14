const mongoose = require("mongoose");
const emailValidator = require("email-validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        require: true,
        validate: {
            validator: (value) => emailValidator.validate(value),
            message: (props) => `${props.value} is not valid email`
        }
    },
    password: {
        type: String,
        require: true,
        min: [6, "Password must have atleat 6 characters"],
        trim: true,
    },
    role: {
        type: String,
        require: true,
        enum: {
            values: ["admin","user"],
            message: "{VALUE} is not supported role",
        },
        default: "user"
    },
    isDelete: {
        type: Boolean,
        default: false
    },
},
    { timestamps: true }
);
userSchema.methods.generateJWTFromUser = function () {
    const { JWT_SECRET_KEY, JWT_EXPIRE } = process.env;
    payload = {
        id: this._id,
        email: this.email,
        role:this.role
    }
    const token = jwt.sign(payload, JWT_SECRET_KEY, {
        expiresIn: JWT_EXPIRE
    })
    return token;
}

userSchema.pre("save", async function (next) {
    if (this.password) {
        const salt = await bcrypt.genSalt(12);
        this.password = await bcrypt.hash(this.password, salt);
    }
    next();
});


module.exports = mongoose.model("UserCollection", userSchema);
