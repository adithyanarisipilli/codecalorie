import mongoose from 'mongoose';

const problemSchema = new mongoose.Schema(
  {
     
  title: { type: String, required: true,unique: true, },
  rating: { type: Number, required: true },
  description: { type: String, required: true },
  testCases: [
    {
      input: { type: String, required: true },
      output: { type: String, required: true }
    }
  ],
  input: { type: String, required: true },
  constraints: { type: String, required: true },
  output: { type: String, required: true },
  image: { 
    type: String ,   
       default: 'https://www.hostinger.com/tutorials/wp-content/uploads/sites/2/2021/09/how-to-write-a-blog-post.png', 
},

  slug: { 
    type: String,
     required: true,
      unique: true
     },
}, 
  { timestamps: true }
);

const Problem = mongoose.model('Problem', problemSchema);

export default Problem;

