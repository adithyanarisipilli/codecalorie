import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv'
import userRoutes from './routes/user.route.js';
import authRoutes from './routes/auth.route.js';
import postRoutes from './routes/post.route.js';
import problemRoutes from './routes/problem.route.js';
import commentRoutes from './routes/comment.route.js';
import cookieParser from 'cookie-parser';
import { generateFile } from './generateFile.cjs';
import { executeCpp } from './executeCpp.cjs';
import cors from 'cors';
import compilerRoutes from './routes/compiler.cjs';
dotenv.config();

mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log('MongoDb is connected');
  })
  .catch((err) => {
    console.log(err);
  });

const app = express();

app.use(cookieParser());
app.use(cors());
app.use(express.urlencoded({extended:true}));
app.use(express.json());

app.get("/",(req,res)=>{
  res.json({online:"compiler"});
});

// app.post('/run', async (req, res) => {
//   const { language='cpp', code, input } = req.body;
//   const filepath = await generateFile('cpp', code);
//   try {
//     const output = await executeCpp(filepath, input);
//     res.json({ output });
//   } catch (error) {
//     res.status(500).json({ error });
//   }
// });
app.post("/run", async (req, res) => {
    // const language = req.body.language;
    // const code = req.body.code;

    const { language = 'cpp', code, input } = req.body;
    if (code === undefined) {
        return res.status(404).json({ success: false, error: "Empty code!" });
    }
    try {
        const filePath =  await generateFile(language, code);
        const inputPath =  await generateInputFile(input);
        const output = await executeCpp(filePath, inputPath);
        
// console.log(filePath);
// console.log(output);
// console.log(inputPath);

        res.json({ filePath, inputPath, output });
    } catch (error) {
        res.status(500).json({ error: error });
    }
});
// app.post('/submit', async (req, res) => {
//   const { code, problemId } = req.body;
//   const filepath = await generateFile('cpp', code);
//   try {
//     const problem = await Problem.findById(problemId);
//     const testCases = problem.testCases;
//     let verdict = "Accepted";
//     for (const testCase of testCases) {
//       const output = await executeCpp(filepath, testCase.input);
//       if (output.trim() !== testCase.output.trim()) {
//         verdict = "Wrong Answer";
//         break;
//       }
//     }
//     res.json({ verdict });
//   } catch (error) {
//     res.status(500).json({ error });
//   }
// });

app.listen(3000, () => {
  console.log('Server is running on port 3000!');
});

app.use('/backend/user', userRoutes);
app.use('/backend/auth', authRoutes);
app.use('/backend/post', postRoutes);
app.use('/backend/problem', problemRoutes);
app.use('/backend/comment', commentRoutes);
app.use('/backend/compiler', compilerRoutes);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});
