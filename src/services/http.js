
import axios from "axios";

const baseURL =
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    "https://389a2aae3455.ngrok-free.app";

const http = axios.create({
    baseURL,
    timeout: 10000,
});

export default http;
