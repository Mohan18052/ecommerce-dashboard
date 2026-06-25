import { useEffect, useMemo, useState, useRef, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import { useGetProductsQuery } from "../../features/products/productsApi";
import { useGetWishlistQuery } from "../../features/wishlist/wishlistApi";
import { selectCartCount, selectCartTotal } from "../../features/cart/cartSlice";
import { loginSuccess, logout } from "../../features/auth/authSlice";

function Profile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.root.auth.user);
  const cartCount = useSelector(selectCartCount);
  const cartTotal = useSelector(selectCartTotal);

  const { data: products = [] } = useGetProductsQuery();
  const { data: wishlistItems = [] } = useGetWishlistQuery();

  const [activeTab, setActiveTab] = useState("info");

  // Editable fields
  const [editField, setEditField] = useState(null);
  const [nameValue, setNameValue] = useState(user?.name || "");
  const [emailValue, setEmailValue] = useState(user?.email || "");
  const [phoneValue, setPhoneValue] = useState(user?.phone || "");
  const [addressValue, setAddressValue] = useState(user?.address || "");
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState("");

  const [pwForm, setPwForm] = useState({ current: "", newPw: "", confirm: "" });
  const [showPw, setShowPw] = useState({ current: false, newPw: false, confirm: false });
  const [pwError, setPwError] = useState("");
  const [pwSuccess, setPwSuccess] = useState(false);
  const [pwSaving, setPwSaving] = useState(false);

  const fileRef = useRef(null);
  const [photoSaving, setPhotoSaving] = useState(false);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => { document.title = "My Account | ShopZone"; }, []);
  useEffect(() => {
    setNameValue(user?.name || "");
    setEmailValue(user?.email || "");
    setPhoneValue(user?.phone || "");
    setAddressValue(user?.address || "");
  }, [user]);

  const memberSince = useMemo(() => new Date().toLocaleDateString("en-IN", { year: "numeric", month: "long" }), []);

  const patchUser = useCallback(async (fields) => {
    const res = await fetch(`http://localhost:4000/users/${user.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(fields),
    });
    if (!res.ok) throw new Error("Failed");
    return res.json();
  }, [user]);

  const handleSaveField = useCallback(async (fieldName, value) => {
    if (!value?.toString().trim()) return;
    setSaving(true);
    try {
      const updated = await patchUser({ [fieldName]: value.trim() });
      dispatch(loginSuccess({ user: updated, token: "fake-jwt-token" }));
      setEditField(null);
      setSaveSuccess(fieldName);
      setTimeout(() => setSaveSuccess(""), 2500);
    } catch { } finally { setSaving(false); }
  }, [patchUser, dispatch]);

  const handlePhotoChange = useCallback(async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { alert("Photo must be under 2MB"); return; }
    setPhotoSaving(true);
    const reader = new FileReader();
    reader.onload = async (ev) => {
      try {
        const updated = await patchUser({ profileImage: ev.target.result });
        dispatch(loginSuccess({ user: updated, token: "fake-jwt-token" }));
      } catch { } finally { setPhotoSaving(false); }
    };
    reader.readAsDataURL(file);
  }, [patchUser, dispatch]);

  const handleChangePassword = useCallback(async (e) => {
    e.preventDefault();
    setPwError("");
    if (!pwForm.current) { setPwError("Enter your current password"); return; }
    if (pwForm.current !== user.password) { setPwError("Current password is incorrect"); return; }
    if (!pwForm.newPw || pwForm.newPw.length < 6) { setPwError("New password must be at least 6 characters"); return; }
    if (pwForm.newPw !== pwForm.confirm) { setPwError("Passwords don't match"); return; }
    setPwSaving(true);
    try {
      const updated = await patchUser({ password: pwForm.newPw });
      dispatch(loginSuccess({ user: updated, token: "fake-jwt-token" }));
      setPwSuccess(true);
      setPwForm({ current: "", newPw: "", confirm: "" });
      setTimeout(() => setPwSuccess(false), 3000);
    } catch { setPwError("Failed to update password"); } finally { setPwSaving(false); }
  }, [pwForm, user, patchUser, dispatch]);

  const handleDeleteAccount = useCallback(async () => {
    try {
      await fetch(`http://localhost:4000/users/${user.id}`, { method: "DELETE" });
      dispatch(logout());
      navigate("/login", { replace: true });
    } catch { alert("Failed to delete account"); }
  }, [user, dispatch, navigate]);

  const getStrength = (pwd) => {
    if (!pwd) return null;
    let s = 0;
    if (pwd.length >= 8) s++;
    if (/[A-Z]/.test(pwd)) s++;
    if (/[0-9]/.test(pwd)) s++;
    if (/[^A-Za-z0-9]/.test(pwd)) s++;
    return [
      { label: "Weak", color: "bg-rose-500", w: "25%" },
      { label: "Fair", color: "bg-amber-500", w: "50%" },
      { label: "Good", color: "bg-blue-500", w: "75%" },
      { label: "Strong", color: "bg-emerald-500", w: "100%" },
    ][s - 1] || { label: "Weak", color: "bg-rose-500", w: "25%" };
  };
  const strength = getStrength(pwForm.newPw);

  const initials = user?.name?.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2) || "U";

  const tabs = [
    { id: "info", label: "Profile", icon: "👤" },
    { id: "password", label: "Security", icon: "🔐" },
    { id: "danger", label: "Settings", icon: "⚙️" },
  ];

  const EditableField = ({ label, fieldName, value, setValue, type = "text" }) => (
    <div className="space-y-1.5">
      <label className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">{label}</label>
      {editField === fieldName ? (
        <div className="flex gap-2">
          {type === "textarea" ? (
            <textarea value={value} onChange={(e) => setValue(e.target.value)} rows={2} autoFocus
              className="flex-1 px-4 py-2.5 text-sm rounded-xl border border-blue-500 bg-slate-50 dark:bg-slate-900 outline-none resize-none" />
          ) : (
            <input type={type} value={value} onChange={(e) => setValue(e.target.value)} autoFocus
              onKeyDown={(e) => { if (e.key === "Enter") handleSaveField(fieldName, value); if (e.key === "Escape") setEditField(null); }}
              className="flex-1 px-4 py-2.5 text-sm rounded-xl border border-blue-500 bg-slate-50 dark:bg-slate-900 outline-none" />
          )}
          <button onClick={() => handleSaveField(fieldName, value)} disabled={saving}
            className="bg-blue-600 text-white text-xs font-bold px-4 py-2 rounded-xl cursor-pointer hover:bg-blue-700 transition-colors disabled:opacity-50">
            {saving ? "..." : "Save"}
          </button>
          <button onClick={() => setEditField(null)} className="text-slate-400 px-2 cursor-pointer hover:text-slate-600">✕</button>
        </div>
      ) : (
        <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-200/50 dark:border-slate-800/60 group hover:border-blue-500/30 transition-colors">
          <span className="text-sm font-medium truncate">{value || "—"}</span>
          <button onClick={() => setEditField(fieldName)}
            className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer opacity-60 group-hover:opacity-100 transition-opacity">
            Edit
          </button>
        </div>
      )}
      {saveSuccess === fieldName && <p className="text-xs text-emerald-500 font-medium">✓ Updated successfully</p>}
    </div>
  );

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-slate-50 dark:bg-[#0b0f19] text-slate-800 dark:text-slate-100 antialiased transition-colors duration-200">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">

          {/* ── Page Header ── */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight">Account Settings</h1>
              <p className="text-sm text-slate-400 mt-1">Manage your profile and preferences</p>
            </div>
            <div className="flex gap-2">
              {tabs.map((tab) => (
                <button key={tab.id} onClick={() => { setActiveTab(tab.id); setShowDeleteConfirm(false); }}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                    activeTab === tab.id
                      ? "bg-blue-600 text-white border-transparent shadow-md"
                      : "bg-white dark:bg-[#131c2e] text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-blue-500/40"
                  }`}>
                  <span>{tab.icon}</span><span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

            {/* ── LEFT SIDEBAR ── */}
            <div className="lg:col-span-4 xl:col-span-3 space-y-5">

              {/* Profile Identity Card */}
              <div className="bg-white dark:bg-[#131c2e] rounded-2xl p-6 shadow-sm border border-slate-200/60 dark:border-slate-800/80 text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-r from-blue-600 to-indigo-600" />
                <div className="relative pt-4 space-y-3">
                  <div className="relative mx-auto w-24 h-24 rounded-2xl overflow-hidden shadow-lg border-4 border-white dark:border-slate-800 ring-4 ring-blue-500/10">
                    {user?.profileImage ? (
                      <img src={user.profileImage} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-3xl font-black text-white">
                        {initials}
                      </div>
                    )}
                    <button onClick={() => fileRef.current?.click()} disabled={photoSaving}
                      className="absolute bottom-0 right-0 w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-lg hover:bg-blue-700 transition-all cursor-pointer text-sm">
                      {photoSaving ? "..." : "📷"}
                    </button>
                  </div>
                  <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
                  <h2 className="text-lg font-extrabold truncate">{user?.name || "User"}</h2>
                  <p className="text-xs text-slate-400 truncate">{user?.email}</p>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/50">
                    <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                    <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                      {user?.role === "admin" ? "Admin" : "Customer"}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 pt-1">Member since {memberSince}</p>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { val: wishlistItems.length, label: "Wishlist", color: "text-rose-500", bg: "bg-rose-50 dark:bg-rose-950/20" },
                  { val: cartCount, label: "Cart", color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-950/20" },
                  { val: `₹${cartTotal.toLocaleString("en-IN")}`, label: "Value", color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-950/20" }
                ].map((item, idx) => (
                  <div key={idx} className={`${item.bg} p-3 rounded-xl border border-slate-200/30 dark:border-slate-800/30 text-center`}>
                    <span className={`block text-lg font-extrabold ${item.color}`}>{item.val}</span>
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">{item.label}</span>
                  </div>
                ))}
              </div>

              {/* Quick Info */}
              <div className="bg-white dark:bg-[#131c2e] rounded-2xl p-5 shadow-sm border border-slate-200/60 dark:border-slate-800/80 space-y-3">
                <h3 className="text-xs font-bold uppercase text-slate-400 tracking-widest">Quick Info</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-slate-400">User ID</span><span className="font-mono font-bold">#{user?.id}</span></div>
                  <div className="flex justify-between"><span className="text-slate-400">Phone</span><span className="font-medium">{user?.phone || "Not set"}</span></div>
                  <div className="flex justify-between"><span className="text-slate-400">Products</span><span className="font-bold">{products.length}</span></div>
                </div>
              </div>
            </div>

            {/* ── RIGHT CONTENT ── */}
            <div className="lg:col-span-8 xl:col-span-9">
              <div className="bg-white dark:bg-[#131c2e] rounded-2xl shadow-sm border border-slate-200/60 dark:border-slate-800/80 p-6 md:p-8">

                {/* TAB 1: PROFILE INFO */}
                {activeTab === "info" && (
                  <div className="space-y-8 animate-fadeIn">
                    <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
                      <h3 className="text-xl font-extrabold tracking-tight">Personal Information</h3>
                      <p className="text-xs text-slate-400 mt-1">Update your personal details</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <EditableField label="Full Name" fieldName="name" value={nameValue} setValue={setNameValue} />
                      <EditableField label="Email Address" fieldName="email" value={emailValue} setValue={setEmailValue} type="email" />
                      <EditableField label="Phone Number" fieldName="phone" value={phoneValue} setValue={setPhoneValue} type="tel" />
                      <div className="md:col-span-2">
                        <EditableField label="Address" fieldName="address" value={addressValue} setValue={setAddressValue} type="textarea" />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Account Type</label>
                        <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-200/50 dark:border-slate-800/60 flex items-center gap-3">
                          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                          <span className="text-sm font-bold">{user?.role === "admin" ? "Admin" : "Customer"}</span>
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">User ID</label>
                        <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-200/50 dark:border-slate-800/60">
                          <span className="text-sm font-mono font-bold">#{user?.id}</span>
                        </div>
                      </div>
                    </div>

                    {/* Saved Cards (decorative) */}
                    <div className="pt-4 border-t border-slate-100 dark:border-slate-800/60 space-y-4">
                      <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400">Saved Cards</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="p-4 rounded-xl bg-gradient-to-br from-slate-800 to-slate-950 border border-slate-700/50 text-white relative overflow-hidden h-28 flex flex-col justify-between">
                          <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-white/5 rounded-full blur-xl" />
                          <div className="flex justify-between items-start">
                            <span className="text-[10px] font-mono tracking-widest opacity-60">HDFC BANK</span>
                            <span className="text-xs font-black italic text-orange-400">VISA</span>
                          </div>
                          <div>
                            <p className="text-xs font-mono tracking-widest">•••• •••• •••• 4012</p>
                            <p className="text-[9px] font-bold uppercase tracking-wider opacity-40 mt-1">Expires 12/29</p>
                          </div>
                        </div>
                        <div className="p-4 rounded-xl bg-gradient-to-br from-blue-900 to-indigo-950 border border-blue-800/50 text-white h-28 flex flex-col justify-between">
                          <div className="flex justify-between items-start">
                            <span className="text-[10px] font-mono tracking-widest opacity-60">SBI CARD</span>
                            <span className="text-xs font-black italic text-red-400">MasterCard</span>
                          </div>
                          <div>
                            <p className="text-xs font-mono tracking-widest">•••• •••• •••• 8845</p>
                            <p className="text-[9px] font-bold uppercase tracking-wider opacity-40 mt-1">Expires 05/31</p>
                          </div>
                        </div>
                        <div className="p-4 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 hover:border-blue-500/50 transition-colors flex flex-col items-center justify-center gap-2 text-center h-28 cursor-pointer group">
                          <span className="text-xl group-hover:scale-110 transition-transform">💳</span>
                          <span className="text-xs font-bold text-slate-400 group-hover:text-blue-500">+ Add Card</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 2: SECURITY */}
                {activeTab === "password" && (
                  <div className="space-y-6 animate-fadeIn">
                    <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
                      <h3 className="text-xl font-extrabold tracking-tight">Security</h3>
                      <p className="text-xs text-slate-400 mt-1">Change your password regularly</p>
                    </div>

                    {pwSuccess && <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/50 rounded-xl text-xs font-semibold">✓ Password updated successfully</div>}
                    {pwError && <div className="p-4 bg-rose-50 dark:bg-rose-950/20 text-rose-500 border border-rose-200 dark:border-rose-900/50 rounded-xl text-xs font-semibold">⚠️ {pwError}</div>}

                    <form onSubmit={handleChangePassword} className="max-w-lg space-y-5">
                      {[
                        { key: "current", label: "Current Password" },
                        { key: "newPw", label: "New Password" },
                        { key: "confirm", label: "Confirm New Password" },
                      ].map(({ key, label }) => (
                        <div key={key} className="space-y-1.5">
                          <label className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">{label}</label>
                          <div className="relative">
                            <input
                              type={showPw[key] ? "text" : "password"}
                              value={pwForm[key]}
                              onChange={(e) => { setPwForm((p) => ({ ...p, [key]: e.target.value })); setPwError(""); }}
                              className="w-full text-sm px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                            />
                            <button type="button" onClick={() => setShowPw((p) => ({ ...p, [key]: !p[key] }))} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-xs cursor-pointer">
                              {showPw[key] ? "🙈" : "👁️"}
                            </button>
                          </div>
                          {key === "newPw" && strength && (
                            <div className="space-y-1 mt-1.5">
                              <div className="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                <div className={`h-full transition-all duration-500 ${strength.color}`} style={{ width: strength.w }} />
                              </div>
                              <span className="text-[10px] text-slate-400 font-bold">{strength.label}</span>
                            </div>
                          )}
                        </div>
                      ))}
                      <button type="submit" disabled={pwSaving} className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm px-6 py-3 rounded-xl shadow-md cursor-pointer transition-colors disabled:opacity-50">
                        {pwSaving ? "Updating..." : "Update Password"}
                      </button>
                    </form>
                  </div>
                )}

                {/* TAB 3: DANGER ZONE */}
                {activeTab === "danger" && (
                  <div className="space-y-6 animate-fadeIn">
                    <div className="border-b border-rose-100 dark:border-rose-950 pb-4">
                      <h3 className="text-xl font-extrabold text-rose-500 tracking-tight">Danger Zone</h3>
                      <p className="text-xs text-rose-400/80 mt-1">Irreversible actions</p>
                    </div>

                    <div className="border-2 border-dashed border-rose-200 dark:border-rose-900/40 p-6 rounded-2xl bg-rose-50/30 dark:bg-rose-950/5 space-y-4">
                      <div>
                        <h4 className="text-base font-extrabold">Delete Account</h4>
                        <p className="text-xs text-slate-400 mt-1">Once deleted, all your data will be permanently removed.</p>
                      </div>

                      {!showDeleteConfirm ? (
                        <button onClick={() => setShowDeleteConfirm(true)} className="bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs px-5 py-2.5 rounded-xl cursor-pointer transition-colors">
                          Delete Account
                        </button>
                      ) : (
                        <div className="p-4 bg-white dark:bg-[#0b0f19] border border-rose-200 dark:border-rose-900/60 rounded-xl space-y-3">
                          <p className="text-xs text-rose-500 font-bold">⚠️ Are you sure? This cannot be undone.</p>
                          <div className="flex gap-2">
                            <button onClick={handleDeleteAccount} className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs px-4 py-2 rounded-xl cursor-pointer transition-colors">
                              Yes, Delete
                            </button>
                            <button onClick={() => setShowDeleteConfirm(false)} className="bg-slate-100 dark:bg-slate-800 text-xs font-bold px-4 py-2 rounded-xl cursor-pointer">
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

              </div>
            </div>

          </div>
        </div>
      </main>
    </>
  );
}

export default Profile;