import React from "react";

function Hero() {
  return (
    <div className="container mt-4 p-3">
      <div className="card bg-dark text-white overflow-hidden">

        <img 
          src="Images/community.jpg" 
          className="card-img hero-blur-img"
          style={{ height: "250px", objectFit: "cover" }}
          alt="Community"
        />

        <div className="card-img-overlay d-flex flex-column align-items-center justify-content-center text-center">

          <h1 className="fw-bold mb-2">
            Welcome To Community <span className="wave">👋</span>
          </h1>

          <p className="lead mb-0 hero-subtitle">
            Connect and grow together
          </p>

        </div>

      </div>
    </div>
  );
}

export default Hero;