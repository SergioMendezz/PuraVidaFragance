import axios from "axios";

const BASE_URL = "https://puravidafragance-api-fwdgejguhpatbjaj.centralus-01.azurewebsites.net/api";

const api = axios.create({ baseURL: BASE_URL });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("pvf_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("pvf_token");
      localStorage.removeItem("pvf_user");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

export const login   = (data) => api.post("/Auth/login", data);
export const logout  = ()     => api.post("/Auth/logout");

export const getMarcas   = ()           => api.get("/Marca");
export const getMarca    = (id)         => api.get(`/Marca/${id}`);
export const postMarca   = (data)       => api.post("/Marca", data);
export const putMarca    = (id, data)   => api.put(`/Marca/${id}`, data);
export const deleteMarca = (id)         => api.delete(`/Marca/${id}`);

export const getPerfumes   = ()         => api.get("/Perfume");
export const getPerfume    = (id)       => api.get(`/Perfume/${id}`);
export const postPerfume   = (data)     => api.post("/Perfume", data);
export const putPerfume    = (id, data) => api.put(`/Perfume/${id}`, data);
export const deletePerfume = (id)       => api.delete(`/Perfume/${id}`);

export const getVariantesPorPerfume = (idPerfume)       => api.get(`/Variante/perfume/${idPerfume}`);
export const postVariante           = (data)            => api.post("/Variante", data);
export const putVariante            = (id, data)        => api.put(`/Variante/${id}`, data);
export const deleteVariante         = (id)              => api.delete(`/Variante/${id}`);

export const getNotas            = ()                   => api.get("/Nota");
export const getNota             = (id)                 => api.get(`/Nota/${id}`);
export const postNota            = (data)               => api.post("/Nota", data);
export const putNota             = (id, data)           => api.put(`/Nota/${id}`, data);
export const deleteNota          = (id)                 => api.delete(`/Nota/${id}`);
export const getNotasPorPerfume  = (idPerfume)          => api.get(`/Nota/perfume/${idPerfume}`);
export const postNotaAPerfume    = (data)               => api.post("/Nota/perfume", data);
export const deleteNotaDePerfume = (idPerfume, idNota)  => api.delete(`/Nota/perfume/${idPerfume}/nota/${idNota}`);