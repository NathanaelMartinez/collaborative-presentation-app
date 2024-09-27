import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './pages/login';
import Home from './pages/home';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <Router>
      <Routes>
        {/* If not logged in, show login page. Otherwise, redirect to /home */}
        <Route
          path="/"
          element={isLoggedIn ? <Navigate to="/home" /> : <Login setIsLoggedIn={setIsLoggedIn} />}
        />
        {/* Home page that shows after login */}
        <Route path="/home" element={isLoggedIn ? <Home /> : <Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;
