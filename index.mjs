import http from "http";
import https from "https";

/**
 * @param {string} url
 * @returns {Promise<string>}
 */
function http_get(url) {
  return new Promise((resolve, reject) => {
    const request = (url.startsWith("https:") ? https : http).request(url);
    request.end();
    request.on("error", reject);
    request.on("response", (response) => {
      const buffers = [];
      response.on("data", (data) => buffers.push(data));
      response.on("error", reject);
      response.on("close", () =>
        resolve(Buffer.concat(buffers).toString("utf-8"))
      );
    });
  });
}

async function fetchData() {
  return JSON.parse(
    await http_get(
      "https://raw.githubusercontent.com/govza/conjugaison/master/src/statics/data/verbs.json"
    )
  ).reduce((prev, cur) => {
    prev.set(cur.value, Buffer.from(JSON.stringify(cur), "utf-8"));
    return prev;
  }, new Map());
}

console.log("Fetching verbs data...");
const verbs = await fetchData();
console.log("Data fetched ok");

const server = http.createServer((req, res) => {
  const verbWord = req.url.slice(1);
  const verbConjugaison = verbs.get(verbWord);

  if (!verbConjugaison) {
    res.statusCode = 404;
    res.end();
    return;
  }

  res.appendHeader("content-type", "application/json");
  res.write(verbConjugaison);
  res.end();
});

server.listen(3003);
