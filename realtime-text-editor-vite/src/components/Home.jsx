import React from "react";
import CreateRoom from "./CreateRoom";
import EnterRoom from "./EnterRoom";

function Head({ setUserName }) {
  return (
    <div className="home">
      <div className="mb-5 sec">
        <h2>Collaborative Code Editor</h2>
        <div>
          A Realtime code editor with support of multiple languages and rich
          themes.
        </div>
      </div>
      <EnterRoom setUserName={setUserName} />
      <div className="mt-2 or">OR</div>
      <CreateRoom setUserName={setUserName} />
    </div>
  );
}

export default Head;
