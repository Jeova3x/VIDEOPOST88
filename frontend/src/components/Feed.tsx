import React, { useEffect, useState } from "react";
import { getPosts } from "../api";

export default function Feed() {
  const [posts, setPosts] = useState<any[]>([]);
  useEffect(() => { load(); }, []);
  async function load() {
    const p = await getPosts();
    setPosts(p || []);
  }

  return (
    <div>
      <h3>Feed</h3>
      {posts.map(p => (
        <div key={p.id || p.timestamp} style={{ border: "1px solid #ddd", padding: 8, marginBottom: 8 }}>
          {p.imageUrl && <img src={p.imageUrl} alt="" style={{ maxWidth: "100%" }} />}
          <p>{p.comment}</p>
          <small>{new Date(p.timestamp).toLocaleString()}</small>
        </div>
      ))}
      {posts.length === 0 && <div>Nenhum post</div>}
    </div>
  );
}
