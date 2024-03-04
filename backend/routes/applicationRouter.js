import express from 'express';
import { employeeGetAllApplications, jobSeekerDeleteApplication, jobSeekerGetAllApplications } from '../controllers/applicationController.js';
import { isAuthorized } from '../middlewares/auth.js';

const router = express.Router();

router.get('/egetallapplication', isAuthorized, employeeGetAllApplications);
router.get('/jgetallapplication', isAuthorized, jobSeekerGetAllApplications);
router.delete('/deleteapplication/:id', isAuthorized, jobSeekerDeleteApplication);

export default router;