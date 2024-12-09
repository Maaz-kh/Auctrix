import "./App.css";
import React from "react";
import LoggedInRoutes from "./LoggedInRouter";
import NotLoggedInRoutes from "./NotLoggedInRouter";
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
