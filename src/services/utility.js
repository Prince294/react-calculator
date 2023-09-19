import axios from "axios";

export const _retrieveToken = async () => {
    const value = await localStorage.getItem("app-token");
    return value;
};

const http = axios.create({
    baseURL: "http://localhost:5506/api",
});


http.interceptors.request.use(
    async (config) => {
        const token = await _retrieveToken();
        if (token !== null && typeof token !== "undefined") {
            config.headers.accesstoken = token;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default http;
