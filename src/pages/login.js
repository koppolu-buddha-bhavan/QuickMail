import React from "react";

const Login = () => {
  const handleLogin = () => {
    window.location.href = "http://localhost:3000/auth"; // Connects to backend OAuth
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <button
        className="px-6 py-3 bg-blue-600 text-white rounded-lg"
        onClick={handleLogin}
      >
        Login with Google
      </button>
    </div>
  );
};

export default Login;
