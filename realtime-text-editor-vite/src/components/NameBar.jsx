import React from "react";
import { useParams } from "react-router-dom";
import Notify from "./notification";

function NameBar({ allUsers }) {
  const { roomId } = useParams();

  function copy() {
    navigator.clipboard.writeText(roomId);
    Notify("Successfully Copied!", "info");
  }

  return (
    <div className="NameBar">
      <span>{[...allUsers].at(0)}'s Room</span>
      <button className="btn btn-primary custom-btn" onClick={copy}>
        Copy Room Link
      </button>
    </div>
  );
}

export default NameBar;
