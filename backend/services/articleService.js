
const axios = require("axios");
const cheerio = require("cheerio");
const dns = require("node:dns").promises;
const net = require("node:net");
const ipaddr = require("ipaddr.js");
const { decode } = require("html-entities");

const MAX_HTML_BYTES = 5 * 1024 * 1024;

function isPublicIP(ip) {
  try {
    const address = ipaddr.process(ip);
    return address.range() === "unicast";
  } catch {
    return false;
  }
}

async function validateArticleUrl(input) {
  if (typeof input !== "string" || input.length > 2048) {
    throw new Error("Invalid article URL");
  }

  let url;

  try {
    url = new URL(input);
  } catch {
    throw new Error("Invalid article URL");
  }

  if (!["http:", "https:"].includes(url.protocol)) {
    throw new Error("Only HTTP and HTTPS URLs are supported");
  }

  if (url.username || url.password) {
    throw new Error("URLs containing credentials are not allowed");
  }

  if (url.port && !["80", "443"].includes(url.port)) {
    throw new Error("Unsupported URL port");
  }

  const hostname = url.hostname.toLowerCase();

  if (
    hostname === "localhost" ||
    hostname.endsWith(".localhost") ||
    hostname.endsWith(".local")
  ) {
    throw new Error("Local network URLs are not allowed");
  }

  if (net.isIP(hostname)) {
    if (!isPublicIP(hostname)) {
      throw new Error("Private or reserved IP addresses are not allowed");
    }
  } else {
    const records = await dns.lookup(hostname, { all: true });

    if (
      !records.length ||
      records.some((record) => !isPublicIP(record.address))
    ) {
      throw new Error("URL resolves to an unsafe IP address");
    }
  }

  return url.toString();
}

async function extractArticle(inputUrl) {
  const url = await validateArticleUrl(inputUrl);

  const response = await axios.get(url, {
    timeout: 10000,
    maxRedirects: 0,
    maxContentLength: MAX_HTML_BYTES,
    maxBodyLength: MAX_HTML_BYTES,
    responseType: "text",
    headers: {
      "User-Agent": "InfoLens/1.0 Article Extractor",
      Accept: "text/html",
    },
  });

  const contentType = response.headers["content-type"] || "";

  if (!contentType.toLowerCase().includes("text/html")) {
    throw new Error("URL does not contain an HTML article");
  }

  const $ = cheerio.load(response.data);

  $("script, style, nav, footer, header, aside, iframe, form, noscript").remove();

  const title = decode(
    $("meta[property='og:title']").attr("content") ||
    $("h1").first().text() ||
    $("title").text() ||
    "Untitled Article"
  ).trim();

  const article = $("article").first();
  const main = $("main").first();

  const content = article.length
    ? article
    : main.length
    ? main
    : $("body");

  const paragraphs = content
    .find("p")
    .map((_, element) => $(element).text().trim())
    .get()
    .filter((paragraph) => paragraph.length > 30);

  const text = decode(paragraphs.join("\n\n"))
    .replace(/[ \t]+/g, " ")
    .trim();

  if (text.length < 100) {
    throw new Error("Not enough readable article content found");
  }

  return {
    url,
    title,
    text,
    wordCount: text.split(/\s+/).length,
  };
}

module.exports = { extractArticle };
