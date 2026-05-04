import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import { useLoginMutation } from "../../store/api/authApi";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import "./style.css";

// 🔥 Zod schema
const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [loginUser, { isLoading }] = useLoginMutation();

  const [apiMessage, setApiMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const successMessage = location.state?.message || "";

  // react-hook-form setup
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  // submit handler
  const onSubmit = async (data) => {
    setApiMessage("");

    try {
      const payload = await loginUser(data).unwrap();

      login({
        token: payload.token,
        user: payload.data,
      });

      navigate("/dashboard");
    } catch (error) {
      if (error?.status === "FETCH_ERROR") {
        setApiMessage("Network error. Please try again.");
      } else {
        setApiMessage(error?.data?.message || "Invalid email or password.");
      }
    }
  };

  return (
    <div className="login-page">
      <form className="form" onSubmit={handleSubmit(onSubmit)}>
        {/* SUCCESS */}
        {successMessage && (
          <div className="alert success">{successMessage}</div>
        )}

        {/* API ERROR */}
        {apiMessage && <div className="alert error">{apiMessage}</div>}

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

          <span
            className="toggle-password"
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? "🙈" : "👁️"}
          </span>
        </div>

        <span className="field-error">{errors.password?.message}</span>

        {/* REMEMBER + FORGOT */}
        <div className="flex-row">
          <div className="remember">
            <input type="checkbox" />
            <label>Remember me</label>
          </div>
          <span className="span">Forgot password?</span>
        </div>

        {/* SUBMIT */}
        <button
          className="button-submit"
          type="submit"
          disabled={isSubmitting || isLoading}
        >
          {isLoading ? "Logging in..." : "Sign In"}
        </button>

        {/* REGISTER */}
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
