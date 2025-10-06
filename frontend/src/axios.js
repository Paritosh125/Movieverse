import axios from "axios";

const instance = axios.create({
    baseURL: "https://movieverse-489p.onrender.com/api", // your backend URL
});

export default instance;
