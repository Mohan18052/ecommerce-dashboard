import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Step 2: Enter new password → PATCH to /users/:id → redirect to login

function ResetPassword() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ password: "", confirmPassword: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const userId = sessionStorage.getItem("resetUserId");
  const resetEmail = sessionStorage.getItem("resetEmail");

  useEffect(() => {
    document.title = "Reset Password — ShopZone";
    // Guard: if someone lands here directly without going through ForgotPassword
    if (!userId) {
      navigate("/forgot-password", { replace: true });
    }
  }, [userId, navigate]);

  const handleChange = useCallback((e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  }, []);

  const getStrength = (pwd) => {
    if (!pwd) return { label: "", color: "", width: "0%" };
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    const map = [
      { label: "Weak",   color: "bg-red-400",    width: "25%" },
      { label: "Fair",   color: "bg-orange-400",  width: "50%" },
      { label: "Good",   color: "bg-yellow-400",  width: "75%" },
      { label: "Strong", color: "bg-green-500",   width: "100%" },
    ];
    return map[score - 1] || map[0];
  };

  const strength = getStrength(formData.password);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();

    if (!formData.password) {
      setError("Please enter a new password");
      return;
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch(`http://localhost:4000/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: formData.password }),
      });

      if (!res.ok) throw new Error("Failed to update password");

      // Clear session
      sessionStorage.removeItem("resetUserId");
      sessionStorage.removeItem("resetEmail");

      setSuccess(true);

      // Redirect to login after 2s
      setTimeout(() => navigate("/login", { replace: true }), 2000);
    } catch (err) {
      setError("Failed to reset password. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [formData, userId, navigate]);

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-primary to-primary-light p-4">
        <div className="w-full max-w-md">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 text-center">
            <div className="text-5xl mb-4">✅</div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Password Reset!</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Your password has been updated successfully.</p>
            <p className="text-xs text-gray-400 dark:text-gray-500">Redirecting to login...</p>
            <div className="mt-4 w-8 h-8 border-2 border-gray-300 dark:border-gray-600 border-t-amber-400 rounded-full animate-spin mx-auto" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-primary to-primary-light p-4">
      <div className="w-full max-w-md">

        <div className="text-center mb-8">
          <div className="text-4xl mb-2">🔑</div>
          <h1 className="text-3xl font-bold text-white">Shop<span className="text-accent">Zone</span></h1>
          <p className="text-gray-400 text-sm mt-1">Set New Password</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8">

          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">Create new password</h2>
          {resetEmail && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              Resetting password for <span className="font-semibold text-gray-700 dark:text-gray-200">{resetEmail}</span>
            </p>
          )}

          {error && (
            <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm px-4 py-3 rounded-lg mb-4">
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* New Password */}
            <div>
              <label htmlFor="rp-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                New Password
              </label>
              <div className="relative">
                <input
                  id="rp-password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter new password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 pr-11 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all text-sm"
                  autoFocus
                />
                <button type="button" onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer">
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>

              {/* Strength bar */}
              {formData.password && (
                <div className="mt-2">
                  <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all duration-300 ${strength.color}`} style={{ width: strength.width }} />
                  </div>
                  <p className={`text-xs mt-1 font-medium ${
                    strength.label === "Strong" ? "text-green-500" :
                    strength.label === "Good"   ? "text-yellow-500" :
                    strength.label === "Fair"   ? "text-orange-400" : "text-red-400"
                  }`}>{strength.label}</p>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="rp-confirm" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="rp-confirm"
                  type={showConfirm ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Re-enter new password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-4 py-3 pr-11 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all text-sm"
                />
                <button type="button" onClick={() => setShowConfirm((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer">
                  {showConfirm ? "🙈" : "👁️"}
                </button>
              </div>
              {/* Match indicator */}
              {formData.confirmPassword && (
                <p className={`text-xs mt-1 font-medium ${formData.password === formData.confirmPassword ? "text-green-500" : "text-red-400"}`}>
                  {formData.password === formData.confirmPassword ? "✓ Passwords match" : "✗ Passwords don't match"}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-amber-400 hover:bg-amber-500 text-gray-900 font-bold py-3 rounded-lg transition-colors shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed text-sm cursor-pointer"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-gray-900/30 border-t-gray-900 rounded-full animate-spin" />
                  Resetting...
                </span>
              ) : "Reset Password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
