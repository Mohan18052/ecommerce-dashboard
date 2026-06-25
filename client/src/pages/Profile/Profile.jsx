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

  const [editingName, setEditingName] = useState(false);
  const [nameValue, setNameValue] = useState(user?.name || "");
  const [nameSaving, setNameSaving] = useState(false);
  const [nameSuccess, setNameSuccess] = useState(false);

  const [activeTab, setActiveTab] = useState("info");

  const [pwForm, setPwForm] = useState({ current: "", newPw: "", confirm: "" });
  const [showPw, setShowPw] = useState({ current: false, newPw: false, confirm: false });
  const [pwError, setPwError] = useState("");
  const [pwSuccess, setPwSuccess] = useState(false);
  const [pwSaving, setPwSaving] = useState(false);

  const fileRef = useRef(null);
  const [photoSaving, setPhotoSaving] = useState(false);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => { document.title = "My Account | ShopZone"; }, []);
  useEffect(() => { setNameValue(user?.name || ""); }, [user]);

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

  const handleSaveName = useCallback(async () => {
    if (!nameValue.trim()) return;
    setNameSaving(true);
    try {
      const updated = await patchUser({ name: nameValue.trim() });
      dispatch(loginSuccess({ user: updated, token: "fake-jwt-token" }));
      setEditingName(false);
      setNameSuccess(true);
      setTimeout(() => setNameSuccess(false), 2500);
    } catch { } finally { setNameSaving(false); }
  }, [nameValue, patchUser, dispatch]);

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
      { label: "Weak Pass", color: "bg-rose-500", w: "25%" },
      { label: "Fair Pass", color: "bg-amber-500", w: "50%" },
      { label: "Good Shield", color: "bg-blue-500", w: "75%" },
      { label: "Strong Shield", color: "bg-emerald-500", w: "100%" },
    ][s - 1] || { label: "Weak Pass", color: "bg-rose-500", w: "25%" };
  };
  const strength = getStrength(pwForm.newPw);

  const initials = user?.name?.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2) || "U";

  const tabs = [
    { id: "info", label: "Profile Information", icon: "👤", desc: "Manage your personal credentials" },
    { id: "password", label: "Security & Passwords", icon: "🔐", desc: "Update credentials & lock account" },
    { id: "danger", label: "Account Settings", icon: "⚙️", desc: "Deactivation and service controls" },
  ];

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-slate-50 dark:bg-[#0b0f19] text-slate-800 dark:text-slate-100 antialiased py-10 transition-colors duration-200">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* ── LEFT CONTAINER: SIDEBAR NAVIGATION ── */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Profile Header Identity Card */}
            <div className="bg-white dark:bg-[#131c2e] rounded-2xl p-6 shadow-md border border-slate-200/60 dark:border-slate-800/80 flex items-center gap-5 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-xl group-hover:scale-125 transition-transform duration-500" />
              <div className="relative flex-shrink-0">
                <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-md border-2 border-white dark:border-slate-700 ring-4 ring-blue-500/10">
                  {user?.profileImage ? (
                    <img src={user.profileImage} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-2xl font-black text-white tracking-wider">
                      {initials}
                    </div>
                  )}
                </div>
                <button
                  onClick={() => fileRef.current?.click()}
                  disabled={photoSaving}
                  className="absolute -bottom-1 -right-1 w-6 h-6 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow hover:bg-blue-700 transition-all cursor-pointer"
                >
                  <span className="text-[11px] font-bold">{photoSaving ? "..." : "✏️"}</span>
                </button>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
              </div>
              <div className="min-w-0">
                <span className="text-[11px] font-bold tracking-wider text-blue-600 dark:text-blue-400 uppercase">Welcome back,</span>
                <h2 className="text-xl font-black truncate tracking-tight">{user?.name || "User"}</h2>
                <p className="text-xs text-slate-400 dark:text-slate-500 truncate mt-0.5">{user?.email}</p>
              </div>
            </div>

            {/* Micro Dashboard Stats Strip */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { val: wishlistItems.length, label: "Wishlist", color: "text-rose-500", bg: "bg-rose-50 dark:bg-rose-950/20" },
                { val: cartCount, label: "Cart Items", color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-950/20" },
                { val: `₹${cartTotal}`, label: "Total Value", color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-950/20" }
              ].map((item, idx) => (
                <div key={idx} className={`${item.bg} p-3 rounded-xl border border-slate-200/30 dark:border-slate-800/30 text-center transition-all hover:-translate-y-0.5`}>
                  <span className={`block text-lg font-black ${item.color}`}>{item.val}</span>
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">{item.label}</span>
                </div>
              ))}
            </div>

            {/* Navigation Menu */}
            <div className="bg-white dark:bg-[#131c2e] rounded-2xl shadow-md border border-slate-200/60 dark:border-slate-800/80 p-2 hidden lg:block">
              <div className="space-y-1">
                {tabs.map((tab) => {
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => { setActiveTab(tab.id); setShowDeleteConfirm(false); }}
                      className={`w-full group flex items-center gap-4 px-4 py-3.5 rounded-xl text-left transition-all cursor-pointer ${
                        isActive 
                          ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20 font-bold" 
                          : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/40"
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm transition-colors ${isActive ? "bg-white/20" : "bg-slate-100 dark:bg-slate-800 group-hover:bg-blue-500/10"}`}>
                        {tab.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold tracking-tight">{tab.label}</p>
                        <p className={`text-[10px] mt-0.5 truncate ${isActive ? "text-blue-100" : "text-slate-400"}`}>{tab.desc}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Mobile Tab Swapper */}
          <div className="flex gap-2 lg:hidden overflow-x-auto pb-2 -mt-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); setShowDeleteConfirm(false); }}
                className={`whitespace-nowrap flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm border ${
                  activeTab === tab.id
                    ? "bg-blue-600 text-white border-transparent"
                    : "bg-white dark:bg-[#131c2e] text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800"
                }`}
              >
                <span>{tab.icon}</span> <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* ── RIGHT CONTAINER: DYNAMIC WORKSPACE PANEL ── */}
          <div className="lg:col-span-8">
            <div className="bg-white dark:bg-[#131c2e] rounded-2xl shadow-md border border-slate-200/60 dark:border-slate-800/80 p-6 md:p-8">
              
              {/* TAB 1: CORE PERSONAL DATA PANEL */}
              {activeTab === "info" && (
                <div className="space-y-8 animate-fadeIn">
                  <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
                    <h3 className="text-xl font-black tracking-tight">Personal Information</h3>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Control your display identification information used contextually across ShopZone.</p>
                  </div>

                  {/* Core Form Matrix */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Full Name</label>
                      {editingName ? (
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={nameValue}
                            onChange={(e) => setNameValue(e.target.value)}
                            onKeyDown={(e) => { if (e.key === "Enter") handleSaveName(); if (e.key === "Escape") { setEditingName(false); setNameValue(user?.name || ""); }}}
                            autoFocus
                            className="flex-1 px-4 py-2 text-sm rounded-xl border border-blue-500 bg-slate-50 dark:bg-slate-900 outline-none"
                          />
                          <button onClick={handleSaveName} disabled={nameSaving} className="bg-blue-600 text-white text-xs font-bold px-4 py-2 rounded-xl">
                            {nameSaving ? "..." : "Save"}
                          </button>
                          <button onClick={() => { setEditingName(false); setNameValue(user?.name || ""); }} className="text-slate-400 px-2">✕</button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-200/50 dark:border-slate-800/60">
                          <span className="text-sm font-bold tracking-tight">{user?.name || "User"}</span>
                          <button onClick={() => setEditingName(true)} className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">
                            Modify ➡️
                          </button>
                        </div>
                      )}
                      {nameSuccess && <p className="text-xs text-emerald-500 font-medium">✓ Name changed successfully</p>}
                    </div>

                    <div className="space-y-2">
                      <label className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Email Address</label>
                      <div className="bg-slate-100/80 dark:bg-slate-900/30 p-4 rounded-xl text-sm font-medium text-slate-500 dark:text-slate-400 border border-slate-200/40 dark:border-slate-800/40 truncate cursor-not-allowed">
                        {user?.email || "—"}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Account Clearance Tier</label>
                      <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-200/50 dark:border-slate-800/60 flex items-center gap-3">
                        <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                        <span className="text-sm font-bold tracking-tight">
                          {user?.role === "admin" ? "Platform Executive Admin" : "Verified Customer Portal Access"}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">System Fingerprints</label>
                      <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-200/50 dark:border-slate-800/60 text-xs text-slate-400 dark:text-slate-500 space-y-1">
                        <p className="flex justify-between"><span>User ID:</span> <span className="font-mono font-bold text-slate-600 dark:text-slate-300">#{user?.id}</span></p>
                        <p className="flex justify-between"><span>Created:</span> <span className="font-bold text-slate-600 dark:text-slate-300">{memberSince}</span></p>
                      </div>
                    </div>
                  </div>

                  {/* ── NEW: SPACE FILLER 1 - SAVED ADDRESSES ── */}
                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800/60 space-y-4">
                    <div className="flex justify-between items-center">
                      <h4 className="text-sm font-black uppercase tracking-wider text-slate-400">Default Delivery Address</h4>
                      <button className="text-xs font-bold text-blue-500 hover:underline cursor-pointer">+ Add New Address</button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 rounded-xl border-2 border-blue-500/30 bg-blue-500/[0.02] relative">
                        <span className="absolute top-3 right-3 text-[10px] font-bold bg-blue-500/10 text-blue-500 px-2 py-0.5 rounded-full">HOME (DEFAULT)</span>
                        <p className="text-sm font-bold">{user?.name || "User"}</p>
                        <p className="text-xs text-slate-400 dark:text-slate-500 mt-2 leading-relaxed">
                          Plot No. 42, Alpha Tech Park, Phase II,<br />
                          OMR Road, Sholinganallur,<br />
                          Chennai, Tamil Nadu - 600119
                        </p>
                        <p className="text-xs font-bold mt-2">Phone: +91 98765 43210</p>
                      </div>
                      <div className="p-4 rounded-xl border border-slate-200/60 dark:border-slate-800/60 hover:border-slate-400/60 transition-colors flex flex-col justify-between group cursor-pointer">
                        <div>
                          <span className="text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full">OFFICE</span>
                          <p className="text-sm font-bold mt-1">{user?.name || "User"}</p>
                          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Global Tech Village, Bengaluru, Karnataka</p>
                        </div>
                        <span className="text-xs text-blue-500 font-semibold group-hover:underline mt-4">Manage Address</span>
                      </div>
                    </div>
                  </div>

                  {/* ── NEW: SPACE FILLER 2 - PAYMENT CARDS ── */}
                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800/60 space-y-4">
                    <h4 className="text-sm font-black uppercase tracking-wider text-slate-400">Saved Wallet & Cards</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="p-4 rounded-xl bg-gradient-to-br from-slate-800 to-slate-950 border border-slate-700/50 shadow-sm text-white relative overflow-hidden h-28 flex flex-col justify-between">
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
                      <div className="p-4 rounded-xl bg-gradient-to-br from-blue-900 to-indigo-950 border border-blue-800/50 shadow-sm text-white h-28 flex flex-col justify-between">
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
                        <span className="text-xs font-bold text-slate-400 group-hover:text-blue-500">+ Link UPI / Card</span>
                      </div>
                    </div>
                  </div>

                </div>
              )}

              {/* TAB 2: CREDENTIALS TRANSFORMATION SYSTEM */}
              {activeTab === "password" && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
                    <h3 className="text-xl font-black tracking-tight">Security Credentials</h3>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Rotate authorization encryption states regularly for account integrity.</p>
                  </div>

                  {pwSuccess && <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/50 rounded-xl text-xs font-semibold">✓ Cryptographic credentials updated successfully.</div>}
                  {pwError && <div className="p-4 bg-rose-50 dark:bg-rose-950/20 text-rose-500 border border-rose-200 dark:border-rose-900/50 rounded-xl text-xs font-semibold">⚠️ {pwError}</div>}

                  <form onSubmit={handleChangePassword} className="max-w-md space-y-5">
                    {[
                      { key: "current", label: "Current Security Phrase" },
                      { key: "newPw", label: "New Complex Key Combination" },
                      { key: "confirm", label: "Verify New Combination Phrase" },
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
                          <button type="button" onClick={() => setShowPw((p) => ({ ...p, [key]: !p[key] }))} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-xs">
                            {showPw[key] ? "🙈 Hide" : "👁️ Show"}
                          </button>
                        </div>
                        {key === "newPw" && strength && (
                          <div className="space-y-1 mt-1.5">
                            <div className="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                              <div className={`h-full transition-all duration-500 ${strength.color}`} style={{ width: strength.w }} />
                            </div>
                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Security Weight: {strength.label}</span>
                          </div>
                        )}
                      </div>
                    ))}
                    <button type="submit" disabled={pwSaving} className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-xs uppercase tracking-widest px-6 py-3.5 rounded-xl shadow-md cursor-pointer">
                      {pwSaving ? "Encrypting Matrix..." : "Commit Credential Change"}
                    </button>
                  </form>
                </div>
              )}

              {/* TAB 3: ACCOUNT PURGE INTERFACE */}
              {activeTab === "danger" && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="border-b border-rose-100 dark:border-rose-950 pb-4">
                    <h3 className="text-xl font-black text-rose-500 tracking-tight">Destructive Account Frameworks</h3>
                    <p className="text-xs text-rose-400/80 mt-1">Actions compiled here feature immediate persistent cloud data loss implications.</p>
                  </div>

                  <div className="border-2 border-dashed border-rose-200 dark:border-rose-900/40 p-5 rounded-2xl bg-rose-50/10 dark:bg-rose-950/5 space-y-4">
                    <div>
                      <h4 className="text-base font-black text-slate-800 dark:text-slate-200">Wipe System Cloud Profile</h4>
                      <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">This instantly schedules a destructive data pipeline query wiping addresses, purchase context tables, logs and cached assets completely.</p>
                    </div>

                    {!showDeleteConfirm ? (
                      <button onClick={() => setShowDeleteConfirm(true)} className="bg-rose-500 text-white font-bold text-xs uppercase tracking-widest px-5 py-2.5 rounded-xl cursor-pointer">
                        Initialize Profile Purge...
                      </button>
                    ) : (
                      <div className="p-4 bg-white dark:bg-[#0b0f19] border border-rose-200 dark:border-rose-900/60 rounded-xl space-y-3">
                        <p className="text-xs text-rose-500 font-black">⚠️ SYSTEM ADVISORY: Cloud record deactivation holds a permanent state. Commit purge execution string?</p>
                        <div className="flex gap-2">
                          <button onClick={handleDeleteAccount} className="bg-rose-600 text-white font-bold text-xs px-4 py-2 rounded-xl">
                            Yes, Terminate Key Records
                          </button>
                          <button onClick={() => setShowDeleteConfirm(false)} className="bg-slate-100 dark:bg-slate-800 text-xs font-bold px-4 py-2 rounded-xl">
                            Abort
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
      </main>
    </>
  );
}

export default Profile;