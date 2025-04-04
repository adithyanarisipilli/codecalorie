import express from 'express';
import { verifyToken } from '../utils/verifyUser.js';
import { create, deleteproblem, getproblems, updateproblem,getProblemById } from '../controllers/problem.controller.js';

const router = express.Router();

router.post('/create', verifyToken, create);
router.get('/getproblems', getproblems);
router.get('/:problemId', getProblemById); 
router.delete('/deleteproblem/:problemId/:userId', verifyToken, deleteproblem);
router.put('/updateproblem/:problemId/:userId', verifyToken, updateproblem);

export default router;
