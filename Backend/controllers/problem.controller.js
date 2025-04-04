import Problem from '../models/problem.model.js';
import { errorHandler } from '../utils/error.js';

export const create = async (req, res, next) => {
  
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
  
    const slug = req.body.title
      .split(' ')
      .join('-')
      .toLowerCase()
      .replace(/[^a-zA-Z0-9-]/g, '');
  
    const newProblem = new Problem({
      ...req.body,
      slug,
      userId: req.user.id,
    });
  try {
    const savedProblem = await newProblem.save();
    res.status(201).json(savedProblem);
  } catch (error) {
    next(error);
  }
};

export const getproblems = async (req, res, next) => {
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.order === 'asc' ? 1 : -1;
    const problemsQuery = {
      ...(req.query.userId && { userId: req.query.userId }),
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

export const getProblemById = async (req, res) => {
  try {
    const { problemId } = req.params;
    const problem = await Problem.findById(problemId);
    if (!problem) {
      return res.status(404).json({ error: "Problem not found" });
    }
    res.json(problem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


export const deleteproblem = async (req, res, next) => {
  if (!req.user.isAdmin || req.user.id !== req.params.userId) {
    return next(errorHandler(403, 'You are not allowed to delete this problem'));
  }
  try {
    await Problem.findByIdAndDelete(req.params.problemId);
    res.status(200).json('The problem has been deleted');
  } catch (error) {
    next(error);
  }
};

export const updateproblem = async (req, res, next) => {
  if (!req.user.isAdmin || req.user.id !== req.params.userId) {
    return next(errorHandler(403, 'You are not allowed to update this problem'));
  }
  try {
    const updatedProblem = await Problem.findByIdAndUpdate(
      req.params.problemId,
      {
        $set: {
          title: req.body.title,
          rating: req.body.rating,
          description: req.body.description,
          title: req.body.title,
          input: req.body.input,
          constraints:req.body.constraints,
          output: req.body.output,
          image: req.body.image,
          testCases: req.body.testCases
        },
      },
      { new: true }
    );
    res.status(200).json(updatedProblem);
  } catch (error) {
    next(error);
  }
};
