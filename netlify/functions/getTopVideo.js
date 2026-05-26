const { getFile } = require("./helpers/github");

exports.handler = async function () {
  try {
    const data = await getFile("data/topVideo.json");
    if (!data) return { statusCode: 200, body: JSON.stringify({}) };
    const content = Buffer.from(data.content, "base64").toString();
    const v = JSON.parse(content);
    return { statusCode: 200, body: JSON.stringify(v) };
  } catch (e) {
    return { statusCode: 500, body: JSON.stringify({ error: e.message }) };
  }
};
