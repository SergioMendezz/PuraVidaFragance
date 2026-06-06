import axios from "axios";

const BASE_URL = "https://localhost:7130/api";
const api = axios.create({ baseURL: BASE_URL });

export const getPerfumes = () => api.get("/Perfume");
export const getMarcas   = () => api.get("/Marca");