import { useSelector } from "react-redux";

import AppRouter from "./router/AppRouter";

function App() {
  const theme = useSelector(
    (state) => state.root.theme.mode
  );

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          theme === "dark"
            ? "#121212"
            : "#ffffff",

        color:
          theme === "dark"
            ? "#ffffff"
            : "#000000",
      }}
    >
      <AppRouter />
    </div>
  );
}

export default App;