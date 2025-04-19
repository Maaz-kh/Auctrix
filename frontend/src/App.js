import "./App.css";
import React from "react";
import LoggedInRoutes from "./LoggedInRoutes";
import NotLoggedInRoutes from "./NotLoggedInRoutes";

function App() {
  const token = localStorage.getItem("accessToken");
  const role = localStorage.getItem("role");

  return (
    <>
      {token && role ? (
        <LoggedInRoutes token={token} role={role} />
      ) : (
        <NotLoggedInRoutes />
      )}
    </>
  );
}

export default App;
