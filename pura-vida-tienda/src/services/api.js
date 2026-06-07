import axios from "axios";

const BASE_URL = "https://puravidafragance-api-fwdgejguhpatbjaj.centralus-01.azurewebsites.net/api";
const api = axios.create({ baseURL: BASE_URL });

export const getPerfumes  = () => api.get("/Perfume");
export const getMarcas    = () => api.get("/Marca");
export const getBodys     = () => api.get("/Body");
export const getBodySprays = () => api.get("/BodySpray");
export const getSets      = () => api.get("/Set");