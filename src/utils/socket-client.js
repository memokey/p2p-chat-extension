import io from "socket.io-client";

const socket = () => {
  const options = {
    "force new connection": true,
    reconnectionAttempt: "Infinity",
    timeout: 10000,
    transport: ["websocket"],
    rejectUnauthorized: false,
  };
  return io.connect(
    process.env.NODE_ENV === "development"
      ? "http://localhost:3004"
      : "https://solarity-server.herokuapp.com",
    options
  );
};
export default socket;
