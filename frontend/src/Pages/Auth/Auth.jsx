import { useState, useEffect } from "react";
import "./style.css";
import { io } from "socket.io-client";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const socket = io("http://localhost:3000");

const Auth = () => {
  const [username, setUsername] = useState("");
  const [roomId, setRoomId] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to server with id: " + socket.id);
    });

    socket.on("room-full", (msg) => {
      console.error("SERVER: " + msg);
      toast.error(msg);
    });

    // Listen for successful room creation
    socket.on("room-created", ({ roomId }) => {
      console.log("SERVER: Room created successfully: " + roomId);
      toast.success(`Room created successfully: ${roomId}`);
      navigate(`/game/${roomId}`); // Navigate to the game when the room is created
    });

    socket.on("room-error", (msg) => {
      console.error("SERVER: " + msg);
      toast.error(msg);
    });

    return () => {
      socket.off("connect");
      socket.off("room-full");
      socket.off("room-created");
      socket.off("room-error");
    };
  }, [navigate]);

  const handleClickPlay = (e) => {
    e.preventDefault();
    const newRoomId = Math.floor(Math.random() * 100000) + 1; // Generate new room ID
    setRoomId(newRoomId); // Set roomId state

    if (username.length !== 0) {
      console.log("username: " + username + "\nroomId: " + newRoomId);
      socket.emit("create-room", { username, roomId: newRoomId });
    }
  };

  const handleClickJoin = (e) => {
    e.preventDefault();
    if (username.length !== 0 && roomId.length !== 0) {
      socket.emit("join-room", { username, roomId });
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-box">
        <h1>Tic Tac Toe Online</h1>
        <p>
          <i>Challenge Your Friend to a Quick Duel</i>
        </p>

        <form>
          <div>
            <input
              type="text"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <button onClick={handleClickPlay}>Play</button>
          </div>

          <div>
            <input
              type="text"
              placeholder="Enter room ID"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
            />
            <button onClick={handleClickJoin}>Join Room</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Auth;
