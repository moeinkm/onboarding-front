import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import FileUpload from "./components/FileUpload";
import FileList from "./components/FileList";
import Navbar from "./components/Navbar";
import { AuthProvider, useAuth } from "./context/AuthContext";
import "./App.css";

const AuthenticatedView: React.FC = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleFileUploaded = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <>
      <Navbar />
      <div className="container">
        <FileUpload onFileUploaded={handleFileUploaded} />
        <FileList refreshTrigger={refreshTrigger} />
      </div>
    </>
  );
};

const App: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Router>
      <div className="app">
        <Routes>
          <Route
            path="/login"
            element={!isAuthenticated ? <Login /> : <Navigate to="/" />}
          />
          <Route
            path="/register"
            element={!isAuthenticated ? <Register /> : <Navigate to="/" />}
          />
          <Route
            path="/"
            element={
              isAuthenticated ? <AuthenticatedView /> : <Navigate to="/login" />
            }
          />
        </Routes>
      </div>
    </Router>
  );
};

const AppWithAuth: React.FC = () => (
  <AuthProvider>
    <App />
  </AuthProvider>
);

export default AppWithAuth;
