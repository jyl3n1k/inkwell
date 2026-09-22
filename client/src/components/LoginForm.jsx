import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { saveToken } from "../lib/auth";

export function LoginForm() {
  const [status, setStatus] = useState("idle");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const navigate = useNavigate();

  async function handleLogin(event) {
    event.preventDefault();
    setStatus("submitting");
    setErrorMessage(null);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error?.message || "Login failed.");
      }
      saveToken(data.accessToken);
      navigate("/");
    } catch (error) {
      setErrorMessage(error.message || "Something went wrong. Please try again.");
      setStatus("idle");
    }
  }

  return (
    <form className="space-y-4" onSubmit={handleLogin}>
      <div>
        <label htmlFor="login-email" className="block font-medium">Email</label>
        <input
          id="login-email"
          type="email"
          autoComplete="username"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          aria-describedby={errorMessage ? "login-error" : undefined}
          className="mt-1 block w-full rounded"
        />
      </div>
      <div>
        <label htmlFor="login-password" className="block font-medium">Password</label>
        <input
          id="login-password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="mt-1 block w-full rounded"
        />
      </div>
      {errorMessage && (
        <p id="login-error" role="alert" className="text-red-600">{errorMessage}</p>
      )}
      <button
        type="submit"
        disabled={status === "submitting"}
        className="rounded bg-indigo-600 px-4 py-2 text-white disabled:opacity-50"
      >
        {status === "submitting" ? "Logging in..." : "Log In"}
      </button>
    </form>
  );
}
