import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/error.js";
import { Application } from "../models/applicationSchema.js";

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

    const { name, email, phone, adress, resume, applicantId } = req.body;

    if (!name || !email || !phone || !adress || !applicantId) {
        return next(new ErrorHandler("Please provide required details!", 400));
    }

});