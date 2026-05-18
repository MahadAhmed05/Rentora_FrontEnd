import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ROLES } from "../../constants";
import { useRegisterMutation } from "../../store/api/authApi";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

import "./style.css";

// 🔥 Zod Schema
const registerSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Enter a valid email"),
  phone: z
    .string()
    .min(10, "Phone must be at least 10 digits")
    .max(15, "Phone is too long"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum([ROLES.OWNER, ROLES.RENTER], {
    errorMap: () => ({ message: "Please select a role" }),
  }),
});

const Register = () => {
  const navigate = useNavigate();
  const [registerUser, { isLoading }] = useRegisterMutation();

  const [apiMessage, setApiMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const selectedRole = watch("role");

  // submit
  const onSubmit = async (data) => {
    setApiMessage("");

    try {
      await registerUser(data).unwrap();

      navigate("/login", {
        state: { message: "Account created successfully. Please login." },
      });
    } catch (error) {
      if (error?.status === "FETCH_ERROR") {
        setApiMessage("Network error. Please try again.");
      } else {
        setApiMessage(error?.data?.message || "Failed to create account.");
      }
    }
  };

  return (
    <div className="register-page">
      <form className="form" onSubmit={handleSubmit(onSubmit)}>
        {/* API ERROR */}
        {apiMessage && <div className="alert error">{apiMessage}</div>}

        {/* NAME */}
        <div className="flex-column">
          <label>Full Name</label>
        </div>

        <div className="inputForm">
          <input
            className="input"
            placeholder="Enter your name"
            {...register("name")}
          />
        </div>
        <span className="field-error">{errors.name?.message}</span>

        {/* EMAIL */}
        <div className="flex-column">
          <label>Email</label>
        </div>

        <div className="inputForm">
          <input
            type="email"
            className="input"
            placeholder="Enter your Email"
            {...register("email")}
          />
        </div>
        <span className="field-error">{errors.email?.message}</span>

        {/* PHONE */}
        <div className="flex-column">
          <label>Phone</label>
        </div>

        <div className="inputForm">
          <input
            className="input"
            placeholder="Enter your phone"
            {...register("phone")}
          />
        </div>
        <span className="field-error">{errors.phone?.message}</span>

        {/* PASSWORD */}
        <div className="flex-column">
          <label>Password</label>
        </div>

        <div className="inputForm password-wrapper">
          <input
            type={showPassword ? "text" : "password"}
            className="input"
            placeholder="Enter your Password"
            {...register("password")}
          />

          <button
            type="button"
            className="toggle-password"
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <VisibilityOffIcon fontSize="small" />
            ) : (
              <VisibilityIcon fontSize="small" />
            )}
          </button>
        </div>
        <span className="field-error">{errors.password?.message}</span>

        {/* ROLE */}
        <div className="flex-column">
          <label>Register as</label>
        </div>

        <div className="role-container">
          <label className="radio-row">
            <input
              type="radio"
              value={ROLES.OWNER}
              checked={selectedRole === ROLES.OWNER}
              onChange={() => setValue("role", ROLES.OWNER)}
            />
            Owner
          </label>

          <label className="radio-row">
            <input
              type="radio"
              value={ROLES.RENTER}
              checked={selectedRole === ROLES.RENTER}
              onChange={() => setValue("role", ROLES.RENTER)}
            />
            Renter
          </label>
        </div>

        <span className="field-error">{errors.role?.message}</span>

        {/* SUBMIT */}
        <button
          className="button-submit"
          type="submit"
          disabled={isSubmitting || isLoading}
        >
          {isLoading ? "Creating account..." : "Create Account"}
        </button>

        {/* LOGIN */}
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
