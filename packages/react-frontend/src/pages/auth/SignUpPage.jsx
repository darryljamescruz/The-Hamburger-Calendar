import { set } from "mongoose";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../utils/api";
// import { prependOnceListener } from "../../../../express-backend/src/models/user";

export default function SignupPage() {
  // Hook to navigate between pages
  const navigate = useNavigate();

  // State variables for form inputs
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // State variables for loading and error handling
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch user data (name) after signup, same as in LoginPage.jsx
  async function getUserData() {
    try {
      const response = await fetch(`/api/auth/${email}`, {
        method: "GET",
      });

      const name = await response.text();
      console.log("getUserData() response: ", name);

      return {
        status: response.status,
        name,
      };
    } catch (error) {
      console.log("Signup getUserData() error:", error);
      return false;
    }
  }

  // Handle form submission
  const handleSubmit = (event) => {
    event.preventDefault();
    setError(""); // clear any previous error messages

    makeSignupCall().then((response) => {
      // Valid credentials, sign user in
      if (response && response.status === 201) {
        const token = response.token;
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        localStorage.setItem("token", token);
        localStorage.setItem("email", email);
        getUserData().then((response) => {
          localStorage.setItem("name", response.name);
          navigate("/month");
        });
      }
      // Invalid credentials, display appropriate error message
      else {
        console.log("Signup error:", response.error);
        setError(response.error);
      }
    });
  };

  // Create user, send data to backend
  async function makeSignupCall() {
    try {
      const user = {
        name: name,
        email: email,
        password: password,
        confirmPassword: confirmPassword,
      };
      const response = await fetch(`${API_URL}auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });

      if (response.ok) {
        const token = await response.text();
        console.log("makeSignupCall() SUCCESS → token:", token);
        return { status: response.status, token };
      } else {
        const errorBody = await response.json();
        console.log("makeSignupCall() ERROR →", errorBody.error);
        return { status: response.status, error: errorBody.error };
      }
    } catch (error) {
      console.log("Signup error:", error);
      return { status: 500, error: "Network error. Please try again." };
    }
  }

  return (
    <div className="flex min-h-screen flex-col justify-center px-6 py-12 lg:px-8 font-inter relative">
      <div className="absolute top-6 left-6">
        <a
          href="/"
          className="text-sm font-semibold text-gray-700 hover:text-gray-900 bg-white/30 backdrop-blur-md px-5 py-2.5 rounded-md shadow-sm "
        >
          ← Back to Home
        </a>
      </div>
      <div className="bg-white/30 backdrop-blur-md p-10 rounded-2xl shadow-lg sm:mx-auto sm:w-full sm:max-w-md">
        {/* Div container for Logo and Title */}
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <div className="flex items-center justify-center gap-3">
            <img
              alt="hamburger"
              src="../../../hamburger.png"
              className="h-10 w-auto"
            />
            <h1 className="text-3xl font-semibold text-gray-900">
              The Hamburger Calendar
            </h1>
          </div>
          <h2 className="mt-10 text-left text-2xl font-inter tracking-tight text-gray-900">
            Create your account
          </h2>
        </div>

        {/* Div container for Form -> Name, Username, Email, Password */}
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name" className="block text-sm text-gray-700">
                Name
              </label>
              <div className="mt-2">
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="block w-full rounded-md bg-white/60 px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                />
              </div>
            </div>
            <div>
              <label htmlFor="email" className="block text-sm text-gray-700">
                Email
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value.toLowerCase())}
                  className="block w-full rounded-md bg-white/60 px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                />
              </div>
            </div>
            <div>
              <label htmlFor="password" className="block text-sm text-gray-700">
                Password
              </label>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full rounded-md bg-white/60 px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="confirmpassword"
                className="block text-sm text-gray-700"
              >
                Confirm password
              </label>
              <div className="mt-2">
                <input
                  id="confirmpassword"
                  name="confirmpassword"
                  type="password"
                  required
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="block w-full rounded-md bg-white/60 px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                />
              </div>
            </div>
            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Sign up
              </button>
            </div>
          </form>

          {/* Error message if the user is not able to sign up */}
          {error && <div className="text-red-600">{error}</div>}

          {/* Div container in case user doesn't have an account, it will navigate the user towards signing up.*/}
          <p className="mt-10 text-left text-sm text-gray-500">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
      >
        <div
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
          className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-indigo-500 to-slate-800 opacity-25 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
        />
      </div>
    </div>
  );
}
