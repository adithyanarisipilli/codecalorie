import express from 'express';
import { verifyToken } from '../utils/verifyUser.js';
import { createProblem, deleteProblem, getProblems, updateProblem } from '../controllers/problem.controller.js';

const router = express.Router();

router.post('/create', verifyToken, createProblem);
router.get('/getproblems', getProblems);
router.delete('/deleteproblem/:problemId/:userId', verifyToken, deleteProblem);
router.put('/updateproblem/:problemId/:userId', verifyToken, updateProblem);

export default router;
