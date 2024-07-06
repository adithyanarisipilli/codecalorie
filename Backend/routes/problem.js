import express from 'express';
const router = express.Router();
import Problem from '../models/problem.model.js'; // Adjust this based on your model setup

// GET /backend/problem/getproblems/:problemId
router.get('/getproblems', async (req, res) => {
  const {problemId} = req.query;
  try {
    const problem = await Problem.findOne({problemId}); // Example assuming Mongoose for MongoDB

    if (!problem) {
      return res.status(404).json({ error: 'Problem not found' });
    }

    res.json({ problem });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
