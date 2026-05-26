const { getFile, putFile } = require("./helpers/github");

exports.handler = async function (event) {
  try {
    const body = JSON.parse(event.body);
    const comment = body.comment || "";
    const imagePath = body.imagePath || null;
    const dataFile = "data/posts.json";
    const existing = await getFile(dataFile);
    const posts = existing ? JSON.parse(Buffer.from(existing.content, "base64").toString()) : [];
    const newPost = {
      id: Date.now().toString(),
      comment,
      imagePath,
      timestamp: new Date().toISOString()
    };
    posts.unshift(newPost);
    const contentBase64 = Buffer.from(JSON.stringify(posts, null, 2)).toString("base64");
    await putFile(dataFile, contentBase64, "Add post");
    return { statusCode: 200, body: JSON.stringify(newPost) };
  } catch (e) {
    return { statusCode: 500, body: JSON.stringify({ error: e.message }) };
  }
};
