const fetch = require("node-fetch");
const { GITHUB_TOKEN, REPO_OWNER, REPO_NAME, REPO_BRANCH = "main" } = process.env;
const API_BASE = "https://api.github.com";

function authHeaders() {
  return { Authorization: `token ${GITHUB_TOKEN}`, "User-Agent": "netlify-function" };
}

async function getFile(path) {
  const url = `${API_BASE}/repos/${REPO_OWNER}/${REPO_NAME}/contents/${encodeURIComponent(path)}?ref=${REPO_BRANCH}`;
  const res = await fetch(url, { headers: authHeaders() });
  if (res.status === 404) return null;
  const data = await res.json();
  return data;
}

async function putFile(path, contentBase64, message) {
  const url = `${API_BASE}/repos/${REPO_OWNER}/${REPO_NAME}/contents/${encodeURIComponent(path)}`;
  // need sha if updating
  const existing = await getFile(path);
  const body = {
    message: message || `Update ${path}`,
    content: contentBase64,
    branch: REPO_BRANCH
  };
  if (existing && existing.sha) body.sha = existing.sha;
  const res = await fetch(url, { method: "PUT", headers: { ...authHeaders(), "Content-Type": "application/json" }, body: JSON.stringify(body) });
  return res.json();
}

module.exports = { getFile, putFile };
