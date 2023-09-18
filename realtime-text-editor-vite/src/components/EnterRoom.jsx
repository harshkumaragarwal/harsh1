import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function EnterRoom({ setUserName }) {
  const [roomId, setRoomId] = useState("");
  const navigate = useNavigate();

  return (
    <form
      className="enter-room"
      onSubmit={(e) => {
        e.preventDefault();
        navigate("/editor/" + roomId);
      }}
    >
      <input
        className="form-control"
        placeholder="Enter Room Code"
        onChange={(e) => {
          setRoomId(e.target.value);
        }}
        required
      />
      <input
        className="mt-1 form-control"
        placeholder="Enter Your Name"
        onChange={(e) => {
          setUserName(e.target.value);
        }}
        required
      />
      <button className="btn btn-primary">Join</button>
    </form>
  );
}

export default EnterRoom;
