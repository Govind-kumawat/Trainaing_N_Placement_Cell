import mongoose from "mongoose";
import validator from "validator";
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please provide full name!"],
        minLength: [3, "Name must contain 3 character!"],
        maxLenght: [30, "Name cannot exceed 30 characters!"]
    },
    email: {
        type: String,
        required: [true, "Please provide your email!"],
        validate: [validator.isEmail, "Please provide valid email!"]
    },
    phone: {
        type: Number,
        required: [true, "Please provide phone number!"]
    },
    password: {
        type: String,
        required: [true, "Please provide password!"],
        minLength: [8, "Password must be minimum 8 characters"],
        maxLenght: [15, "Password cannot be more than 15 characters"],
        select: false
    },
    role: {
        type: String,
        required: [true, "Please provide your role"],
        enum: ["Job Seeker", "Employee"]
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

//Hashing the password
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    this.password = await bcrypt.hash(this.password, 10);
})

//Comparing the password
userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
}

//Generating jwt token
userSchema.methods.getJwtToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, { expiresIn: process.env.JWT_EXPIRE });
}

export const User = mongoose.model("User", userSchema);