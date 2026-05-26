const Busboy = require("busboy");
const { getFile, putFile } = require("./helpers/github");

exports.handler = function (event, context, callback) {
  const adminKeyHeader = event.headers["x-admin-key"] || event.headers["X-Admin-Key"];
  if (!adminKeyHeader || adminKeyHeader !== process.env.ADMIN_KEY) return callback(null, { statusCode: 403, body: "Forbidden" });

  const contentType = event.headers["content-type"] || event.headers["Content-Type"] || "application/json";
  if (contentType.includes("multipart/form-data")) {
    const bb = new Busboy({ headers: { "content-type": contentType } });
    const buffers = {};
    const files = [];
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
        const f = files[0];
        const filename = `videos/${Date.now()}_${f.filename.replace(/\s+/g,"_")}`;
        const contentBase64 = buffers[f.filename].toString("base64");
        await putFile(filename, contentBase64, `Upload video ${f.filename}`);
        const url = `https://raw.githubusercontent.com/${process.env.REPO_OWNER}/${process.env.REPO_NAME}/${process.env.REPO_BRANCH}/${filename}`;
        const top = { src: url, type: (event.headers["x-file-type"] || "video/mp4") };
        const contentTop = Buffer.from(JSON.stringify(top, null, 2)).toString("base64");
        await putFile("data/topVideo.json", contentTop, "Update top video");
        callback(null, { statusCode: 200, body: JSON.stringify(top) });
      } catch (e) {
        callback(null, { statusCode: 500, body: JSON.stringify({ error: e.message }) });
      }
    });
    bb.end(Buffer.from(event.body, event.isBase64Encoded ? "base64" : "utf8"));
  } else {
    // JSON body with src/type
    (async () => {
      try {
        const payload = JSON.parse(event.body);
        const top = { src: payload.src || "", type: payload.type || "" };
        const contentTop = Buffer.from(JSON.stringify(top, null, 2)).toString("base64");
        await putFile("data/topVideo.json", contentTop, "Update top video");
        callback(null, { statusCode: 200, body: JSON.stringify(top) });
      } catch (e) {
        callback(null, { statusCode: 500, body: JSON.stringify({ error: e.message }) });
      }
    })();
  }
};
