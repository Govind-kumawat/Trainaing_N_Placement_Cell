import express from 'express';
import { deleteJob, getAllJobs, postJob, update } from '../controllers/jobController.js';
import { isAuthorized } from '../middlewares/auth.js';

const router = express.Router();

router.get('/getall', getAllJobs);
router.post('/post', isAuthorized, postJob);
router.put('/update/:id', isAuthorized, update);
router.delete('/delete/:id', isAuthorized, deleteJob);

export default router;