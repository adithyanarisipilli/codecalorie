import React, { useState } from "react";
import { Alert, Button, FileInput, TextInput } from "flowbite-react";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { useNavigate } from "react-router-dom";

const CreateProblem = () => {
  const [file, setFile] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [formData, setFormData] = useState({});
  const [publishError, setPublishError] = useState(null);
  const [testCases, setTestCases] = useState([]);

  const navigate = useNavigate();

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
          getDownloadURL(uploadTask.snapshot.ref)
            .then((downloadURL) => {
              setImageUploadProgress(null);
              setImageUploadError(null);
              setFormData({ ...formData, image: downloadURL });
            })
            .catch((error) => {
              setImageUploadError("Failed to get download URL");
              console.error("Error getting download URL:", error);
            });
        }
      );
    } catch (error) {
      setImageUploadError("Image upload failed");
      console.error("Image upload error:", error);
    }
  };

  const handleAddTestCase = () => {
    setTestCases([...testCases, { input: "", output: "" }]);
  };

  const handleDeleteTestCase = (index) => {
    const newTestCases = testCases.filter((_, i) => i !== index);
    setTestCases(newTestCases);
  };

  const handleTestCaseChange = (index, field, value) => {
    const newTestCases = [...testCases];
    newTestCases[index][field] = value;
    setTestCases(newTestCases);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/backend/problem/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...formData, testCases }),
      });
      const data = await res.json();
      if (!res.ok) {
        setPublishError(data.message);
        return;
      }
      if (res.ok) {
        setPublishError(null);
        navigate(`/problem/${data.slug}`);
      }
    } catch (error) {
      setPublishError("Something went wrong");
      console.error("Publish error:", error);
    }
  };

  // Function to handle dynamic resizing of textareas
  const handleTextareaChange = (e) => {
    e.target.style.height = "auto";
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  return (
    <div className="p-3 max-w-3xl mx-auto min-h-screen">
      <h1 className="text-center text-3xl my-7 font-semibold">
        Create a Problem
      </h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4 sm:flex-row justify-between"></div>
        <TextInput
          type="text"
          placeholder="Title"
          required
          id="title"
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        />

        <TextInput
          type="text"
          placeholder="Rating"
          required
          id="rating"
          onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
        />

        <textarea
          placeholder="Description"
          required
          id="description"
          className="resize-y min-h-24 p-2 border rounded-md text-black dark:text-white bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700"
          onChange={(e) => {
            setFormData({ ...formData, description: e.target.value });
            handleTextareaChange(e);
          }}
        />

        <textarea
          placeholder="Input"
          required
          id="input"
          className="resize-y min-h-24 p-2 border rounded-md text-black dark:text-white bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700"
          onChange={(e) => {
            setFormData({ ...formData, input: e.target.value });
            handleTextareaChange(e);
          }}
        />

        <textarea
          placeholder="Constraints"
          required
          id="constraints"
          className="resize-y min-h-24 p-2 border rounded-md text-black dark:text-white bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700"
          onChange={(e) => {
            setFormData({ ...formData, constraints: e.target.value });
            handleTextareaChange(e);
          }}
        />

        <textarea
          placeholder="Output"
          required
          id="output"
          className="resize-y min-h-24 p-2 border rounded-md text-black dark:text-white bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700"
          onChange={(e) => {
            setFormData({ ...formData, output: e.target.value });
            handleTextareaChange(e);
          }}
        />

        {testCases.map((testCase, index) => (
          <div key={index} className="flex gap-4 items-center">
            <textarea
              placeholder="Solved_Tc_input"
              required
              value={testCase.input}
              className="resize-y min-h-24 p-2 border rounded-md flex-1 text-black dark:text-white bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700"
              onChange={(e) => {
                handleTestCaseChange(index, "input", e.target.value);
                handleTextareaChange(e);
              }}
            />
            <textarea
              placeholder="Solved_Tc_output"
              required
              value={testCase.output}
              className="resize-y min-h-24 p-2 border rounded-md flex-1 text-black dark:text-white bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700"
              onChange={(e) => {
                handleTestCaseChange(index, "output", e.target.value);
                handleTextareaChange(e);
              }}
            />
            <Button onClick={() => handleDeleteTestCase(index)}>Delete</Button>
          </div>
        ))}
        <Button type="button" onClick={handleAddTestCase}>
          Add Test Case
        </Button>

        <div className="flex gap-4 items-center">
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
          Publish
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

export default CreateProblem;
