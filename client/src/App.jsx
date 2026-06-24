import { useSelector } from "react-redux";
import { useEffect } from "react";

import AppRouter from "./router/AppRouter";
import OfflineBanner from "./components/OfflineBanner/OfflineBanner";

function App() {
  const theme = useSelector((state) => state.root.theme.mode);

  // Apply dark class to html element for Tailwind dark mode
  useEffect(() => {
    const html = document.documentElement;
    if (theme === "dark") {
      html.classList.add("dark");
    } else {
      html.classList.remove("dark");
    }
  }, [theme]);

  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 theme-transition`}>
      <OfflineBanner />
      <AppRouter />
    </div>
  );
}

export default App;