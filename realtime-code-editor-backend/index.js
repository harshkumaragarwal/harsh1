const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const { exec } = require('child_process');
const fs = require('fs');
const server = require('http').createServer(app);
const port = process.env.PORT || 80;
const cors = require('cors');
var compiler = require('compilex');
const axios = require('axios');
const exp = require('constants');
var options = { stats: true }; //prints stats on console
compiler.init(options);
const io = require('socket.io')(server, {
  cors: {
    origin: '*',
  },
});
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(bodyParser.json());
const roomData = {};

app.post('/process-code', (req, res) => {
  const { source_code, language, input } = req.body;
  console.log(source_code + ' ' + input, language);
  // Now you can process the received data as needed
  // For example, save it to a database, run code, etc.

  // Send a response back to the frontend
  if (language === 'cpp' || language==='c') {
    // Save source_code to a temporary file
    // Compile and run the code
    fs.writeFileSync('temp_code.cpp', source_code);
    fs.writeFileSync('input.txt', input, 'utf-8');
    // const output = "";
    exec('g++ temp_code.cpp -o executable_code', (error, stdout, stderr) => {
      if (error) {
        console.error('Compilation error:', error.message);
        const output = error.message;

        res.json({
          output,
        });
        // Handle the error response
      } else {
        exec(
          `executable_code < input.txt`,
          (execError, execStdout, execStderr) => {
            if (execError) {
              console.error('Execution error:', execError);
            } else {
               const output = execStdout.trim();
              console.log('Output:', output);
              res.json({
                output,
              });
              // Send the output back to the frontend
            }
          }
        );
        // Compilation successful, move to the next step
      }
    });
  } else if (language === 'java') {
    // Save source_code and input to temporary files
    fs.writeFileSync('Main.java', source_code);
    fs.writeFileSync('temp_input.txt', input);

    // Compile the Java code
    exec('javac Main.java', (compileError, compileStdout, compileStderr) => {
      if (compileError) {
        console.error('Compilation error:', compileError.message);
        // console.error("Compilation error:", error.message);
        const output = compileError.message;

        res.json({
          output,
        });
      } else {
        // Compilation successful, run the Java program
        exec(
          `java Main < temp_input.txt`,
          (execError, execStdout, execStderr) => {
            if (execError) {
              console.error('Execution error:', execError);
            } else {
              const output = execStdout.trim();
              console.log('Output:', output);
              res.json({
                output,
              });
            }
          }
        );
      }
    });
  } else if (language === 'python') {
    // Save source_code and input to temporary files
    fs.writeFileSync('temp_code.py', source_code);
    fs.writeFileSync('temp_input.txt', input);

    // Run the Python script with input redirection
    exec(
      `python temp_code.py < temp_input.txt`,
      (execError, execStdout, execStderr) => {
        if (execError) {
          console.error('Execution error:', execError.message);
          // console.error("Compilation error:", error.message);
          const output = execError.message;

          res.json({
            output,
          });
        } else {
          const output = execStdout.trim();
          console.log('Output:', output);
          res.json({
            output,
          });
          // Send the output back to the frontend
        }
      }
    );
  }

  // res.json({ success: true, message: 'Data received and processed' });
});

app.get('/', (res, req) => {
  return req.send('ok88064');
});
io.on('connection', (socket) => {
  console.log('A user connected.');

  socket.on('join', (roomId, userName) => {
    socket.join(roomId);
    roomData[socket.id] = userName;
    const allUsers = [...io.sockets.adapter.rooms.get(roomId)].map(
      (id) => roomData[id]
    );
    io.sockets.in(roomId).emit('newjoin', userName, allUsers, socket.id);
  });

  socket.on('codechange', (c, roomId) => {
    socket.to(roomId).emit('codechange', c);
  });
  socket.on('inputchange', (c, roomId) => {
    socket.to(roomId).emit('inputchange', c);
  });
  socket.on('langchange', (lang, userName, roomId) => {
    socket.to(roomId).emit('langchange', lang, userName);
  });
  socket.on('sync', (editorData, inputData, lang, id) => {
    io.to(id).emit('codechange', editorData);
    io.to(id).emit('inputchange', inputData);
    io.to(id).emit('langchange', lang);
  });

  socket.on('disconnecting', () => {
    console.log('A user is disconnecting');

    [...socket.rooms].forEach((eachRoom) => {
      socket.to(eachRoom).emit('leave', roomData[socket.id]);
    });
    delete roomData[socket.id];
    socket.leave();
  });
});

server.listen(port, () => {
  console.log('Server started on ', port);
});
