// import { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { authService } from "../../services/authService";
// import { ROLES } from "../../constants";
// import { getRegisterErrors } from "../../utils/validation";

// const Register = () => {
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     phone: "",
//     password: "",
//     role: "",
//   });
//   const [errors, setErrors] = useState({});
//   const [apiMessage, setApiMessage] = useState("");
//   const [isLoading, setIsLoading] = useState(false);

//   const handleChange = (event) => {
//     const { name, value } = event.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//     setErrors((prev) => ({ ...prev, [name]: "" }));
//     setApiMessage("");
//   };

//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     const validationErrors = getRegisterErrors(formData);
//     setErrors(validationErrors);
//     if (Object.keys(validationErrors).length > 0) return;

//     setIsLoading(true);
//     setApiMessage("");

//     const result = await authService.register(formData);
//     setIsLoading(false);

//     if (!result.ok) {
//       setApiMessage(result.message);
//       return;
//     }

//     navigate("/login", {
//       state: { message: "Account created successfully. Please login." },
//     });
//   };

//   return (
//     <div className="auth-page">
//       <form className="auth-card" onSubmit={handleSubmit}>
//         <h1>Register</h1>
//         <p>Create your Rentora account.</p>

//         {apiMessage ? <div className="alert error">{apiMessage}</div> : null}
//         {errors.role ? <div className="alert error">{errors.role}</div> : null}

//         <label>
//           Full Name
//           <input name="name" value={formData.name} onChange={handleChange} />
//           {errors.name ? <span className="field-error">{errors.name}</span> : null}
//         </label>

//         <label>
//           Email
//           <input name="email" type="email" value={formData.email} onChange={handleChange} />
//           {errors.email ? <span className="field-error">{errors.email}</span> : null}
//         </label>

//         <label>
//           Phone
//           <input name="phone" value={formData.phone} onChange={handleChange} />
//           {errors.phone ? <span className="field-error">{errors.phone}</span> : null}
//         </label>

//         <label>
//           Password
//           <input name="password" type="password" value={formData.password} onChange={handleChange} />
//           {errors.password ? <span className="field-error">{errors.password}</span> : null}
//         </label>

//         <fieldset className="role-fieldset">
//           <legend>Register as</legend>
//           <label className="radio-row">
//             <input
//               type="radio"
//               name="role"
//               value={ROLES.OWNER}
//               checked={formData.role === ROLES.OWNER}
//               onChange={handleChange}
//             />
//             Owner
//           </label>
//           <label className="radio-row">
//             <input
//               type="radio"
//               name="role"
//               value={ROLES.RENTER}
//               checked={formData.role === ROLES.RENTER}
//               onChange={handleChange}
//             />
//             Renter
//           </label>
//         </fieldset>

//         <button type="submit" disabled={isLoading}>
//           {isLoading ? "Creating account..." : "Create Account"}
//         </button>

//         <p className="link-text">
//           Already have an account? <Link to="/login">Login</Link>
//         </p>
//       </form>
//     </div>
//   );
// };

// export default Register;



import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ROLES } from "../../constants";
import { getRegisterErrors } from "../../utils/validation";
import { useRegisterMutation } from "../../store/api/authApi";
import "./style.css";

const Register = () => {
  const navigate = useNavigate();
  const [registerUser, { isLoading }] = useRegisterMutation();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "",
  });

  const [errors, setErrors] = useState({});
  const [apiMessage, setApiMessage] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
    setApiMessage("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validationErrors = getRegisterErrors(formData);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setApiMessage("");
    try {
      await registerUser(formData).unwrap();
      navigate("/login", {
        state: { message: "Account created successfully. Please login." },
      });
    } catch (error) {
      setApiMessage(error?.data?.message || "Failed to create account. Please try again.");
    }
  };

  return (
    <div className="register-page">
      <form className="form" onSubmit={handleSubmit}>
        
        {apiMessage && <div className="alert error">{apiMessage}</div>}
        {errors.role && <div className="alert error">{errors.role}</div>}

        {/* Name */}
        <div className="flex-column">
          <label>Full Name</label>
        </div>
        <div className="inputForm">
          <input
            name="name"
            className="input"
            placeholder="Enter your name"
            value={formData.name}
            onChange={handleChange}
          />
        </div>
        {errors.name && <span className="field-error">{errors.name}</span>}

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

        {/* Phone */}
        <div className="flex-column">
          <label>Phone</label>
        </div>
        <div className="inputForm">
          <input
            name="phone"
            className="input"
            placeholder="Enter your phone"
            value={formData.phone}
            onChange={handleChange}
          />
        </div>
        {errors.phone && <span className="field-error">{errors.phone}</span>}

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

        {/* Role */}
        <div className="flex-column">
          <label>Register as</label>
        </div>
        <div className="role-container">
          <label className="radio-row">
            <input
              type="radio"
              name="role"
              value={ROLES.OWNER}
              checked={formData.role === ROLES.OWNER}
              onChange={handleChange}
            />
            Owner
          </label>
          <label className="radio-row">
            <input
              type="radio"
              name="role"
              value={ROLES.RENTER}
              checked={formData.role === ROLES.RENTER}
              onChange={handleChange}
            />
            Renter
          </label>
        </div>

        {/* Submit */}
        <button className="button-submit" type="submit" disabled={isLoading}>
          {isLoading ? "Creating account..." : "Create Account"}
        </button>

        {/* Login */}
        <p className="p">
          Already have an account?{" "}
          <Link to="/login" className="span">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Register;