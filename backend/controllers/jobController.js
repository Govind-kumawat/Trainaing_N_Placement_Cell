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
        return next(new ErrorHandler("Job Seeker not allowed to post a job!", 400));
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
    })
})