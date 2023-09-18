import React, { useState, useEffect } from "react";
import NavBar from "./NavBar";
import Home from "./Home";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import EditorHead from "./EditorHead";
import CreateRoom from "./CreateRoom";
import EnterRoom from "./EnterRoom";
import { ReactNotifications } from "react-notifications-component";

function App() {
  const [userName, setUserName] = useState(localStorage.getItem("name") ?? "");
  useEffect(() => {
    localStorage.setItem("name", userName);
  }, [userName]);

  return (
    <div className="Papa-wrapper">
      <BrowserRouter>
        <ReactNotifications />
        <NavBar />
        <Routes>
          <Route path="/" element={<Home setUserName={setUserName} />} />
          <Route
            path="/create"
            element={<CreateRoom setUserName={setUserName} />}
          />
          <Route
            path="/join"
            element={<EnterRoom setUserName={setUserName} />}
          />
          <Route
            path="/editor/:roomId"
            element={<EditorHead userName={userName} />}
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
