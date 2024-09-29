import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/home';
import ChooseDisplayName from './pages/choose-display-name';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
      <Router>
        <Routes>
          <Route
            path="/"
            element={isLoggedIn ? <Home /> : <ChooseDisplayName setIsLoggedIn={setIsLoggedIn} />}
          />
        </Routes>
      </Router>
  );
};

export default App;
