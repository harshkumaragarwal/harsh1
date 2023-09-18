import React from "react";
import { v4 as rand } from "uuid";
import { useNavigate } from "react-router-dom";

function CreateRoom({ setUserName }) {
  const navigate = useNavigate();

  return (
    <form
      className="create-room"
      onSubmit={(e) => {
        e.preventDefault();
        navigate("/editor/" + rand());
      }}
    >
      <input
        className="mt-1 form-control"
        placeholder="Enter Your Name"
        onChange={(e) => {
          setUserName(e.target.value);
        }}
        required
      />
      <button className="mt-2 btn btn-primary">Create a New Room</button>
    </form>
  );
}

export default CreateRoom;
