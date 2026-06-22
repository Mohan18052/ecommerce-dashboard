import { useSelector } from "react-redux";

import Navbar from "../../components/Navbar/Navbar";

function Profile() {
  const user = useSelector(
    (state) => state.root.auth.user
  );

  return (
    <div>
      <Navbar />

      <h1>Profile Page</h1>

      <div
        style={{
          border: "1px solid gray",
          padding: "20px",
          margin: "20px",
          maxWidth: "500px",
        }}
      >
        <h2>{user?.name}</h2>

        <p>
          Email: {user?.email}
        </p>

        <p>
          User ID: {user?.id}
        </p>
      </div>
    </div>
  );
}

export default Profile;