import { memo } from "react";

function StatCard({ icon, label, value, gradient }) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ${gradient}`}
    >
      <div className="absolute top-0 right-0 w-24 h-24 opacity-10 text-7xl flex items-center justify-center">
        {icon}
      </div>
      <div className="relative z-10">
        <p className="text-sm font-medium opacity-90 mb-1">{label}</p>
        <p className="text-3xl font-bold">{value}</p>
      </div>
    </div>
  );
}

export default memo(StatCard);
