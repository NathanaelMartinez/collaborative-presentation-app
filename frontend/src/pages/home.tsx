import React from "react";
import placeholderImage from "../assets/placeholder-image.jpg";

const Home: React.FC = () => {
  return (
    <div className="container-fluid h-100 d-flex p-0">
      {/* left Sidebar */}
      <div className="bg-white border-end shadow-sm d-flex flex-column align-items-center p-3" style={{ width: "12rem" }}>
        <h4 className="text-dark mb-4">Create Your Own Presentation!</h4>
        <button className="btn btn-primary w-100 mb-3">New Presentation</button>
      </div>

      {/* presentation list */}
      <div className="flex-grow-1 bg-light p-4">
        {/* greet message */}
        <h1 className="text-center display-4 mb-3">See what others are doing</h1>
        <p className="text-center text-muted">Explore and join presentations happening right now.</p>

        {/* list presentation display */}
        <div className="row row-cols-2 row-cols-md-5 g-3">
          {/* Placeholder Presentation cards */}
          {Array.from({ length: 14 }).map((_, index) => (
            <div key={index} className="col">
              <div className="card h-100">
                <img
                  src={placeholderImage}
                  className="card-img-top"
                  alt={`Presentation ${index + 1}`}
                />
                <div className="card-body p-2">
                  <h6 className="card-title text-truncate">
                    Presentation {index + 1}
                  </h6>
                  <p className="card-text text-truncate small">
                    Join to see what's happening.
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
