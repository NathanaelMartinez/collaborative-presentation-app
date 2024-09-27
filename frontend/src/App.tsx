import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/login';
import Home from './pages/home';
import { UserProvider } from './context/user-context';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route
            path="/"
            element={isLoggedIn ? <Home /> : <Login setIsLoggedIn={setIsLoggedIn} />}
          />
        </Routes>
      </Router>
    </UserProvider>
  );
};

export default App;
