import React, { useState } from "react";
import { uploadFile, createPost } from "../api";

export default function PostForm() {
  const [file, setFile] = useState<File | null>(null);
  const [comment, setComment] = useState("");

  async function submit(e: any) {
    e.preventDefault();
    if (!file) return alert("Escolha uma imagem");
    const up = await uploadFile(file);
    await createPost({ comment, imagePath: up.path });
    setComment("");
    setFile(null);
    window.location.reload();
  }

  return (
    <form onSubmit={submit} style={{ marginBottom: 24 }}>
      <div>
        <textarea value={comment} onChange={e => setComment(e.target.value)} placeholder="Comentário" rows={2} style={{ width: "100%" }} />
      </div>
      <div style={{ marginTop: 8 }}>
        <input type="file" accept="image/*" onChange={e => setFile(e.target.files?.[0] ?? null)} />
      </div>
      <div style={{ marginTop: 8 }}>
        <button type="submit">Postar</button>
      </div>
    </form>
  );
}
