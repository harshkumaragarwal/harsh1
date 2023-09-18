import React, { useMemo, useState, useEffect, useRef } from 'react';
import HeadBar from './HeadBar';
import Editor from './Editor';
import axios from 'axios';
import { sublime } from '@uiw/codemirror-theme-sublime';
import { androidstudio } from '@uiw/codemirror-theme-androidstudio';
import { dracula } from '@uiw/codemirror-theme-dracula';
import { xcodeLight, xcodeDark } from '@uiw/codemirror-theme-xcode';
import { useParams } from 'react-router-dom';
import skt from '../sockets';
import Notify from './notification';

function Controller({ userName, setAllUsers }) {
  const [theme, setTheme] = useState(sublime);
  const [lang, setLang] = useState('cpp');
  const [editorData, setEditorData] = useState('');
  const [inputData, setInputData] = useState('');
  const [outData, setOutData] = useState('');
  const [status, setStatus] = useState('Idle');
  const { roomId } = useParams();
  const socket = useRef(null);
  const [subId, setSubId] = useState('');
  const idRef = useRef(null);
  const myInterval = useRef(null);
  idRef.current = subId;

  useEffect(() => {
    socket.current = skt();

    socket.current.emit('join', roomId, userName);

    socket.current.on('codechange', (c) => {
      setEditorData(c);
    });
    socket.current.on('inputchange', (c) => {
      setInputData(c);
    });
    socket.current.on("outputchange", (c) => {
      setOutData(c);
    });
    socket.current.on('langchange', (lang, user) => {
      if (user) {
        Notify(user + ' has Changed the Language', 'default');
      }
      setLang(lang);
    });

    socket.current.on('leave', (user) => {
      Notify(user + ' has Left the Room.', 'danger');
      setAllUsers((prev) => {
        return [...prev].filter((name) => name !== user);
      });
    });

    return () => {
      socket.current.disconnect();
      socket.current.off('newjoin');
      socket.current.off('leave');
      socket.current.off('codechange');
      socket.current.off('inputchange');
    };
  }, [roomId, setAllUsers, userName]);

  useEffect(() => {
    socket.current.off('newjoin');

    socket.current.on('newjoin', (newUser, allUsers, id) => {
      setAllUsers(allUsers);
      if (userName !== newUser) {
        Notify(newUser + ' Joined the Room.', 'success');
        socket.current.emit('sync', editorData, inputData, lang, id);
      }
    });
  }, [editorData, inputData, lang, setAllUsers, userName]);

  function runCode() {
    if (status !== 'Idle') return;

    var source_code = '' + editorData;
    var input = '' + inputData;
    source_code = source_code.replace(/(?:\r\n|\r|\n)/g, '\n');
    input = input.replace(/(?:\r\n|\r|\n)/g, '\n');

    setStatus('running');

    const opt = {
      method: 'post',
      data: {
        source_code,
        language: lang,
        input,
        api_key: 'guest',
      },
    };
    const requestData = {
      source_code,
      language: lang,
      input,
    };
    axios
      .post('http://localhost:80/process-code', requestData)
      .then((res) => {
        // Handle the response from the backend
        console.log(res?.data?.output);
        // console.log(res?.data?.error);
        console.log("Hi");
        setOutData(res?.data?.output);
        // setOutData(res?.data?.error?.message);
        setStatus("Idle");
      })
      .catch((err) => {
        console.log(res?.data?.error);
        
        setOutData('Something Went Wrong!!');
        setStatus("Idle");
      });
    // axios(process.env.REACT_APP_CREATE, opt)
    //   .then((res) => {
    //     setSubId(res.data.id);
    //     setStatus(res.data.status);

    //     myInterval.current = setInterval(() => {
    //       axios(process.env.REACT_APP_DETAILS, {
    //         params: {
    //           id: idRef.current,
    //           api_key: "guest",
    //         },
    //       })
    //         .then((res) => {
    //           setStatus(res.data.status);
    //           if (res.data.status === "completed") {
    //             let c = "";
    //             if (res.data.build_stderr !== null) c += res.data.build_stderr;
    //             if (res.data.build_stdout !== null) c += res.data.build_stdout;
    //             if (res.data.stderr !== null) c += res.data.stderr;
    //             if (res.data.stdout !== null) c += res.data.stdout;
    //             if (res.data.exit_code !== null)
    //               c += "[Exit_Code: " + res.data.exit_code + " ]";
    //             setOutData(c);
    //           }
    //         })
    //         .catch((err) => console.log(err));
    //     }, 1000);
    //   })
    //   .catch((err) => {
    //     Notify("Some Error Occured", "danger");
    //     setStatus("error");
    //   });
  }

  useEffect(() => {
    if (status === 'Idle') return;

    if (status === 'completed') {
      clearInterval(myInterval.current);
      setStatus('Idle');
    }
  }, [status]);

  const themeMap = useMemo(() => {
    return new Map([
      [sublime, 'Sublime'],
      [androidstudio, 'AndroidStudio'],
      [dracula, 'Dracula'],
      [xcodeLight, 'XCodeLight'],
      [xcodeDark, 'XCodeDark'],
    ]);
  }, []);

  const themeMap2 = useMemo(() => {
    return new Map([
      ['Sublime', sublime],
      ['AndroidStudio', androidstudio],
      ['Dracula', dracula],
      ['XCodeLight', xcodeLight],
      ['XCodeDark', xcodeDark],
    ]);
  }, []);

  function setThemeHandler(theme) {
    setTheme(themeMap2.get(theme));
  }
  return (
    <div className="controller">
      <HeadBar
        currTheme={themeMap.get(theme)}
        setThemeHandler={setThemeHandler}
        currLang={lang}
        setLangHandler={setLang}
        socket={socket}
        roomId={roomId}
        userName={userName}
        editorData={editorData}
        status={status}
        runCode={runCode}
        setOutData={setOutData}
      />

      <div className="editor">
        <Editor
          themes={theme}
          lang={lang}
          classN="maineditor"
          readOnly={false}
          socket={socket}
          setEditorData={setEditorData}
          editorData={editorData}
          setInputData={null}
          inputData={null}
          roomId={roomId}
          outData={null}
        />
        <div className="inout">
          <div className="input">
            <div className="ed1">INPUT</div>
            <Editor
              themes={theme}
              classN="ed2"
              lang="textile"
              readOnly={false}
              socket={socket}
              setEditorData={null}
              editorData={null}
              setInputData={setInputData}
              inputData={inputData}
              roomId={roomId}
              outData={null}
            />
          </div>
          <div className="output">
            <div className="ed3">OUTPUT</div>
            <Editor
              themes={theme}
              classN="ed4"
              lang="textile"
              readOnly={true}
              socket={null}
              setEditorData={null}
              editorData={null}
              setInputData={null}
              inputData={null}
              roomId={null}
              outData={outData}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Controller;
