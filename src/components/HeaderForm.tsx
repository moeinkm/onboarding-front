// src/components/HeaderForm.tsx

import React, { useState } from "react";

export interface Header {
  name: string;
  data_type: string;
}

interface HeaderFormProps {
  onHeadersSubmit: (headers: Header[]) => void;
}

const HeaderForm: React.FC<HeaderFormProps> = ({ onHeadersSubmit }) => {
  const [headers, setHeaders] = useState<Header[]>([
    { name: "", data_type: "" },
  ]);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onHeadersSubmit(headers);
  };

  return (
    <form onSubmit={handleSubmit}>
      {headers.map((header, index) => (
        <div key={index} className="header-input-group">
          <input
            type="text"
            value={header.name}
            onChange={(e) => handleHeaderChange(index, "name", e.target.value)}
            placeholder="Header Name"
          />
          <input
            type="text"
            value={header.data_type}
            onChange={(e) =>
              handleHeaderChange(index, "data_type", e.target.value)
            }
            placeholder="Data Type"
          />
          <button type="button" onClick={() => removeHeader(index)}>
            Remove
          </button>
        </div>
      ))}
      <button type="button" onClick={addHeader}>
        Add Header
      </button>
      <button type="submit">Submit Headers</button>
    </form>
  );
};

export default HeaderForm;
