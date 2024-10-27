const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
const port = 3000;

// Enable CORS for the specified origin
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  })
);

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  },
});

// Store active rooms
const rooms = {};

io.on("connection", (socket) => {
  console.log("Client connected with the id: " + socket.id);

  socket.emit("message", "Welcome to the server!");

  // Handle the get-users event
  socket.on("get-users", ({ roomId }) => {
    if (rooms[roomId]) {
      console.log("Users: " + JSON.stringify(rooms[roomId]));
      socket.emit("room-users", rooms[roomId].players); // Send the current users in the room
    } else {
      socket.emit("room-users", []); // Send an empty array if the room does not exist
    }
  });

  //CREATE A ROOM
  socket.on("create-room", ({ username, roomId }) => {
    console.log(`Game started by ${username} in room ${roomId}`);

    if (!rooms[roomId]) {
      rooms[roomId] = { players: [] };
    }

    if (rooms[roomId].players.includes(username)) {
      socket.emit(
        "room-error",
        `Username ${username} is already in room ${roomId}.`
      );
      return;
    }

    rooms[roomId].players.push(username);
    socket.join(roomId);

    socket.emit("room-created", { roomId });
  });

  //JOIN A ROOM
  socket.on("join-room", ({ username, roomId }) => {
    if (rooms[roomId]) {
      if (rooms[roomId].players.length == 2) {
        socket.emit(
          "room-full",
          `Room ${roomId} is full. Please choose another room.`
        );
        return;
      }

      if (rooms[roomId].players.includes(username)) {
        socket.emit(
          "room-error",
          `Username ${username} is already in room ${roomId}.`
        );
        return;
      }

      rooms[roomId].players.push(username);
      socket.join(roomId);
      socket.emit("room-created", { roomId });
      console.log(`${username} joined room ${roomId}`);
    } else {
      socket.emit("room-error", `Room ${roomId} does not exist.`);
    }

    console.log(rooms);
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log("Client disconnected: " + socket.id);
  });
});

// Start the server
server.listen(port, (error) => {
  if (!error)
    console.log(
      "Server is Successfully Running, and App is listening on port " + port
    );
  else console.log("Error occurred, server can't start", error);
});
