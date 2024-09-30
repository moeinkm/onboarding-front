import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import "./FileList.css";

interface Header {
  name: string;
  data_type: string;
}

interface Value {
  value: string;
}

interface FileHeader {
  header: Header;
  values: Value[];
}

interface File {
  id: number;
  name: string;
  created_at: string;
}

interface FileDetail {
  id: number;
  name: string;
  file: string;
  file_headers: FileHeader[];
}

interface FileListProps {
  refreshTrigger: number;
}

const FileList: React.FC<FileListProps> = ({ refreshTrigger }) => {
  const [files, setFiles] = useState<File[]>([]);
  const [selectedFile, setSelectedFile] = useState<FileDetail | null>(null);
  const { token } = useAuth();

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await axios.get<File[]>(
          "http://localhost:8000/api/files/",
          {
            headers: { Authorization: `Token ${token}` },
          }
        );
        setFiles(response.data);
      } catch (error) {
        console.error("Failed to fetch files:", error);
      }
    };

    fetchFiles();
  }, [token, refreshTrigger]);

  const handleFileClick = async (fileId: number) => {
    try {
      const response = await axios.get<FileDetail>(
        `http://localhost:8000/api/files/${fileId}/`,
        {
          headers: { Authorization: `Token ${token}` },
        }
      );
      setSelectedFile(response.data);
    } catch (error) {
      console.error("Failed to fetch file details:", error);
    }
  };

  const renderCSVTable = (fileHeaders: FileHeader[]) => {
    if (!fileHeaders || fileHeaders.length === 0) {
      return <p>No data available</p>;
    }

    // Determine the number of rows
    const rowCount = Math.max(...fileHeaders.map((fh) => fh.values.length));

    return (
      <table className="csv-table">
        <thead>
          <tr>
            {fileHeaders.map((fileHeader, index) => (
              <th key={index}>{fileHeader.header.name}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {[...Array(rowCount)].map((_, rowIndex) => (
            <tr key={rowIndex}>
              {fileHeaders.map((fileHeader, colIndex) => (
                <td key={colIndex}>
                  {fileHeader.values[rowIndex]?.value || ""}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <div className="file-list">
      <h2>Your Files</h2>
      <ul>
        {files.map((file) => (
          <li key={file.id} className="file-item">
            <span
              onClick={() => handleFileClick(file.id)}
              className="file-name"
            >
              {file.name}
            </span>
            <span className="file-date">
              {new Date(file.created_at).toLocaleString()}
            </span>
          </li>
        ))}
      </ul>
      {selectedFile && (
        <div className="file-content">
          <h3>File Details: {selectedFile.name}</h3>
          {renderCSVTable(selectedFile.file_headers)}
        </div>
      )}
    </div>
  );
};

export default FileList;
