import React, { useState } from "react";
import { API_URL } from "../../utils/api";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  // hook to navigate between pages
  const navigate = useNavigate();

  // State variables for form inputs
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // State variables for loading and error handling
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    setError(""); // clear any previous error messages

    makeLoginCall().then((response) => {
      if (response && response.status === 200) {
        // Valid credentials, sign user in
        const token = response.token;
        localStorage.setItem("token", token);
        localStorage.setItem("email", email);
        getUserData().then((response) => {
          localStorage.setItem("name", response.name);
          window.location.reload(); // refreshes page to load name data
        });
        setEmail("");
        setPassword("");
        //console.log("Login form submitted with:", {
        //  email,
        //  password,
        //});
        navigate("/month"); // render by default the month view, but TODO: change to user's default view
      }
      // Invalid credentials, display appropriate error message
      else {
        console.log("Login error:", response.error);
        setError(response.error);
      }
    });
  };

  // Create user, send data to backend
  async function makeLoginCall() {
    try {
      const user = {
        email: email,
        password: password,
      };
      const response = await fetch(`${API_URL}auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });

      if (response.ok) {
        const token = await response.text();
        console.log("makeLoginCall() SUCCESS → token:", token);
        return { status: response.status, token };
      } else {
        const errorBody = await response.json();
        console.log("makeLoginCall() ERROR →", errorBody.error);
        return { status: response.status, error: errorBody.error };
      }
    } catch (error) {
      console.log("Login error:", error);
      return { status: 500, error: "Network error. Please try again." };
    }
  }

  async function getUserData() {
    try {
      const response = await fetch(`${API_URL}auth/${email}`, {
        method: "GET",
      });

      const name = await response.text();

      console.log("getUserData() response: ", name);

      return {
        status: response.status,
        name,
      };
    } catch (error) {
      console.log("Login error:", error);
      return false;
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
        <div className="flex items-center gap-3 mb-2">
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
          Sign in to your account
        </h2>

        <div className="mt-8">
          {/* Div container for Form -> Username (their) and Password */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm text-gray-700">
                Email
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="text"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value.toLowerCase())}
                  className="block w-full rounded-md bg-white/60 px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm/6 text-gray-700"
                >
                  Password
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full rounded-md bg-white/60 px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Sign in
              </button>
            </div>
          </form>
          {error && <div className="text-red-600">{error}</div>}

          {/* Div container in case user doesn't have an account, it will navigate the user towards signing up.*/}
          <p className="mt-10 text-left text-sm text-gray-500">
            Don't have an account?
            <Link
              to="/register"
              className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
            >
              {" "}
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
