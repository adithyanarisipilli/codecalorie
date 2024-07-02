import React, { useState, useEffect } from "react";
import { Alert, Button, FileInput, Select, TextInput } from "flowbite-react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";

const UpdateProblem = () => {
  const [formData, setFormData] = useState({
    title: "",
    rating: "",
    description: "",
    input: "",
    output: "",
    constraints: "",
    testCases: [],
  });
  const [initialFormData, setInitialFormData] = useState({
    title: "",
    rating: "",
    description: "",
    input: "",
    output: "",
    constraints: "",
    testCases: [],
  });
  const [publishError, setPublishError] = useState(null);
  const [file, setFile] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);

  const { problemId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const res = await fetch(
          `/backend/problem/getproblems?problemId=${problemId}`
        );
        const data = await res.json();
        if (!res.ok) {
          setPublishError(data.message);
          return;
        }
        setPublishError(null);
        const problemData = data.problems[0];
        setFormData({
          title: problemData.title || "",
          rating: problemData.rating || "",
          description: problemData.description || "",
          input: problemData.input || "",
          output: problemData.output || "",
          constraints: problemData.constraints || "",
          testCases: problemData.testCases || [],
        });
        setInitialFormData({
          title: problemData.title || "",
          rating: problemData.rating || "",
          description: problemData.description || "",
          input: problemData.input || "",
          output: problemData.output || "",
          constraints: problemData.constraints || "",
          testCases: problemData.testCases || [],
        });
      } catch (error) {
        console.error("Error fetching problem:", error);
        setPublishError("Failed to fetch problem");
      }
    };

    fetchProblem();
  }, [problemId]);

  const handleUploadImage = async () => {
    try {
      if (!file) {
        setImageUploadError("Please select an image");
        return;
      }
      setImageUploadError(null);
      const storage = getStorage(app);
      const fileName = new Date().getTime() + "-" + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setImageUploadProgress(progress.toFixed(0));
        },
        (error) => {
          setImageUploadError("Image upload failed");
          setImageUploadProgress(null);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setImageUploadProgress(null);
            setImageUploadError(null);
            setFormData({ ...formData, image: downloadURL });
          });
        }
      );
    } catch (error) {
      setImageUploadError("Image upload failed");
      setImageUploadProgress(null);
      console.error("Image upload error:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(
        `/backend/problem/updateproblem/${formData._id}/${currentUser._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );
      const data = await res.json();
      if (!res.ok) {
        setPublishError(data.message);
        return;
      }
      setPublishError(null);
      navigate(`/problem/${data.slug}`);
    } catch (error) {
      console.error("Error updating problem:", error);
      setPublishError("Something went wrong");
    }
  };

  const handleTextareaChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleAddTestCase = () => {
    setFormData({
      ...formData,
      testCases: [...formData.testCases, { input: "", output: "" }],
    });
  };

  const handleDeleteTestCase = (index) => {
    const newTestCases = formData.testCases.filter((_, i) => i !== index);
    setFormData({ ...formData, testCases: newTestCases });
  };

  const handleTestCaseChange = (index, field, value) => {
    const newTestCases = [...formData.testCases];
    newTestCases[index][field] = value;
    setFormData({ ...formData, testCases: newTestCases });
  };

  return (
    <div className="p-3 max-w-3xl mx-auto min-h-screen">
      <h1 className="text-center text-3xl my-7 font-semibold">
        Update Problem
      </h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4 sm:flex-row justify-between">
          <TextInput
            type="text"
            placeholder="Title"
            required
            id="title"
            className="flex-1"
            value={formData.title}
            onChange={(e) => handleTextareaChange("title", e.target.value)}
          />
          <Select
            value={formData.category || ""}
            onChange={(e) => handleTextareaChange("category", e.target.value)}
          >
            <option value="">Select a category</option>
            <option value="algorithm">Algorithm</option>
            <option value="datastructures">Data Structures</option>
            <option value="coding">Coding</option>
          </Select>
        </div>
        <ReactQuill
          theme="snow"
          value={formData.description}
          placeholder="Problem description..."
          className="h-72 mb-12"
          required
          onChange={(value) => handleTextareaChange("description", value)}
        />
        <TextInput
          type="text"
          placeholder="Rating"
          required
          id="rating"
          value={formData.rating}
          onChange={(e) => handleTextareaChange("rating", e.target.value)}
        />
        <textarea
          placeholder="Input"
          required
          id="input"
          className="resize-y min-h-24 p-2 border rounded-md"
          value={formData.input}
          onChange={(e) => handleTextareaChange("input", e.target.value)}
        />

        <textarea
          placeholder="Constraints"
          required
          id="constraints"
          className="resize-y min-h-24 p-2 border rounded-md"
          value={formData.constraints}
          onChange={(e) => handleTextareaChange("constraints", e.target.value)}
        />

        <textarea
          placeholder="Output"
          required
          id="output"
          className="resize-y min-h-24 p-2 border rounded-md"
          value={formData.output}
          onChange={(e) => handleTextareaChange("output", e.target.value)}
        />
        {formData.testCases.map((testCase, index) => (
          <div key={index} className="flex gap-4 items-center">
            <textarea
              placeholder="Solved_Tc_input"
              required
              value={testCase.input}
              className="resize-y min-h-24 p-2 border rounded-md flex-1"
              onChange={(e) =>
                handleTestCaseChange(index, "input", e.target.value)
              }
            />
            <textarea
              placeholder="Solved_Tc_output"
              required
              value={testCase.output}
              className="resize-y min-h-24 p-2 border rounded-md flex-1"
              onChange={(e) =>
                handleTestCaseChange(index, "output", e.target.value)
              }
            />
            <Button onClick={() => handleDeleteTestCase(index)}>Delete</Button>
          </div>
        ))}
        <Button type="button" onClick={handleAddTestCase}>
          Add Test Case
        </Button>
        <div className="flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3">
          <FileInput
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
          />
          <Button
            type="button"
            gradientDuoTone="purpleToBlue"
            size="sm"
            outline
            onClick={handleUploadImage}
            disabled={imageUploadProgress}
          >
            {imageUploadProgress ? (
              <div className="w-16 h-16">
                <CircularProgressbar
                  value={imageUploadProgress}
                  text={`${imageUploadProgress || 0}%`}
                />
              </div>
            ) : (
              "Upload Image"
            )}
          </Button>
        </div>
        {imageUploadError && <Alert color="failure">{imageUploadError}</Alert>}
        {formData.image && (
          <img
            src={formData.image}
            alt="upload"
            className="w-full h-72 object-cover"
          />
        )}
        <Button type="submit" gradientDuoTone="purpleToPink">
          Update Problem
        </Button>
        {publishError && (
          <Alert className="mt-5" color="failure">
            {publishError}
          </Alert>
        )}
      </form>
    </div>
  );
};

export default UpdateProblem;
