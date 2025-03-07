import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:5000/api/users", // Define a base correta
  headers: { "Content-Type": "application/json" }
});

export default instance;
