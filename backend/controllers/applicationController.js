import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/error.js";
import { Application } from "../models/applicationSchema.js";
import cloudinary from 'cloudinary';
import { Job } from "../models/jobSchema.js";

export const employeeGetAllApplications = catchAsyncError(async (req, res, next) => {
    const { role } = req.user;

    if (role === "Job Seeker") {
        return next(new ErrorHandler("Job Seeker is not allowed to access this resource!", 400));
    }

    const { _id } = req.user;
    const applications = await Application.find({ 'employeeID.user': _id });
    res.status(200).json({
        success: true,
        applications
    });
});

export const jobSeekerGetAllApplications = catchAsyncError(async (req, res, next) => {
    const { role } = req.user;

    if (role === "Employee") {
        return next(new ErrorHandler("Employee is not allowed to access this resource!", 400));
    }

    const { _id } = req.user;
    const applications = await Application.find({ 'applicantID.user': _id });
    res.status(200).json({
        success: true,
        applications
    });
});

export const jobSeekerDeleteApplication = catchAsyncError(async (req, res, next) => {
    const { role } = req.user;

    if (role === "Employee") {
        return next(new ErrorHandler("Employee is not allowed to access this resource!", 400));
    }

    const { id } = req.params;
    const application = await Application.findById(id);
    await application.deleteOne();
    res.status(200).json({
        success: true,
        message: "Application deleted successfully!"
    });
});

export const applyForjob = catchAsyncError(async (req, res, next) => {
    const { role } = req.user;

    if (role === "Employee") {
        return next(new ErrorHandler("Employee is not allowed to apply for the job!", 400));
    }

    if (!req.files || Object.keys(req.files).length == 0) {
        return next(new ErrorHandler("Resume file required"));
    }

    const { resume } = req.files;
    const allowdFormats = ["image/png", "image/jpg", "image/webp"];
    if (!allowdFormats.includes(resume.mimetype)) {
        return next(new ErrorHandler("Invalid file type, Please upload your resume in a png, jpg, or a webp format.", 400));
    }

    const cloudinaryResponse = await cloudinary.uploader.upload(resume.tempFilePath);
    if (!cloudinaryResponse || cloudinaryResponse.error) {
        console.error("Cloudinary error", cloudinaryResponse.error || "Unknown cloudinary error");
        return next(new ErrorHandler("Failed to upload resume.", 500));
    }

    const { name, email, phone, adress, jobId } = req.body;
    const applicantID = {
        user: req.user._id,
        role: "Job Seeker"
    };

    if (!jobId) {
        return next(new ErrorHandler("Job not found!", 404));
    }

    const jobDetails = await Job.findById(jobId);
    if (!jobDetails) {
        return next(new ErrorHandler("Job not found!", 404));
    }

    const employeeID = {
        user: jobDetails.postedBy,
        role: "Employee"
    };
    if (!name || !email || !phone || !adress || !applicantID || !resume || !employeeID) {
        return next(new ErrorHandler("Please provide required details!", 400));
    }
    const application = await Application.create({
        name, email, phone, adress, jobId, applicantID, employeeID, resume: {
            public_id: cloudinaryResponse.public_id,
            url: cloudinaryResponse.secure_url
        }
    });

    res.status(200).json({
        success: true,
        message: "Application submitted!",
        application
    })
});