import React, { useState, useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom';

function Navbar() {

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const status = localStorage.getItem("isLoggedIn");
    const name = localStorage.getItem("userName");

    if (status === "true") {
      setIsLoggedIn(true);
      setUserName(name);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userName");

    setIsLoggedIn(false);
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light sticky-top">
      <div className="container">

        <Link className="navbar-brand d-flex align-items-center" to="/">
          <img
            src="/Images/logo1.png"
            alt="ConnectUS"
            style={{ width: "15%", marginRight: "10px" }}
          />
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">

          <ul
            className="navbar-nav ms-auto navLink"
            
          >

            <li className="nav-item">
              <Link className="nav-link active NavLink" to="/">Home</Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link active NavLink" to="/resources">Resources</Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link active NavLink" to="/community">Community</Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link active NavLink" to="/about" style={{ whiteSpace: "nowrap" }}>
                About us
              </Link>
            </li>

            {!isLoggedIn ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link active NavLink" to="/login">Login</Link>
                </li>

                <li className="nav-item">
                  <Link className="nav-link active NavLink" to="/signup">Sign Up</Link>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item d-flex align-items-center">
                  <Link to="/dashboard" className="nav-link userName">
                    👤 {userName}
                  </Link>
                </li>

                <li className="nav-item">
                  <button
                    onClick={handleLogout}
                    className="nav-link logoutBtn"
                  >
                    Logout
                  </button>
                </li>
              </>
            )}

          </ul>

        </div>
      </div>
    </nav>
  );
}

export default Navbar;