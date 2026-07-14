#!/usr/bin/env node

import { existsSync, readFileSync } from "node:fs";
import { dirname, extname, isAbsolute, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const htmlFiles = ["index.html", "404.html"];
const errors = [];
const summaries = [];
let assertionCount = 0;

function check(condition, message) {
  assertionCount += 1;
  if (!condition) errors.push(message);
  return condition;
}

function readText(relativePath) {
  const absolutePath = resolve(repoRoot, relativePath);
  if (!check(existsSync(absolutePath), `Missing required file: ${relativePath}`)) return null;

  try {
    return readFileSync(absolutePath, "utf8").replace(/^\uFEFF/, "");
  } catch (error) {
    errors.push(`Could not read ${relativePath}: ${error.message}`);
    return null;
  }
}

function decodeEntities(value) {
  return value
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&apos;/gi, "'")
    .replace(/&#x([0-9a-f]+);/gi, (_, digits) => String.fromCodePoint(Number.parseInt(digits, 16)))
    .replace(/&#([0-9]+);/g, (_, digits) => String.fromCodePoint(Number.parseInt(digits, 10)))
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">");
}

function parseAttributes(source) {
  const attributes = [];
  const pattern = /([^\s"'=<>`]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g;
  let match;

  while ((match = pattern.exec(source)) !== null) {
    attributes.push({
      name: match[1].toLowerCase(),
      value: decodeEntities(match[2] ?? match[3] ?? match[4] ?? ""),
    });
  }

  return attributes;
}

function firstAttribute(tag, name) {
  return tag.attributes.find((attribute) => attribute.name === name)?.value;
}

function allAttributes(tag, name) {
  return tag.attributes
    .filter((attribute) => attribute.name === name)
    .map((attribute) => attribute.value);
}

function parseHtml(relativePath, source) {
  const tags = [];
  const withoutComments = source.replace(/<!--[\s\S]*?-->/g, "");
  const tagPattern = /<([a-z][a-z0-9:-]*)(?=\s|\/?\s*>)([^<>]*?)>/gi;
  let match;

  while ((match = tagPattern.exec(withoutComments)) !== null) {
    tags.push({
      name: match[1].toLowerCase(),
      attributes: parseAttributes(match[2]),
      offset: match.index,
    });
  }

  const ids = new Map();
  for (const tag of tags) {
    const idAttributes = allAttributes(tag, "id");
    check(
      idAttributes.length <= 1,
      `${relativePath}: <${tag.name}> has more than one id attribute near byte ${tag.offset}`,
    );

    for (const id of idAttributes) {
      check(id.length > 0, `${relativePath}: contains an empty id attribute near byte ${tag.offset}`);
      const offsets = ids.get(id) ?? [];
      offsets.push(tag.offset);
      ids.set(id, offsets);
    }
  }

  for (const [id, offsets] of ids) {
    check(
      offsets.length === 1,
      `${relativePath}: duplicate id "${id}" appears ${offsets.length} times`,
    );
  }

  return { relativePath, source, tags, ids };
}

const cnameSource = readText("CNAME") ?? "";
const cnameLines = cnameSource
  .split(/\r?\n/)
  .map((line) => line.trim())
  .filter(Boolean);
const siteHost = cnameLines[0] ?? "invalid.local";
const hostnamePattern = /^(?=.{1,253}$)(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/i;

check(cnameLines.length === 1, "CNAME must contain exactly one non-empty line");
check(hostnamePattern.test(siteHost), `CNAME is not a valid hostname: ${siteHost}`);
check(!/[/:?#\s]/.test(siteHost), "CNAME must be a bare hostname without a scheme, port, or path");

const siteOrigin = `https://${siteHost}`;
const homeUrl = `${siteOrigin}/`;

function insideRepo(absolutePath) {
  const pathFromRoot = relative(repoRoot, absolutePath);
  return pathFromRoot === "" || (!pathFromRoot.startsWith(`..${sep}`) && pathFromRoot !== ".." && !isAbsolute(pathFromRoot));
}

function safeDecodeUriComponent(value, label) {
  try {
    return decodeURIComponent(value);
  } catch {
    errors.push(`${label}: malformed percent-encoding in URL`);
    return value;
  }
}

function resolveReference(rawValue, fromFile) {
  const value = decodeEntities(String(rawValue)).trim();
  if (!value) return { kind: "empty" };

  const baseUrl = new URL(fromFile.replaceAll("\\", "/"), homeUrl);
  let url;
  try {
    url = new URL(value, baseUrl);
  } catch {
    errors.push(`${fromFile}: invalid URL reference "${value}"`);
    return { kind: "invalid" };
  }

  if (url.protocol !== "http:" && url.protocol !== "https:") {
    return { kind: "non-web", url };
  }

  if (url.hostname.toLowerCase() !== siteHost.toLowerCase() || url.port) {
    return { kind: "external", url };
  }

  const pathname = safeDecodeUriComponent(url.pathname, `${fromFile} -> ${value}`);
  let relativePath = pathname.replace(/^\/+/, "");
  if (!relativePath || pathname.endsWith("/")) relativePath += "index.html";

  const absolutePath = resolve(repoRoot, relativePath.replaceAll("/", sep));
  if (!insideRepo(absolutePath)) {
    errors.push(`${fromFile}: local URL escapes the repository: ${value}`);
    return { kind: "invalid" };
  }

  return {
    kind: "local",
    url,
    relativePath: relativePath.replaceAll("\\", "/"),
    absolutePath,
    fragment: url.hash
      ? safeDecodeUriComponent(url.hash.slice(1), `${fromFile} -> ${value}`)
      : "",
  };
}

const documents = new Map();
for (const relativePath of htmlFiles) {
  const source = readText(relativePath);
  if (source !== null) documents.set(relativePath, parseHtml(relativePath, source));
}

let localReferenceCount = 0;
let internalAnchorCount = 0;

function tagReferences(tag) {
  const references = ["href", "src"].flatMap((attributeName) =>
    allAttributes(tag, attributeName).map((value) => ({ attributeName, value })),
  );

  for (const srcset of allAttributes(tag, "srcset")) {
    for (const candidate of srcset.split(",")) {
      const parts = candidate.trim().split(/\s+/).filter(Boolean);
      check(parts.length > 0, `<${tag.name}> contains an empty srcset candidate`);
      if (parts.length > 0) references.push({ attributeName: "srcset", value: parts[0] });
    }
  }

  return references;
}

for (const document of documents.values()) {
  for (const tag of document.tags) {
    for (const { attributeName, value } of tagReferences(tag)) {
      check(
        value.trim().length > 0,
        `${document.relativePath}: <${tag.name}> has an empty ${attributeName} attribute`,
      );
      if (!value.trim()) continue;

      const reference = resolveReference(value, document.relativePath);
      if (reference.kind !== "local") continue;

      localReferenceCount += 1;
      if (document.relativePath === "404.html") {
        check(
          value.startsWith("/") || value.startsWith(siteOrigin),
          `404.html: local ${attributeName} must be root-absolute for deep error paths: ${value}`,
        );
      }
      check(
        existsSync(reference.absolutePath),
        `${document.relativePath}: local ${attributeName} target does not exist: ${value} (${reference.relativePath})`,
      );

      if ((tag.name === "a" || tag.name === "area") && reference.fragment) {
        internalAnchorCount += 1;
        if (reference.fragment.startsWith(":~:text=")) continue;

        const targetExtension = extname(reference.relativePath).toLowerCase();
        if (targetExtension !== ".html" && targetExtension !== ".htm") continue;

        let targetDocument = documents.get(reference.relativePath);
        if (!targetDocument && existsSync(reference.absolutePath)) {
          const targetSource = readFileSync(reference.absolutePath, "utf8").replace(/^\uFEFF/, "");
          targetDocument = parseHtml(reference.relativePath, targetSource);
          documents.set(reference.relativePath, targetDocument);
        }

        check(
          Boolean(targetDocument?.ids.has(reference.fragment)),
          `${document.relativePath}: anchor "${value}" has no matching id in ${reference.relativePath}`,
        );
      }
    }
  }
}

const totalIdCount = [...documents.values()].reduce((total, document) => total + document.ids.size, 0);
summaries.push(
  `HTML: ${documents.size} documents, ${totalIdCount} unique ids, ${internalAnchorCount} internal anchors, ${localReferenceCount} local references`,
);

function metaContent(document, selectorAttribute, selectorValue, required = true) {
  const matches = document.tags.filter(
    (tag) =>
      tag.name === "meta" &&
      firstAttribute(tag, selectorAttribute)?.toLowerCase() === selectorValue.toLowerCase(),
  );

  if (required) {
    check(matches.length > 0, `${document.relativePath}: missing meta ${selectorAttribute}="${selectorValue}"`);
  }
  check(matches.length <= 1, `${document.relativePath}: duplicate meta ${selectorAttribute}="${selectorValue}"`);

  if (matches.length === 0) return null;
  const content = firstAttribute(matches[0], "content");
  check(content !== undefined && content.trim() !== "", `${document.relativePath}: ${selectorValue} has empty content`);
  return content ?? null;
}

function linkHref(document, relation) {
  const matches = document.tags.filter((tag) => {
    if (tag.name !== "link") return false;
    return (firstAttribute(tag, "rel") ?? "")
      .toLowerCase()
      .split(/\s+/)
      .includes(relation.toLowerCase());
  });

  check(matches.length === 1, `${document.relativePath}: expected exactly one rel="${relation}" link`);
  return matches.length > 0 ? firstAttribute(matches[0], "href") ?? null : null;
}

const indexDocument = documents.get("index.html");
if (indexDocument) {
  const canonical = linkHref(indexDocument, "canonical");
  check(canonical === homeUrl, `index.html: canonical URL must be ${homeUrl}`);

  const manifestHref = linkHref(indexDocument, "manifest");
  const manifestReference = manifestHref ? resolveReference(manifestHref, "index.html") : null;
  check(
    manifestReference?.kind === "local" && manifestReference.relativePath === "site.webmanifest",
    "index.html: manifest link must point to the local site.webmanifest",
  );

  const ogUrl = metaContent(indexDocument, "property", "og:url");
  check(ogUrl === homeUrl, `index.html: og:url must be ${homeUrl}`);
}

function extractJsonLd(document) {
  const blocks = [];
  const pattern = /<script\b([^>]*)>([\s\S]*?)<\/script\s*>/gi;
  let match;

  while ((match = pattern.exec(document.source)) !== null) {
    const attributes = parseAttributes(match[1]);
    const type = attributes.find((attribute) => attribute.name === "type")?.value.toLowerCase();
    if (type !== "application/ld+json") continue;

    const content = match[2].trim();
    check(content.length > 0, `${document.relativePath}: contains an empty JSON-LD block`);
    if (!content) continue;

    try {
      blocks.push(JSON.parse(content));
    } catch (error) {
      errors.push(`${document.relativePath}: invalid JSON-LD: ${error.message}`);
    }
  }

  return blocks;
}

function typedNodesFromJsonLd(block) {
  const roots = Array.isArray(block) ? block : [block];
  const nodes = [];

  for (const root of roots) {
    if (!root || typeof root !== "object" || Array.isArray(root)) continue;
    if (root["@type"] || root["@id"]) nodes.push(root);
    if (Array.isArray(root["@graph"])) {
      nodes.push(...root["@graph"].filter((node) => node && typeof node === "object" && !Array.isArray(node)));
    }
  }

  return nodes;
}

function hasSchemaType(node, expectedType) {
  const types = Array.isArray(node["@type"]) ? node["@type"] : [node["@type"]];
  return types.includes(expectedType);
}

function referencedIds(value) {
  const values = Array.isArray(value) ? value : [value];
  return values.flatMap((item) => {
    if (typeof item === "string") return [item];
    if (item && typeof item === "object" && typeof item["@id"] === "string") return [item["@id"]];
    return [];
  });
}

let jsonLdBlockCount = 0;
let jsonLdNodeCount = 0;
let websitePersonEdgeCount = 0;

if (indexDocument) {
  const blocks = extractJsonLd(indexDocument);
  jsonLdBlockCount = blocks.length;
  check(blocks.length > 0, "index.html: at least one JSON-LD block is required");

  const nodes = blocks.flatMap(typedNodesFromJsonLd);
  jsonLdNodeCount = nodes.length;
  const definitions = new Map();
  const definitionNodes = new Set(nodes);

  for (const node of nodes) {
    if (typeof node["@id"] !== "string" || !node["@id"].trim()) continue;
    check(!definitions.has(node["@id"]), `index.html: duplicate JSON-LD @id definition: ${node["@id"]}`);
    definitions.set(node["@id"], node);
  }

  const websites = nodes.filter((node) => hasSchemaType(node, "WebSite"));
  const people = nodes.filter((node) => hasSchemaType(node, "Person"));
  check(websites.length > 0, "index.html: JSON-LD must define a WebSite node");
  check(people.length > 0, "index.html: JSON-LD must define a Person node");

  const walkReferences = (value) => {
    if (!value || typeof value !== "object") return;
    if (!definitionNodes.has(value) && typeof value["@id"] === "string") {
      check(
        definitions.has(value["@id"]),
        `index.html: dangling JSON-LD @id reference: ${value["@id"]}`,
      );
    }
    for (const child of Object.values(value)) {
      if (typeof child === "object" && child !== null) {
        if (Array.isArray(child)) child.forEach(walkReferences);
        else walkReferences(child);
      }
    }
  };
  nodes.forEach(walkReferences);

  const referencedPeople = new Set();
  for (const website of websites) {
    check(typeof website["@id"] === "string", "index.html: WebSite JSON-LD node needs an @id");
    check(website.url === homeUrl, `index.html: WebSite.url must be ${homeUrl}`);

    const relationshipIds = [
      ...referencedIds(website.mainEntity),
      ...referencedIds(website.creator),
    ];
    check(
      relationshipIds.length > 0,
      "index.html: WebSite must reference the Person through mainEntity or creator",
    );

    for (const id of relationshipIds) {
      const target = definitions.get(id);
      check(Boolean(target), `index.html: WebSite references an undefined @id: ${id}`);
      check(Boolean(target && hasSchemaType(target, "Person")), `index.html: WebSite reference is not a Person: ${id}`);
      if (target && hasSchemaType(target, "Person")) {
        referencedPeople.add(target);
        websitePersonEdgeCount += 1;
      }
    }
  }

  for (const person of people) {
    check(typeof person["@id"] === "string", "index.html: Person JSON-LD node needs an @id");
    check(person.url === homeUrl, `index.html: Person.url must be ${homeUrl}`);
    check(referencedPeople.has(person), `index.html: Person node is not referenced by a WebSite: ${person["@id"] ?? "(no @id)"}`);
  }
}

summaries.push(
  `JSON-LD: ${jsonLdBlockCount} block, ${jsonLdNodeCount} typed nodes, ${websitePersonEdgeCount} WebSite -> Person references`,
);

function readPngDimensions(absolutePath, label) {
  let buffer;
  try {
    buffer = readFileSync(absolutePath);
  } catch (error) {
    errors.push(`${label}: could not read PNG: ${error.message}`);
    return null;
  }

  const signature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  if (!check(buffer.length >= 24 && buffer.subarray(0, 8).equals(signature), `${label}: not a valid PNG file`)) {
    return null;
  }
  if (!check(buffer.toString("ascii", 12, 16) === "IHDR", `${label}: PNG is missing its IHDR header`)) {
    return null;
  }

  return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
}

function parseJsonFile(relativePath) {
  const source = readText(relativePath);
  if (source === null) return null;
  try {
    return JSON.parse(source);
  } catch (error) {
    errors.push(`${relativePath}: invalid JSON: ${error.message}`);
    return null;
  }
}

const manifest = parseJsonFile("site.webmanifest");
const manifestIconSummaries = [];
if (manifest) {
  check(manifest.id === "/", "site.webmanifest: id must be /");
  check(manifest.start_url === "/", "site.webmanifest: start_url must be /");
  check(manifest.scope === "/", "site.webmanifest: scope must be /");
  check(manifest.display === "standalone", "site.webmanifest: display must be standalone");
  check(manifest.lang === "zh-CN", "site.webmanifest: lang must be zh-CN");
  check(typeof manifest.name === "string" && manifest.name.trim() !== "", "site.webmanifest: name is required");
  check(
    typeof manifest.short_name === "string" && manifest.short_name.trim() !== "",
    "site.webmanifest: short_name is required",
  );
  check(/^#[0-9a-f]{6}$/i.test(manifest.theme_color), "site.webmanifest: theme_color must be a hex color");
  check(
    /^#[0-9a-f]{6}$/i.test(manifest.background_color),
    "site.webmanifest: background_color must be a hex color",
  );
  check(Array.isArray(manifest.icons) && manifest.icons.length > 0, "site.webmanifest: icons must be a non-empty array");
  const seenIconPaths = new Set();

  for (const [index, icon] of (Array.isArray(manifest.icons) ? manifest.icons : []).entries()) {
    const label = `site.webmanifest: icon ${index + 1}`;
    check(icon && typeof icon === "object" && !Array.isArray(icon), `${label} must be an object`);
    if (!icon || typeof icon !== "object" || Array.isArray(icon)) continue;

    check(typeof icon.src === "string" && icon.src.trim() !== "", `${label} needs a src`);
    check(icon.type === "image/png", `${label} type must be image/png`);
    check(typeof icon.sizes === "string" && icon.sizes.trim() !== "", `${label} needs declared sizes`);
    if (typeof icon.src !== "string" || !icon.src.trim()) continue;

    const reference = resolveReference(icon.src, "site.webmanifest");
    check(reference.kind === "local", `${label} src must resolve to a local file: ${icon.src}`);
    if (reference.kind !== "local") continue;

    check(!seenIconPaths.has(reference.relativePath), `${label} duplicates icon source ${reference.relativePath}`);
    seenIconPaths.add(reference.relativePath);
    check(existsSync(reference.absolutePath), `${label} file does not exist: ${reference.relativePath}`);
    check(extname(reference.relativePath).toLowerCase() === ".png", `${label} must reference a .png file`);
    if (!existsSync(reference.absolutePath)) continue;

    const dimensions = readPngDimensions(reference.absolutePath, `${label} (${reference.relativePath})`);
    if (!dimensions) continue;

    const declaredSizes = typeof icon.sizes === "string" ? icon.sizes.trim().split(/\s+/).filter(Boolean) : [];
    check(declaredSizes.length > 0, `${label} must declare at least one numeric size`);
    for (const declaredSize of declaredSizes) {
      const sizeMatch = /^(\d+)x(\d+)$/i.exec(declaredSize);
      check(Boolean(sizeMatch), `${label} has an invalid PNG size declaration: ${declaredSize}`);
      if (!sizeMatch) continue;
      check(
        Number(sizeMatch[1]) === dimensions.width && Number(sizeMatch[2]) === dimensions.height,
        `${label} declares ${declaredSize}, but the PNG is ${dimensions.width}x${dimensions.height}`,
      );
    }

    manifestIconSummaries.push(`${reference.relativePath} ${dimensions.width}x${dimensions.height}`);
  }
}

summaries.push(`Manifest: ${manifestIconSummaries.length} verified PNG icons (${manifestIconSummaries.join(", ")})`);

function readJpegDimensions(absolutePath, label) {
  let buffer;
  try {
    buffer = readFileSync(absolutePath);
  } catch (error) {
    errors.push(`${label}: could not read JPEG: ${error.message}`);
    return null;
  }

  if (!check(buffer.length >= 4 && buffer[0] === 0xff && buffer[1] === 0xd8, `${label}: not a valid JPEG file`)) {
    return null;
  }

  const startOfFrameMarkers = new Set([
    0xc0, 0xc1, 0xc2, 0xc3, 0xc5, 0xc6, 0xc7, 0xc9, 0xca, 0xcb, 0xcd, 0xce, 0xcf,
  ]);
  let offset = 2;

  while (offset < buffer.length) {
    while (offset < buffer.length && buffer[offset] !== 0xff) offset += 1;
    while (offset < buffer.length && buffer[offset] === 0xff) offset += 1;
    if (offset >= buffer.length) break;

    const marker = buffer[offset];
    offset += 1;
    if (marker === 0x00 || marker === 0x01 || (marker >= 0xd0 && marker <= 0xd9)) continue;
    if (offset + 2 > buffer.length) break;

    const segmentLength = buffer.readUInt16BE(offset);
    if (segmentLength < 2 || offset + segmentLength > buffer.length) break;

    if (startOfFrameMarkers.has(marker)) {
      if (segmentLength < 7) break;
      return {
        width: buffer.readUInt16BE(offset + 5),
        height: buffer.readUInt16BE(offset + 3),
      };
    }

    offset += segmentLength;
  }

  errors.push(`${label}: JPEG dimensions could not be read`);
  return null;
}

let socialCardSummary = "not verified";
if (indexDocument) {
  const ogImage = metaContent(indexDocument, "property", "og:image");
  const ogSecureImage = metaContent(indexDocument, "property", "og:image:secure_url", false);
  const twitterImage = metaContent(indexDocument, "name", "twitter:image");
  const ogType = metaContent(indexDocument, "property", "og:image:type");
  const ogWidth = metaContent(indexDocument, "property", "og:image:width");
  const ogHeight = metaContent(indexDocument, "property", "og:image:height");
  const ogImageAlt = metaContent(indexDocument, "property", "og:image:alt");
  const twitterCard = metaContent(indexDocument, "name", "twitter:card");
  const twitterImageAlt = metaContent(indexDocument, "name", "twitter:image:alt");

  check(ogType === "image/jpeg", "index.html: og:image:type must be image/jpeg");
  check(ogWidth === "1200", "index.html: og:image:width must be 1200");
  check(ogHeight === "630", "index.html: og:image:height must be 630");
  check(twitterCard === "summary_large_image", "index.html: twitter:card must be summary_large_image");
  check(ogImageAlt === twitterImageAlt, "index.html: OG and Twitter image alt text must match");
  check((ogImageAlt ?? "").length >= 12, "index.html: social image alt text is too short");
  if (ogSecureImage !== null) {
    check(ogSecureImage === ogImage, "index.html: og:image:secure_url must match og:image");
  }

  const imageEntries = [
    ["og:image", ogImage],
    ["twitter:image", twitterImage],
  ];
  const imageReferences = [];

  for (const [name, value] of imageEntries) {
    if (!value) continue;
    const reference = resolveReference(value, "index.html");
    check(reference.kind === "local", `index.html: ${name} must point to a file on ${siteHost}`);
    if (reference.kind !== "local") continue;
    check(existsSync(reference.absolutePath), `index.html: ${name} file does not exist: ${reference.relativePath}`);
    check(/\.jpe?g$/i.test(reference.relativePath), `index.html: ${name} must reference a .jpg or .jpeg file`);
    imageReferences.push(reference);
  }

  if (imageReferences.length === 2) {
    check(
      imageReferences[0].relativePath === imageReferences[1].relativePath,
      "index.html: og:image and twitter:image must use the same social card",
    );
  }

  const uniqueImagePaths = new Map(imageReferences.map((reference) => [reference.relativePath, reference]));
  for (const reference of uniqueImagePaths.values()) {
    if (!existsSync(reference.absolutePath)) continue;
    const dimensions = readJpegDimensions(reference.absolutePath, `Social card (${reference.relativePath})`);
    if (!dimensions) continue;
    check(
      dimensions.width === 1200 && dimensions.height === 630,
      `Social card (${reference.relativePath}) must be 1200x630, found ${dimensions.width}x${dimensions.height}`,
    );
    socialCardSummary = `${reference.relativePath} ${dimensions.width}x${dimensions.height} JPEG`;
  }
}

summaries.push(`Social card: ${socialCardSummary}`);

const robots = readText("robots.txt") ?? "";
const robotsDirectives = robots
  .split(/\r?\n/)
  .map((line) => line.replace(/\s+#.*$/, "").trim())
  .filter(Boolean)
  .map((line) => {
    const separator = line.indexOf(":");
    return separator === -1
      ? { name: line.toLowerCase(), value: "" }
      : { name: line.slice(0, separator).trim().toLowerCase(), value: line.slice(separator + 1).trim() };
  });

check(
  robotsDirectives.some((directive) => directive.name === "user-agent" && directive.value === "*"),
  "robots.txt: missing User-agent: *",
);
check(
  robotsDirectives.some((directive) => directive.name === "allow" && directive.value === "/"),
  "robots.txt: missing Allow: /",
);
const sitemapDirectives = robotsDirectives.filter((directive) => directive.name === "sitemap");
check(sitemapDirectives.length === 1, "robots.txt: expected exactly one Sitemap directive");
check(
  sitemapDirectives[0]?.value === `${siteOrigin}/sitemap.xml`,
  `robots.txt: Sitemap must be ${siteOrigin}/sitemap.xml`,
);

const sitemap = readText("sitemap.xml") ?? "";
check(
  /<urlset\b[^>]*\bxmlns=["']http:\/\/www\.sitemaps\.org\/schemas\/sitemap\/0\.9["'][^>]*>/i.test(sitemap),
  "sitemap.xml: missing the standard sitemap urlset namespace",
);
const sitemapLocations = [...sitemap.matchAll(/<loc\b[^>]*>([\s\S]*?)<\/loc\s*>/gi)].map((match) =>
  decodeEntities(match[1].trim()),
);
const locOpeningCount = (sitemap.match(/<loc\b/gi) ?? []).length;
check(sitemapLocations.length > 0, "sitemap.xml: at least one <loc> is required");
check(locOpeningCount === sitemapLocations.length, "sitemap.xml: contains an unclosed <loc> element");

let hasHomepageLocation = false;
for (const location of sitemapLocations) {
  let url;
  try {
    url = new URL(location);
  } catch {
    errors.push(`sitemap.xml: invalid <loc> URL: ${location}`);
    continue;
  }

  check(url.protocol === "https:", `sitemap.xml: <loc> must use HTTPS: ${location}`);
  check(url.hostname.toLowerCase() === siteHost.toLowerCase(), `sitemap.xml: <loc> host must match CNAME: ${location}`);
  check(!url.port && !url.username && !url.password, `sitemap.xml: <loc> must not contain credentials or a port: ${location}`);
  check(!url.search && !url.hash, `sitemap.xml: <loc> must not contain a query or fragment: ${location}`);
  if (url.href === homeUrl) hasHomepageLocation = true;

  const reference = resolveReference(location, "sitemap.xml");
  check(reference.kind === "local", `sitemap.xml: <loc> must resolve inside the site: ${location}`);
  if (reference.kind === "local") {
    check(existsSync(reference.absolutePath), `sitemap.xml: local page does not exist: ${reference.relativePath}`);
  }
}
check(hasHomepageLocation, `sitemap.xml: homepage ${homeUrl} is not listed`);

const lastModifiedValues = [...sitemap.matchAll(/<lastmod\b[^>]*>([\s\S]*?)<\/lastmod\s*>/gi)].map((match) =>
  match[1].trim(),
);
for (const value of lastModifiedValues) {
  check(/^\d{4}-\d{2}-\d{2}$/.test(value), `sitemap.xml: lastmod must use YYYY-MM-DD: ${value}`);
  check(!Number.isNaN(Date.parse(`${value}T00:00:00Z`)), `sitemap.xml: invalid lastmod date: ${value}`);
}

summaries.push(
  `Discovery: CNAME ${siteHost}, robots sitemap linked, ${sitemapLocations.length} sitemap URL${sitemapLocations.length === 1 ? "" : "s"}`,
);

console.log("Site integrity check");
for (const summary of summaries) console.log(`  - ${summary}`);

if (errors.length > 0) {
  console.error(`\nFAILED: ${errors.length} error${errors.length === 1 ? "" : "s"} across ${assertionCount} checks`);
  for (const error of errors) console.error(`  x ${error}`);
  process.exitCode = 1;
} else {
  console.log(`\nPASS: ${assertionCount} checks completed with no errors`);
}
