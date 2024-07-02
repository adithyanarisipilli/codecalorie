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

  return (
    <div className="p-3 max-w-3xl mx-auto min-h-screen">
      <h1 className="text-center text-3xl my-7 font-semibold">
        Create a Problem
      </h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
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

        <TextInput
          type="text"
          placeholder="Description"
          required
          id="description"
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
        />

        <TextInput
          type="text"
          placeholder="Input"
          required
          id="input"
          onChange={(e) => setFormData({ ...formData, input: e.target.value })}
        />

        <TextInput
          type="text"
          placeholder="Constraints"
          required
          id="constraints"
          onChange={(e) =>
            setFormData({ ...formData, constraints: e.target.value })
          }
        />

        <TextInput
          type="text"
          placeholder="Output"
          required
          id="output"
          onChange={(e) => setFormData({ ...formData, output: e.target.value })}
        />

        {testCases.map((testCase, index) => (
          <div key={index} className="flex gap-4 items-center">
            <TextInput
              type="text"
              placeholder="Solved_Tc_input"
              required
              value={testCase.input}
              onChange={(e) =>
                handleTestCaseChange(index, "input", e.target.value)
              }
            />
            <TextInput
              type="text"
              placeholder="Solved_Tc_output"
              required
              value={testCase.output}
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
