import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import "./FileUpload.css";

interface Header {
  name: string;
  data_type: string;
}

interface FileUploadProps {
  onFileUploaded: () => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileUploaded }) => {
  const [file, setFile] = useState<File | null>(null);
  const [headers, setHeaders] = useState<Header[]>([
    { name: "", data_type: "" },
  ]);
  const { token } = useAuth();

  const commonHeaderNames = ["id", "name", "email", "date", "amount"];
  const commonDataTypes = ["string", "number", "date", "boolean"];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleHeaderChange = (
    index: number,
    field: keyof Header,
    value: string
  ) => {
    const newHeaders = [...headers];
    newHeaders[index][field] = value;
    setHeaders(newHeaders);
  };

  const addHeader = () => {
    setHeaders([...headers, { name: "", data_type: "" }]);
  };

  const removeHeader = (index: number) => {
    const newHeaders = headers.filter((_, i) => i !== index);
    setHeaders(newHeaders);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) {
      alert("Please select a file");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("file_headers", JSON.stringify(headers));

    try {
      await axios.post("http://localhost:8000/api/files/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Token ${token}`,
        },
      });
      setFile(null);
      setHeaders([{ name: "", data_type: "" }]);
      onFileUploaded();
    } catch (error) {
      console.error("Upload failed:", error);
      alert("File and headers upload failed");
    }
  };

  return (
    <div className="file-upload">
      <h2>Upload File</h2>
      <form onSubmit={handleSubmit}>
        <div className="file-input-container">
          <input
            type="file"
            id="file"
            onChange={handleFileChange}
            required
            className="file-input"
          />
          <label htmlFor="file" className="file-label">
            Choose a file
          </label>
        </div>
        <div className="headers-container">
          <h3>Headers</h3>
          {headers.map((header, index) => (
            <div key={index} className="header-input-group">
              <input
                type="text"
                value={header.name}
                onChange={(e) =>
                  handleHeaderChange(index, "name", e.target.value)
                }
                placeholder="Header Name"
                list={`headerNameSuggestions-${index}`}
                className="header-input"
              />
              <datalist id={`headerNameSuggestions-${index}`}>
                {commonHeaderNames.map((name) => (
                  <option key={name} value={name} />
                ))}
              </datalist>
              <input
                type="text"
                value={header.data_type}
                onChange={(e) =>
                  handleHeaderChange(index, "data_type", e.target.value)
                }
                placeholder="Data Type"
                list={`dataTypeSuggestions-${index}`}
                className="header-input"
              />
              <datalist id={`dataTypeSuggestions-${index}`}>
                {commonDataTypes.map((type) => (
                  <option key={type} value={type} />
                ))}
              </datalist>
              <button
                type="button"
                onClick={() => removeHeader(index)}
                className="remove-button"
              >
                Remove
              </button>
            </div>
          ))}
          <button type="button" onClick={addHeader} className="add-button">
            Add Header
          </button>
        </div>
        <button type="submit" className="upload-button">
          Upload File and Headers
        </button>
      </form>
    </div>
  );
};

export default FileUpload;
