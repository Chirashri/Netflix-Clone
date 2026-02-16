import React from "react";
import Home from "./pages/Home";
   // ❗ NO curly braces

   import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Profile from "./pages/Profile";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={<Profile />} />

      </Routes>
    </Router>
  );
}


// function App() {
//   return <Home />;
// }

export default App;
