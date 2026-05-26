import axios from "axios";

const api = axios.create({ baseURL: "/.netlify/functions" });

export async function getPosts() {
  const r = await api.get("/getPosts");
  return r.data;
}

export async function createPost(payload: { comment: string; imagePath: string }) {
  const r = await api.post("/createPost", payload);
  return r.data;
}

export async function getTopVideo() {
  const r = await api.get("/getTopVideo");
  return r.data;
}

export async function updateTopVideo(payload: any, adminKey?: string) {
  const headers: any = { "Content-Type": "application/json" };
  if (adminKey) headers["x-admin-key"] = adminKey;
  const r = await api.put("/updateTopVideo", payload, { headers });
  return r.data;
}

export async function uploadFile(file: File) {
  const fd = new FormData();
  fd.append("file", file);
  const r = await api.post("/uploadImage", fd, { headers: { "Content-Type": "multipart/form-data" } });
  return r.data; // expect { path, url }
}
