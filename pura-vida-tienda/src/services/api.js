import axios from "axios";

const BASE_URL = "https://puravidafragance-api-fwdgejguhpatbjaj.centralus-01.azurewebsites.net/api";
const api = axios.create({ baseURL: BASE_URL });

export const getPerfumes = () => api.get("/Perfume");
export const getMarcas   = () => api.get("/Marca");