import axios from "axios";

const urlBase =
  // process.env.NODE_ENV === "development"
  true
    ? "http://localhost:3004/api"
    : "https://solarity-server.herokuapp.com/api";

export const apiCaller = axios.create({
  baseURL: urlBase,
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "*",
  },
  withCredentials: true,
});
