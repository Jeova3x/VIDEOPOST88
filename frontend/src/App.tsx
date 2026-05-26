import React from "react";
import TopVideo from "./components/TopVideo";
import Feed from "./components/Feed";
import PostForm from "./components/PostForm";

export default function App() {
  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: 16 }}>
      <TopVideo />
      <PostForm />
      <Feed />
    </div>
  );
}
