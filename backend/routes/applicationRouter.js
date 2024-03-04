import express from 'express';
import { applyForjob, employeeGetAllApplications, jobSeekerDeleteApplication, jobSeekerGetAllApplications } from '../controllers/applicationController.js';
import { isAuthorized } from '../middlewares/auth.js';

const router = express.Router();

router.get('/employee/getall', isAuthorized, employeeGetAllApplications);
router.get('/jobseeker/getall', isAuthorized, jobSeekerGetAllApplications);
router.delete('/jobseeker/delete/:id', isAuthorized, jobSeekerDeleteApplication);
router.post('/jobseeker/apply', isAuthorized, applyForjob);

export default router;