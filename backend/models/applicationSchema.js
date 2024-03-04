import mongoose from "mongoose";
import validator from "validator";

const applicationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please provide your name!"],
        minLength: [3, "Name must be atleast 3 char!"],
        maxLength: [30, "Name cannot exceed 30 char!"]
    },
    email: {
        type: String,
        required: [true, "Please provide your email!"],
        validate: [validator.isEmail, "Please enter a valid email!"]
    },
    phone: {
        type: Number,
        required: [true, "Please enter your phone number!"]
    },
    adress: {
        type: String,
        required: [true, "Please provide your adress!"]
    },
    resume: {
        public_id: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        }
    },
    applicantID: {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        role: {
            type: String,
            required: true,
            enum: "Job Seeker"
        }
    },
    employeeID: {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        role: {
            type: String,
            required: true,
            enum: "Employee"
        }
    }
});

export const Application = mongoose.model("Application", applicationSchema);