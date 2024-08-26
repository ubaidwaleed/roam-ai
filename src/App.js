import React from "react";
import { Routes, Route } from "react-router-dom"; // Only import Routes and Route
import Journal from "./pages/Journal";
import Memory from "./pages/Memory";
import Memory2 from "./pages/Memory2";
import Home from "./pages/Home";
import Journal1 from "./pages/Journal1";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/journal" element={<Journal />} />
        <Route path="/journal1" element={<Journal1 />} />
        <Route path="/journal/memory2" element={<Memory />} />
        <Route path="/journal/memory" element={<Memory2 />} />
      </Routes>
    </div>
  );
}

export default App;
