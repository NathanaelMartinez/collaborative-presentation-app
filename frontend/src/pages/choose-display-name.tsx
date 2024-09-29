import React, { useState } from "react";
import { useUser } from "../context/user-context";
import axios from "axios";

// Props for setting login status
interface ChooseDisplayNameProps {
  setIsLoggedIn: (value: boolean) => void;
}

const ChooseDisplayName: React.FC<ChooseDisplayNameProps> = ({ setIsLoggedIn }) => {
  const [displayName, setDisplayName] = useState("");
  const { setUserId } = useUser();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (displayName) {
      try {
        // send POST request to backend to insert user
        const response = await axios.post("/api/users", { displayName });

        if (response.status === 200) {
          setUserId(response.data.userId); // set userId returned from backend
          setIsLoggedIn(true);
        } else {
          alert("Failed to create user. Try again.");
        }
      } catch (error) {
        console.error("Error inserting user:", error);
        alert("An error occurred. Please try again.");
      }
    } else {
      alert("Please enter a display name.");
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center" style={{ height: '85vh' }}>
      <div className="card p-4" style={{ width: '25rem' }}>
        <h2 className="text-center mb-4">Choose Display Name</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-floating mb-3">
            <input
              type="text"
              className="form-control"
              id="displayName"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Display Name"
              required
            />
            <label htmlFor="displayName">Display Name</label>
          </div>
          <button type="submit" className="btn btn-primary w-100">Enter</button>
        </form>
      </div>
    </div>
  );
};

export default ChooseDisplayName;
