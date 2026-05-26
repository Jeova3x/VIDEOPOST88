const Busboy = require("busboy");
const { putFile } = require("./helpers/github");

exports.handler = function (event, context, callback) {
  if (event.httpMethod !== "POST") return callback(null, { statusCode: 405, body: "Method not allowed" });
  const contentType = event.headers["content-type"] || event.headers["Content-Type"];
  const bb = new Busboy({ headers: { "content-type": contentType } });
  const files = [];
  const buffers = {};
  bb.on("file", (name, file, info) => {
    const { filename } = info;
    const chunks = [];
    file.on("data", (d) => chunks.push(d));
    file.on("end", () => {
      buffers[filename] = Buffer.concat(chunks);
      files.push({ filename });
    });
  });

  bb.on("finish", async () => {
    try {
      if (!files.length) return callback(null, { statusCode: 400, body: "No file" });
      const f = files[0];
      const filename = `${Date.now()}_${f.filename.replace(/\s+/g,"_")}`;
      const path = `uploads/${filename}`;
      const contentBase64 = buffers[f.filename].toString("base64");
      await putFile(path, contentBase64, `Upload ${filename}`);
      const url = `https://raw.githubusercontent.com/${process.env.REPO_OWNER}/${process.env.REPO_NAME}/${process.env.REPO_BRANCH}/${path}`;
      callback(null, { statusCode: 200, body: JSON.stringify({ path, url }) });
    } catch (e) {
      callback(null, { statusCode: 500, body: JSON.stringify({ error: e.message }) });
    }
  });

  bb.end(Buffer.from(event.body, event.isBase64Encoded ? "base64" : "utf8"));
};
