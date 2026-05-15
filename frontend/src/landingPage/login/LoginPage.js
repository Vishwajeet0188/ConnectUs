import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { GoogleLogin } from '@react-oauth/google';
const API = process.env.REACT_APP_API_URL;

function Login() {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        rememberMe: false
    });
    

    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));
        
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: "" }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.email) {
            newErrors.email = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = "Please enter a valid email";
        }

        if (!formData.password) {
            newErrors.password = "Password is required";
        }

        return newErrors;
    };

        const handleSubmit = async (e) => {
            e.preventDefault();

            const newErrors = validateForm();
            if (Object.keys(newErrors).length !== 0) {
                setErrors(newErrors);
                return;
            }

            setIsLoading(true);

            try {
                const { data } = await axios.post(
                `${API}/auth/login`,
                {
                    email: formData.email,
                    password: formData.password,
                },
                {
                    withCredentials: true,
                }
                );

                console.log("LOGIN RESPONSE:", data);

                // Validate response safely
                if (!data || !data.token || !data.user) {
                throw new Error("Invalid login response from server");
                }

                //  Store data
                localStorage.setItem("token", data.token);
                localStorage.setItem("user", JSON.stringify(data.user));
                localStorage.setItem("isLoggedIn", "true");
                localStorage.setItem("userId", data.user._id);
                localStorage.setItem("userName", data.user.fullName);

                const expiryTime = Date.now() + 60 * 60 * 1000;
                localStorage.setItem("loginExpiry", expiryTime);

                alert("Login successful!");

                //  Role-based redirect
                switch (data.user.role) {
                case "admin":
                    window.location.href = "/admin/dashboard";
                    break;

                case "student":
                case "parent":
                case "professional":
                    window.location.href = "/dashboard";
                    break;

                default:
                    // fallback (important)
                    window.location.href = "/";
                }

            } catch (error) {
                console.error("Login error:", error);

                if (error.response) {
                alert(error.response.data?.message || "Login failed");
                } else {
                alert(error.message || "Server error");
                }

            } finally {
                setIsLoading(false);
            }
        };

    const inputStyle = {
        background: "rgba(255, 255, 255, 0.15)",
        color: "white",
        backdropFilter: "blur(5px)",
        border: "1px solid rgba(255, 255, 255, 0.2)",
        borderRadius: "10px",
        padding: "12px 16px"
    };

    return (
        <div style={{
            backgroundImage: "linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            minHeight: "100vh",
            fontFamily: "'Inter', sans-serif"
        }}>
            <div className="container">
                <div className="row justify-content-center align-items-center min-vh-100">
                    <div className="col-md-5 col-lg-4 col-xl-4">
                        {/* Login Card */}
                        <div className="card border-0 p-4" style={{
                            background: "rgba(255, 255, 255, 0.1)",
                            backdropFilter: "blur(20px)",
                            border: "1px solid rgba(255, 255, 255, 0.2)",
                            boxShadow: "0 8px 32px 0 rgba(0,0,0,0.2)",
                            borderRadius: "24px"
                        }}>
                            <div className="card-body p-4">
                                {/* Header */}
                                <div className="text-center mb-4">
                                    <div className="mb-3">
                                        <span style={{
                                            fontSize: "48px",
                                            filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.2))"
                                        }}>
                                            🧠
                                        </span>
                                    </div>
                                    <h2 className="fw-bold text-white mb-2">Welcome Back</h2>
                                    <p className="text-white opacity-75">Sign in to continue your journey</p>
                                </div>

                                {/* Form */}
                                <form onSubmit={handleSubmit}>
                                    {/* Email */}
                                    <div className="mb-3">
                                        <div className="d-flex align-items-center gap-2 mb-1">
                                            <i className="fas fa-envelope text-white opacity-75 small"></i>
                                            <label className="text-white small fw-semibold">Email</label>
                                        </div>
                                        <input
                                            type="email"
                                            name="email"
                                            className="form-control"
                                            placeholder="you@example.com"
                                            value={formData.email}
                                            onChange={handleChange}
                                            style={inputStyle}
                                        />
                                        {errors.email && (
                                            <small className="text-danger d-block mt-1">
                                                <i className="fas fa-exclamation-circle me-1"></i>
                                                {errors.email}
                                            </small>
                                        )}
                                    </div>

                                    {/* Password */}
                                    <div className="mb-3">
                                        <div className="d-flex align-items-center justify-content-between mb-1">
                                            <div className="d-flex align-items-center gap-2">
                                                <i className="fas fa-lock text-white opacity-75 small"></i>
                                                <label className="text-white small fw-semibold">Password</label>
                                            </div>
                                            <a href="#" className="text-white-50 small" style={{ 
                                                textDecoration: "none",
                                                opacity: 0.8,
                                                transition: "opacity 0.3s"
                                            }}
                                            onMouseEnter={(e) => e.target.style.opacity = 1}
                                            onMouseLeave={(e) => e.target.style.opacity = 0.8}>
                                                Forgot?
                                            </a>
                                        </div>
                                        <div className="position-relative">
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                name="password"
                                                className="form-control"
                                                placeholder="••••••••"
                                                value={formData.password}
                                                onChange={handleChange}
                                                style={inputStyle}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                style={{
                                                    position: "absolute",
                                                    right: "12px",
                                                    top: "50%",
                                                    transform: "translateY(-50%)",
                                                    background: "none",
                                                    border: "none",
                                                    color: "rgba(255,255,255,0.6)",
                                                    cursor: "pointer",
                                                    padding: "8px"
                                                }}
                                            >
                                                <i className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
                                            </button>
                                        </div>
                                        {errors.password && (
                                            <small className="text-danger d-block mt-1">
                                                <i className="fas fa-exclamation-circle me-1"></i>
                                                {errors.password}
                                            </small>
                                        )}
                                    </div>

                                    {/* Sign In Button */}
                                    <button 
                                        type="submit" 
                                        className="btn w-100 py-3 mb-3 fw-semibold d-flex align-items-center justify-content-center gap-2"
                                        disabled={isLoading}
                                        style={{
                                            background: "linear-gradient(45deg, #667eea, #764ba2)",
                                            color: "white",
                                            border: "none",
                                            borderRadius: "10px",
                                            transition: "all 0.3s",
                                            opacity: isLoading ? 0.8 : 1
                                        }}
                                        onMouseEnter={(e) => !isLoading && (e.target.style.transform = "translateY(-2px)")}
                                        onMouseLeave={(e) => !isLoading && (e.target.style.transform = "translateY(0)")}
                                    >
                                        {isLoading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                                Signing in...
                                            </>
                                        ) : (
                                            <>
                                                <i className="fas fa-sign-in-alt"></i>
                                                Sign In
                                            </>
                                        )}
                                    </button>
                                    
                                    <div className="text-center my-3">
                                        <p className="text-white opacity-75">OR</p>
                                        </div>

                                        <GoogleLogin
                                        onSuccess={async (credentialResponse) => {
                                            try {
                                            const res = await axios.post(
                                                `${API}/auth/google`,
                                                {
                                                token: credentialResponse.credential,
                                                }
                                            );

                                            // same storage logic
                                            localStorage.setItem("token", res.data.token);
                                            localStorage.setItem("user", JSON.stringify(res.data.user));
                                            localStorage.setItem("isLoggedIn", "true");
                                            localStorage.setItem("userId", res.data.user._id);
                                            localStorage.setItem("userName", res.data.user.fullName);

                                            const expiryTime = Date.now() + 60 * 60 * 1000;
                                            localStorage.setItem("loginExpiry", expiryTime);
                                            // redirect based on role
                                            if (res.data.user.role === "admin") {
                                                window.location.href = "/admin/dashboard";
                                            } else {
                                                window.location.href = "/dashboard";
                                            }

                                            } catch (err) {
                                            console.error(err);
                                            alert("Google login failed");
                                            }
                                        }}
                                        onError={() => console.log("Google Login Failed")}
                                    />
                                    

                                    {/* Sign Up Link */}
                                    <div className="text-center mt-4">
                                        <span className="text-white opacity-75">New to our community? </span>
                                        <Link to="/signup" className="text-white fw-semibold" style={{ 
                                            textDecoration: "none",
                                            borderBottom: "2px solid rgba(255,255,255,0.5)",
                                            paddingBottom: "2px",
                                            transition: "border-color 0.3s"
                                        }}
                                        onMouseEnter={(e) => e.target.style.borderBottomColor = "white"}
                                        onMouseLeave={(e) => e.target.style.borderBottomColor = "rgba(255,255,255,0.5)"}>
                                            Create account
                                        </Link>
                                    </div>
                                </form>
                            </div>
                        </div>

                        {/* Footer Note */}
                        <div className="text-center mt-4">
                            <p className="text-white-50 small mb-0" style={{ opacity: 0.7 }}>
                                By signing in, you agree to our Terms and Privacy Policy
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;