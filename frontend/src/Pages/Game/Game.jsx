import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";

const socket = io("http://localhost:3000");

const Game = () => {
  const { roomId } = useParams();
  const [users, setUsers] = useState([]);

  console.log("Welcome to " + roomId);

  useEffect(() => {
    socket.emit("get-users", { roomId });

    socket.on("room-users", (currentUsers) => {
      console.log("Users: " + currentUsers);
      setUsers(currentUsers);
    });

    return () => {
      socket.off("room-users");
    };
  }, [roomId]);

  return (
    <div>
      <h1>Game Room: {roomId}</h1>
      <h2>Users in Room:</h2>
      <ul>
        {users.map((user, index) => (
          <li key={index}>{user}</li>
        ))}
      </ul>
    </div>
  );
};

export default Game;
