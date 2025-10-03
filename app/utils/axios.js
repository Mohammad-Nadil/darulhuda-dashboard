import axios from "axios";


const api = axios.create({ baseURL: "https://darulhuda-backend.onrender.com" });

// const api = axios.create({ baseURL: "http://localhost:3000" });

export default api;
