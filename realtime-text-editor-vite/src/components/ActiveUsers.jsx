import React from "react";
import { v4 as rand } from "uuid";
import "animate.css";

function ActiveUsers({ allUsers }) {
  let animateClass = "total-name animate__animated ";
  let cr = Math.floor(Math.random() * 8);

  if (cr === 0) animateClass += "animate__rubberBand";
  else if (cr === 1) animateClass += "animate__bounce";
  else if (cr === 2) animateClass += "animate__heartBeat";
  else if (cr === 3) animateClass += "animate__jello";
  else if (cr === 4) animateClass += "animate__wobble";
  else if (cr === 5) animateClass += "animate__tada";
  else if (cr === 6) animateClass += "animate__flip";
  else if (cr === 7) animateClass += "animate__zoomInDown";

  return (
    <div className="active-users">
      <div className="user-box-header">Connected</div>
      <div className="users-name-box">
        {allUsers.map((item) => (
          <div className={animateClass} key={rand()}>
            <div className="active-box ">{String(item).charAt(0)}</div>
            <div className="user-name">{item}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ActiveUsers;
