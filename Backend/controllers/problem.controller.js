import Problem from '../models/problem.model.js';
import { errorHandler } from '../utils/error.js';

export const createProblem = async (req, res, next) => {
  try {
    if (!req.user.isAdmin) {
      return next(errorHandler(403, 'You are not allowed to create a problem'));
    }
  
    const { title, rating, description, testCases, constraints, image } = req.body;
  
    if (!title || !rating || !description || !testCases || !constraints) {
      return next(errorHandler(400, 'Please provide all required fields'));
    }
  
    if (!Array.isArray(testCases) || testCases.length === 0) {
      return next(errorHandler(400, 'Please provide at least one test case'));
    }
  
    for (const testCase of testCases) {
      if (!testCase.input || !testCase.output) {
        return next(errorHandler(400, 'Each test case must have an input and an output'));
      }
    }
  
    const slug = title
      .split(' ')
      .join('-')
      .toLowerCase()
      .replace(/[^a-zA-Z0-9-]/g, '');
  
    const newProblem = new Problem({
      title,
      rating,
      description,
      testCases,
      constraints,
      image,
      slug,
      userId: req.user.id,
    });
  
    const savedProblem = await newProblem.save();
    res.status(201).json(savedProblem);
  } catch (error) {
    next(error);
  }
};

export const getProblems = async (req, res, next) => {
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.order === 'asc' ? 1 : -1;
    const problemsQuery = {
      ...(req.query.userId && { userId: req.query.userId }),
      ...(req.query.category && { category: req.query.category }),
      ...(req.query.slug && { slug: req.query.slug }), // Assuming 'slug' for problems
      ...(req.query.problemId && { _id: req.query.problemId }),
      ...(req.query.searchTerm && {
        $or: [
          { title: { $regex: req.query.searchTerm, $options: 'i' } },
          { description: { $regex: req.query.searchTerm, $options: 'i' } },
        ],
      }),
    };

    const problems = await Problem.find(problemsQuery)
      .sort({ updatedAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    const totalProblems = await Problem.countDocuments();

    res.status(200).json({
      problems,
      totalProblems,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteProblem = async (req, res, next) => {
  try {
    const { problemId } = req.params; // Assuming the route parameter is named problemId
  
    const problem = await Problem.findOneAndDelete({ _id: problemId, userId: req.user.id });
    if (!problem) {
      return next(errorHandler(404, 'Problem not found'));
    }
    res.json({ message: 'Problem deleted' });
  } catch (error) {
    next(error);
  }
};

export const updateProblem = async (req, res, next) => {
  try {
    const { problemId } = req.body; // Assuming the route parameter is named problemId
    const updates = req.body;
  
    const updatedProblem = await Problem.findOneAndUpdate({ _id: problemId, userId: req.user.id }, updates, { new: true });
    if (!updatedProblem) {
      return next(errorHandler(404, 'Problem not found'));
    }
    res.json(updatedProblem);
  } catch (error) {
    next(error);
  }
};
