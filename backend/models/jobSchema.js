import mongoose from "mongoose";

const jobSchema = mongoose.Schema({
    title: {
        type: String,
        required: [true, "Please provide title!"],
        minLength: [3, "Title must be atleast 3 character long!"],
        maxLength: [30, "Title cannot be atmost 30 character long!"]
    },
    eligibility: {
        type: String,
        required: [true, "Please provide eligibility criteria!"],
        minLength: [10, "Eligibility should be atleast 10 character long!"],
        maxLenght: [30, "Eligibility cannot exceed 30 characters!"]
    },
    description: {
        type: String,
        required: [true, "Please specify description about job role!"],
        minLength: [50, "Desciption should be atleast 50 characters long!"],
        maxLenght: [500, "Description cannot exceed 500 characters!"]
    },
    experience: {
        type: String,
        required: [true, "Please provide experience details!"],
    },
    fixedSalary: {
        type: Number,
        minLength: [4, "Salary should be atleast 4 digits long!"],
        maxLenght: [9, "Salary should be atmost 9 digits long!"]
    },
    salaryFrom: {
        type: Number,
        minLength: [4, "SalaryFrom should be atleast 4 digits long!"],
        maxLenght: [9, "SalaryFrom should be atmost 9 digits long!"]
    },
    salaryTo: {
        type: Number,
        minLength: [4, "SalaryTo should be atleast 4 digits long!"],
        maxLenght: [9, "SalaryTo should be atmost 9 digits long!"]
    },
    category: {
        type: String,
        required: [true, "Please provide job category!"]
    },
    country: {
        type: String,
        required: [true, "Please specify country!"]
    },
    city: {
        type: String,
        required: [true, "Please specify city!"]
    },
    expired: {
        type: Boolean,
        default: false
    },
    jobPosted: {
        type: Date,
        default: Date.now
    },
    postedBy: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true
    }
});

export const Job = mongoose.model("Job", jobSchema);