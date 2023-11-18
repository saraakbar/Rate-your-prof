import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const FileUpload = ({onClose}) => {
  const username = localStorage.getItem("username");
  const token = JSON.parse(localStorage.getItem("token"));
  const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];

    // Check if a file is selected
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const loginSuccess = () => {
    toast.success("Image uploaded successfully. Please refresh.", {
      position: toast.POSITION.TOP_RIGHT,
      theme: "dark",
    });
  };

  const loginError = (message) => {
    toast.error(message, {
      position: toast.POSITION.TOP_RIGHT,
      theme: "dark",
    })
  }

  const handleUpload = async () => {
    try {
      if (!file) {
        loginError("No file selected");
      }

      else {

      const formData = new FormData();
      formData.append('avatar', file);

      const response = await axios.post(`http://localhost:8000/${username}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      loginSuccess();
      setFile(null); // Reset file state after successful upload
      onClose();
    }

    } catch (error) {
      loginError("Invalid file type. Please try again.");

      console.error('Error uploading file:', error);
    }
  };

  return (
    <div className="bg-gray-200 flex flex-col items-center w-64 p-8">
      <label
        htmlFor="dropzone-file"
        className="w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer"
      >
        <div className="flex flex-col items-center justify-center p-5">
          <svg
            className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 20 16"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
            />
          </svg>
          <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
            <span className="font-semibold">Choose file to upload</span>
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">PNG or JPG (PREFERABLE. 512x512px)</p>
        </div>
        <input id="dropzone-file" type="file" className="hidden" onChange={handleFileChange} />
      </label>
      <button className="mt-4 px-4 p-2 text-white bg-gray-800 rounded" onClick={handleUpload}>
        Upload
      </button>
    </div>
  );
};

export default FileUpload;
