import React, { useState } from "react";
import axios from "axios";

const API = process.env.REACT_APP_API_URL;

function SignupPage() {
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "student",
        agreeTerms: false
    });

    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));
        
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: "" }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        // Full Name validation
        if (!formData.fullName.trim()) {
            newErrors.fullName = "Full name is required";
        } else if (formData.fullName.trim().length < 3) {
            newErrors.fullName = "Name must be at least 3 characters";
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email) {
            newErrors.email = "Email is required";
        } else if (!emailRegex.test(formData.email)) {
            newErrors.email = "Please enter a valid email";
        }

        // Password validation
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
        if (!formData.password) {
            newErrors.password = "Password is required";
        } else if (formData.password.length < 8) {
            newErrors.password = "Password must be at least 8 characters";
        } else if (!/(?=.*[A-Za-z])/.test(formData.password)) {
            newErrors.password = "Password must contain at least one letter";
        } else if (!/(?=.*\d)/.test(formData.password)) {
            newErrors.password = "Password must contain at least one number";
        }

        // Confirm Password validation
        if (!formData.confirmPassword) {
            newErrors.confirmPassword = "Please confirm your password";
        } else if (formData.confirmPassword !== formData.password) {
            newErrors.confirmPassword = "Passwords do not match";
        }

        // Terms validation
        if (!formData.agreeTerms) {
            newErrors.agreeTerms = "You must agree to the terms";
        }

        return newErrors;
    };

        const handleSubmit = async (e) => {
        e.preventDefault();

        const newErrors = validateForm();

        if (Object.keys(newErrors).length === 0) {

            try {

                const { data } = await axios.post(
                    `${API}/auth/signup`,
                    {
                        fullName: formData.fullName,
                        email: formData.email,
                        password: formData.password,
                        role: formData.role
                    },
                    {
                        withCredentials: true
                    }
                );

                if (data.success) {
                    
                    // store login status
                    localStorage.setItem("isLoggedIn", "true");
                    localStorage.setItem("userName", formData.fullName);
                    
                    setIsSubmitted(true);

                    // clear form
                    setFormData({
                        fullName: "",
                        email: "",
                        password: "",
                        confirmPassword: "",
                        role: "student",
                        agreeTerms: false
                    });

                    // redirect to login
                    setTimeout(() => {
                        window.location.href = "/";
                    }, 5000);
                }

            } catch (error) {

                if (error.response && error.response.data.message) {
                    alert(error.response.data.message);
                } else {
                    console.log(error);
                    alert("Something went wrong");
                }

            }

        } else {
            setErrors(newErrors);
        }
        // add this anywhere
        console.log("updated");
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
                <div className="row justify-content-center align-items-center min-vh-100 py-4">
                    <div className="col-md-8 col-lg-6 col-xl-5">
                        {/* Success Message */}
                        {isSubmitted && (
                            <div className="alert alert-success mb-4" style={{
                                background: "rgba(25, 135, 84, 0.9)",
                                backdropFilter: "blur(10px)",
                                border: "none",
                                color: "white"
                            }}>
                                <div className="d-flex align-items-center">
                                    <i className="fas fa-check-circle fs-4 me-3"></i>
                                    <div>
                                        <strong>Account created successfully!</strong> Redirecting...
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Signup Card */}
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
                                    <h2 className="fw-bold text-white mb-2">Create Account</h2>
                                    <p className="text-white opacity-75">Join our mental health community</p>
                                </div>

                                {/* Form */}
                                <form onSubmit={handleSubmit}>
                                    {/* Full Name */}
                                    <div className="mb-3">
                                        <div className="d-flex align-items-center gap-2 mb-1">
                                            <i className="fas fa-user text-white opacity-75 small"></i>
                                            <label className="text-white small fw-semibold">Full Name</label>
                                        </div>
                                        <input
                                            type="text"
                                            name="fullName"
                                            className="form-control"
                                            placeholder="John Doe"
                                            value={formData.fullName}
                                            onChange={handleChange}
                                            style={inputStyle}
                                        />
                                        {errors.fullName && (
                                            <small className="text-danger d-block mt-1">
                                                <i className="fas fa-exclamation-circle me-1"></i>
                                                {errors.fullName}
                                            </small>
                                        )}
                                    </div>

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
                                            <span className="text-white-50 small">Min. 8 chars</span>
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
                                                    cursor: "pointer"
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

                                    {/* Confirm Password */}
                                    <div className="mb-3">
                                        <div className="d-flex align-items-center gap-2 mb-1">
                                            <i className="fas fa-lock text-white opacity-75 small"></i>
                                            <label className="text-white small fw-semibold">Confirm Password</label>
                                        </div>
                                        <div className="position-relative">
                                            <input
                                                type={showConfirmPassword ? "text" : "password"}
                                                name="confirmPassword"
                                                className="form-control"
                                                placeholder="••••••••"
                                                value={formData.confirmPassword}
                                                onChange={handleChange}
                                                style={inputStyle}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                style={{
                                                    position: "absolute",
                                                    right: "12px",
                                                    top: "50%",
                                                    transform: "translateY(-50%)",
                                                    background: "none",
                                                    border: "none",
                                                    color: "rgba(255,255,255,0.6)",
                                                    cursor: "pointer"
                                                }}
                                            >
                                                <i className={`fas ${showConfirmPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
                                            </button>
                                        </div>
                                        {errors.confirmPassword && (
                                            <small className="text-danger d-block mt-1">
                                                <i className="fas fa-exclamation-circle me-1"></i>
                                                {errors.confirmPassword}
                                            </small>
                                        )}
                                    </div>

                                    
                                    {/* Role Selection */}
                                        <div className="mb-4">
                                        <div className="d-flex align-items-center gap-2 mb-2">
                                            <i className="fas fa-graduation-cap text-white opacity-75 small"></i>
                                            <label className="text-white small fw-semibold">I am a</label>
                                        </div>

                                        <div className="d-flex gap-3 flex-wrap">
                                            {["student", "professional", "parent"].map((role) => (
                                            <label
                                                key={role}
                                                htmlFor={role}
                                                style={{
                                                padding: "10px 18px",
                                                borderRadius: "12px",
                                                cursor: "pointer",
                                                border: "1px solid rgba(255,255,255,0.25)",
                                                background:
                                                    formData.role === role
                                                    ? "linear-gradient(45deg,#667eea,#764ba2)"
                                                    : "rgba(255,255,255,0.08)",
                                                color: "white",
                                                fontSize: "14px",
                                                transition: "all 0.2s ease"
                                                }}
                                            >
                                                <input
                                                type="radio"
                                                name="role"
                                                id={role}
                                                value={role}
                                                checked={formData.role === role}
                                                onChange={handleChange}
                                                style={{ display: "none" }}
                                                />

                                                {role.charAt(0).toUpperCase() + role.slice(1)}
                                            </label>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Terms Checkbox */}
                                   
                                    <div className="mb-4">
                                        <div
                                            style={{
                                            background: "rgba(255,255,255,0.08)",
                                            border: "1px solid rgba(255,255,255,0.2)",
                                            borderRadius: "12px",
                                            padding: "12px 14px",
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "10px"
                                            }}
                                        >
                                            <input
                                            type="checkbox"
                                            name="agreeTerms"
                                            id="agreeTerms"
                                            checked={formData.agreeTerms}
                                            onChange={handleChange}
                                            style={{
                                                width: "18px",
                                                height: "18px",
                                                cursor: "pointer"
                                            }}
                                            />

                                            <label
                                            htmlFor="agreeTerms"
                                            className="text-white small"
                                            style={{ margin: 0 }}
                                            >
                                            I agree to the{" "}
                                            <a
                                                href="#"
                                                style={{
                                                color: "#9db4ff",
                                                textDecoration: "underline"
                                                }}
                                            >
                                                Terms of Service
                                            </a>{" "}
                                            and{" "}
                                            <a
                                                href="#"
                                                style={{
                                                color: "#9db4ff",
                                                textDecoration: "underline"
                                                }}
                                            >
                                                Privacy Policy
                                            </a>
                                            </label>
                                        </div>

                                        {errors.agreeTerms && (
                                            <small className="text-danger d-block mt-1">
                                            <i className="fas fa-exclamation-circle me-1"></i>
                                            {errors.agreeTerms}
                                            </small>
                                        )}
                                    </div>

                                    {/* Submit Button */}
                                    <button 
                                        type="submit" 
                                        className="btn w-100 py-3 mb-3 fw-semibold"
                                        style={{
                                            background: "linear-gradient(45deg, #667eea, #764ba2)",
                                            color: "white",
                                            border: "none",
                                            borderRadius: "10px",
                                            transition: "transform 0.3s"
                                        }}
                                        onMouseEnter={(e) => e.target.style.transform = "translateY(-2px)"}
                                        onMouseLeave={(e) => e.target.style.transform = "translateY(0)"}
                                    >
                                        <i className="fas fa-user-plus me-2"></i>
                                        Create Account
                                    </button>

                                    {/* Login Link */}
                                    <div className="text-center">
                                        <span className="text-white opacity-75">Already have an account? </span>
                                        <a href="/login" className="text-white fw-semibold" style={{ textDecoration: "none" }}>
                                            Sign In
                                        </a>
                                    </div>

                                    {/* Password Strength Indicator */}
                                    {formData.password && (
                                        <div className="mt-3 pt-3 border-top" style={{ borderColor: "rgba(255,255,255,0.2)" }}>
                                            <small className="text-white opacity-75">Password strength: </small>
                                            <div className="d-flex gap-2 mt-1">
                                                {["Weak", "Medium", "Strong"].map((strength, index) => {
                                                    let isActive = false;
                                                    if (formData.password.length >= 8) isActive = index === 0;
                                                    if (formData.password.length >= 8 && /(?=.*[A-Za-z])(?=.*\d)/.test(formData.password)) isActive = index <= 1;
                                                    if (formData.password.length >= 10 && /(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])/.test(formData.password)) isActive = index <= 2;
                                                    
                                                    return (
                                                        <div
                                                            key={strength}
                                                            style={{
                                                                flex: 1,
                                                                height: "4px",
                                                                background: isActive 
                                                                    ? index === 0 ? "#ff6b6b" : index === 1 ? "#ffd93d" : "#51cf66"
                                                                    : "rgba(255,255,255,0.2)",
                                                                borderRadius: "2px",
                                                                transition: "background 0.3s"
                                                            }}
                                                        />
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SignupPage;