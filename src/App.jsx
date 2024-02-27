import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "../src/pages/home/home";
import Login from "../src/pages/login/login";
import Signup from "../src/pages/signup/signup";
import Share from "./pages/sharePage/shareData";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/share/:id" element={<Share />} />
      </Routes>
    </>
  );
}

export default App;
