import React from "react";
import Notify from "./notification";

function HeadBar({
  currTheme,
  setThemeHandler,
  currLang,
  setLangHandler,
  socket,
  roomId,
  userName,
  editorData,
  status,
  runCode,
  setOutData,
}) {
  let statusClass = "mt-1 btn btn-sm ";
  if (status === "Idle") statusClass += "btn-success";
  else statusClass += "btn-danger";

  return (
    <span className="HeadBar">
      <button
        type="button"
        className="btn btn-primary"
        onClick={() => {
          setOutData("Running...");
          runCode();
        }}
      >
        Run
      </button>

      <select
        name="theme"
        id="theme"
        onChange={(e) => {
          setThemeHandler(e.target.value);
        }}
        value={currTheme}
      >
        <option value="Sublime">Sublime</option>
        <option value="AndroidStudio">Android Studio</option>
        <option value="Dracula">Dracula</option>
        <option value="XCodeLight">XCode Light</option>
        <option value="XCodeDark">XCode Dark</option>
      </select>

      <select
        name="lang"
        id="lang"
        onChange={(e) => {
          if (currLang === e.target.value) return;
          setLangHandler(e.target.value);
          socket.current.emit("langchange", e.target.value, userName, roomId);
        }}
        value={currLang}
      >
        <option value="c">C</option>
        <option value="cpp">C++</option>
        <option value="python">Python</option>
        <option value="java">Java</option>
      </select>
      <button type="button" className={statusClass} style={{ float: "right" }}>
        Status - {status}
      </button>
      <button
        type="button"
        className="mt-1 btn btn-primary btn-sm"
        style={{ float: "right" }}
        onClick={() => {
          window.navigator.clipboard.writeText(editorData);
          Notify("Code Copied Successfully!", "success");
        }}
      >
        Copy Code
      </button>
    </span>
  );
}

export default HeadBar;
