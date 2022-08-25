import axios from "axios";

// Create instance called instance

const AxiosInstance = axios.create({
  baseURL: "http://localhost:4000/api/v1",
  headers: {
    "content-type": "application/json",
  },
  withCredentials: true,
});

export default AxiosInstance;
