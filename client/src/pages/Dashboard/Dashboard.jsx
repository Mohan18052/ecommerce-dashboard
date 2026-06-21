import { useSelector } from "react-redux";

import Navbar from "../../components/Navbar/Navbar";

function Dashboard() {
  const user = useSelector(
    (state) => state.root.auth.user
  );

  return (
    <div>
      <Navbar />

      <h1>
        Welcome {user?.name}
      </h1>
    </div>
  );
}

export default Dashboard;