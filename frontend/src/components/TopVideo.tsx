import React, { useEffect, useState } from "react";
import { getTopVideo, updateTopVideo, uploadFile } from "../api";

export default function TopVideo() {
  const [video, setVideo] = useState<any>(null);
  const [file, setFile] = useState<File | null>(null);
  const [adminKey] = useState<string | null>(localStorage.getItem("ADMIN_KEY"));

  useEffect(() => { load(); }, []);
  async function load() {
    const v = await getTopVideo();
    setVideo(v);
  }

  async function onUpload() {
    if (!file) return alert("Escolha um arquivo");
    const up = await uploadFile(file);
    await updateTopVideo({ src: up.url, type: file.type }, adminKey ?? undefined);
    load();
  }

  return (
    <div style={{ marginBottom: 24 }}>
      <h2>Top Video</h2>
      {video?.src ? (
        <video controls style={{ width: "100%" }}>
          <source src={video.src} type={video.type || "video/mp4"} />
        </video>
      ) : (
        <div style={{ background: "#eee", height: 200, display: "flex", alignItems: "center", justifyContent: "center" }}>Sem vídeo</div>
      )}
      {adminKey && (
        <div style={{ marginTop: 8 }}>
          <input type="file" accept="video/*" onChange={e => setFile(e.target.files?.[0] ?? null)} />
          <button onClick={onUpload}>Enviar / Atualizar (admin)</button>
        </div>
      )}
    </div>
  );
}
