import { useState, useCallback, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

// Step 1: Enter email → check db.json → if found, go to reset page

function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => { document.title = "Forgot Password — ShopZone"; }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed) {
      setError("Please enter your email address");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmed)) {
      setError("Please enter a valid email address");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch(`http://localhost:4000/users?email=${encodeURIComponent(trimmed)}`);
      if (!res.ok) throw new Error("Server error");
      const users = await res.json();

      if (!users.length) {
        setError("No account found with this email address");
        setLoading(false);
        return;
      }

      const user = users[0];

      // Store in sessionStorage so ResetPassword page can use it
      // No token / OTP — pure mock flow
      sessionStorage.setItem("resetUserId", user.id);
      sessionStorage.setItem("resetEmail", trimmed);

      navigate("/reset-password");
    } catch (err) {
      setError("Unable to connect to server. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [email, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-primary to-primary-light p-4">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="text-4xl mb-2">🔐</div>
          <h1 className="text-3xl font-bold text-white">Shop<span className="text-accent">Zone</span></h1>
          <p className="text-gray-400 text-sm mt-1">Password Recovery</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8">

          {/* Back arrow */}
          <Link
            to="/login"
            className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white mb-5 transition-colors"
          >
            ← Back to Login
          </Link>

          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">Forgot your password?</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            Enter the email linked to your account and we'll help you reset your password.
          </p>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm px-4 py-3 rounded-lg mb-4">
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="fp-email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email address
              </label>
              <input
                id="fp-email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(""); }}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all text-sm"
                autoComplete="email"
                autoFocus
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-amber-400 hover:bg-amber-500 text-gray-900 font-bold py-3 rounded-lg transition-colors shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed text-sm cursor-pointer"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-gray-900/30 border-t-gray-900 rounded-full animate-spin" />
                  Checking...
                </span>
              ) : "Continue"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
