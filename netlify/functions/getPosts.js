const { getFile } = require("./helpers/github");

exports.handler = async function () {
  try {
    const data = await getFile("data/posts.json");
    if (!data) return { statusCode: 200, body: JSON.stringify([]) };
    const content = Buffer.from(data.content, "base64").toString();
    const posts = JSON.parse(content).map(p => ({
      ...p,
      imageUrl: p.imagePath ? `https://raw.githubusercontent.com/${process.env.REPO_OWNER}/${process.env.REPO_NAME}/${process.env.REPO_BRANCH}/${p.imagePath}` : null
    }));
    return { statusCode: 200, body: JSON.stringify(posts) };
  } catch (e) {
    return { statusCode: 500, body: JSON.stringify({ error: e.message }) };
  }
};
