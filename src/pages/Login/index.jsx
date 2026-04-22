// import { useState } from "react";
// import { Link, useLocation, useNavigate } from "react-router-dom";
// import { authService } from "../../services/authService";
// import { useAuth } from "../../context/AuthContext";
// import { getLoginErrors } from "../../utils/validation";

// const Login = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { login } = useAuth();
//   const [formData, setFormData] = useState({ email: "", password: "" });
//   const [errors, setErrors] = useState({});
//   const [apiMessage, setApiMessage] = useState("");
//   const [isLoading, setIsLoading] = useState(false);

//   const successMessage = location.state?.message || "";

//   const handleChange = (event) => {
//     const { name, value } = event.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//     setErrors((prev) => ({ ...prev, [name]: "" }));
//     setApiMessage("");
//   };

//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     const validationErrors = getLoginErrors(formData);
//     setErrors(validationErrors);
//     if (Object.keys(validationErrors).length > 0) return;

//     setIsLoading(true);
//     setApiMessage("");

//     const result = await authService.login(formData);
//     setIsLoading(false);

//     if (!result.ok) {
//       setApiMessage(result.message);
//       return;
//     }

//     const payload = result.data;
//     login({ token: payload.token, user: payload.data });
//     navigate("/dashboard");
//   };

//   return (
//     <div className="auth-page">
//       <form className="auth-card" onSubmit={handleSubmit}>
//         <h1>Login</h1>
//         <p>Sign in to continue.</p>

//         {successMessage ? <div className="alert success">{successMessage}</div> : null}
//         {apiMessage ? <div className="alert error">{apiMessage}</div> : null}

//         <label>
//           Email
//           <input name="email" type="email" value={formData.email} onChange={handleChange} />
//           {errors.email ? <span className="field-error">{errors.email}</span> : null}
//         </label>

//         <label>
//           Password
//           <input name="password" type="password" value={formData.password} onChange={handleChange} />
//           {errors.password ? <span className="field-error">{errors.password}</span> : null}
//         </label>

//         <button type="submit" disabled={isLoading}>
//           {isLoading ? "Logging in..." : "Login"}
//         </button>

//         <p className="link-text">
//           No account yet? <Link to="/register">Create one</Link>
//         </p>
//       </form>
//     </div>
//   );
// };

// export default Login;


import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getLoginErrors } from "../../utils/validation";
import { useLoginMutation } from "../../store/api/authApi";
import "./style.css";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [loginUser, { isLoading }] = useLoginMutation();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [apiMessage, setApiMessage] = useState("");

  const successMessage = location.state?.message || "";

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
    setApiMessage("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validationErrors = getLoginErrors(formData);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setApiMessage("");
    try {
      const payload = await loginUser(formData).unwrap();
      login({ token: payload.token, user: payload.data });
      navigate("/dashboard");
    } catch (error) {
      setApiMessage(error?.data?.message || "Invalid email or password.");
    }
  };

  return (
    <div className="login-page">
      <form className="form" onSubmit={handleSubmit}>
        
        {successMessage && <div className="alert success">{successMessage}</div>}
        {apiMessage && <div className="alert error">{apiMessage}</div>}

        {/* Email */}
        <div className="flex-column">
          <label>Email</label>
        </div>
        <div className="inputForm">
          <input
            type="email"
            name="email"
            className="input"
            placeholder="Enter your Email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        {errors.email && <span className="field-error">{errors.email}</span>}

        {/* Password */}
        <div className="flex-column">
          <label>Password</label>
        </div>
        <div className="inputForm">
          <input
            type="password"
            name="password"
            className="input"
            placeholder="Enter your Password"
            value={formData.password}
            onChange={handleChange}
          />
        </div>
        {errors.password && <span className="field-error">{errors.password}</span>}

        {/* Remember + Forgot */}
        <div className="flex-row">
          <div>
            <input type="checkbox" />
            <label>Remember me</label>
          </div>
          <span className="span">Forgot password?</span>
        </div>

        {/* Submit */}
        <button className="button-submit" type="submit" disabled={isLoading}>
          {isLoading ? "Logging in..." : "Sign In"}
        </button>

        {/* Register */}
        <p className="p">
          Don't have an account?{" "}
          <Link to="/register" className="span">
            Sign Up
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;