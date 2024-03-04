import { catchAsyncError } from '../middlewares/catchAsyncError.js';
import ErrorHandler from '../middlewares/error.js';
import { Job } from '../models/jobSchema.js';


export const getAllJobs = catchAsyncError(async (req, res, next) => {
    const jobs = await Job.find({ expired: false });

    res.status(200).json({
        success: true,
        jobs
    });
});

export const postJob = catchAsyncError(async (req, res, next) => {
    const { role } = req.user;

    if (role === "Job Seeker") {
        return next(new ErrorHandler("Job Seeker not allowed to access this resource!", 400));
    }

    const { title, eligibility, experience, description, category, country, city, fixedSalary, salaryFrom, salaryTo } = req.body;

    if (!title || !eligibility || !experience || !description || !category || !country || !city) {
        return next(new ErrorHandler("Please provide all the required fields!", 400));
    }
    if ((!salaryFrom || !salaryTo) && !fixedSalary) {
        return next(new ErrorHandler("Please provide either ranged salary or a fixed salary!", 400));
    }
    if (salaryFrom && salaryTo && fixedSalary) {
        return next(new ErrorHandler("Please provide either ranged salary or a fixed salary!", 400));
    }

    const postedBy = req.user._id;

    const job = await Job.create({
        title, eligibility, experience, description, category, country, city, fixedSalary, salaryFrom, salaryTo, postedBy
    });

    res.status(200).json({
        success: true,
        message: "Job posted successfully!",
        job
    });
});

export const update = catchAsyncError(async (req, res, next) => {
    const { role } = req.user;

    if (role === "Job Seeker") {
        return next(new ErrorHandler("Job Seeker not allowed to access this resource!", 400));
    }

    const { id } = req.params;
    let job = await Job.findById(id);

    if (!job) {
        return next(new ErrorHandler("Oop's job not found!", 404));
    }

    job = await Job.findByIdAndUpdate(id, req.body, {
        new: true,
        findAndModify: false,
        runValidators: true
    });
    res.status(200).json({
        success: true,
        job,
        message: "Job updated successfully!"
    });
});

export const deleteJob = catchAsyncError(async (req, res, next) => {
    const { role } = req.user;

    if (!role) {
        return next(new ErrorHandler("Job Seeker is not allowed to access this resource!", 400));
    }

    const { id } = req.params;
    let job = await Job.findById(id);
    if (!job) {
        return next(new ErrorHandler("Oop's, Job not found!", 400));
    }
    await job.deleteOne();
    res.status(200).json({
        success: true,
        message: "Job deleted successfully!",
    });
});

export const getMyJobs = catchAsyncError(async (req, res, next) => {
    const { role } = req.user;

    if (!role) {
        return next(new ErrorHandler("Job Seeker is not allowed to access this resource!", 400));
    }

    const myjobs = await Job.find({ postedBy: req.user._id });

    res.status(200).json({
        success: true,
        myjobs,
        message: "Jobs fetched successfully!"
    });
});