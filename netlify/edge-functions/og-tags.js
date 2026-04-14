export default async (request, context) => {
  const url = new URL(request.url);
  const articleId = url.searchParams.get("articleId");
  const tabName = url.searchParams.get("tab");

  const userAgent = request.headers.get("user-agent") || "";
  const isBot = /facebookexternalhit|twitterbot|linkedinbot|whatsapp|viber|skype|telegram|discordbot/i.test(userAgent);

  // Let humans through normally
  if (!isBot || !articleId || !tabName) {
    return context.next();
  }

  // ============================================================
  // MAP tab name → Airtable table ID
  // The URL uses human-readable tab names but Airtable needs IDs
  // ============================================================
  const TAB_TO_TABLE = {
    "Global+News": "tblysIjzhOe7C4tuW",
    "Global News": "tblysIjzhOe7C4tuW",
    "Asia+News": "tblTv1N74JUlPtVlv",
    "Asia News": "tblTv1N74JUlPtVlv",
    "Philippines+News": "tblCHaPvCU5x2lmHj",
    "Philippines News": "tblCHaPvCU5x2lmHj",
    "AI+News": "tblT7pSIBBtLtUgRG",
    "AI News": "tblT7pSIBBtLtUgRG",
    "Commentary": "tblhfbdWYzByc8gVb",
    "Culture": "tbllcuvDk8jRG0JNA",
    "Luxury": "tbl7ZlcWqcH8J0avI",
  };

  const tableId = TAB_TO_TABLE[tabName] || TAB_TO_TABLE[decodeURIComponent(tabName)];

  if (!tableId) {
    // Unknown tab — return default OG so FB shows something decent
    const fallback = `<html><head>
      <meta property="og:title" content="Ning Finance | AI-Operated Newsroom" />
      <meta property="og:description" content="99% AI-Operated Newsroom and Market Data Terminal." />
      <meta property="og:image" content="https://ui-avatars.com/api/?name=NING+FINANCE&background=000000&color=cba258&size=800&font-size=0.15&bold=true" />
      <meta property="og:url" content="${request.url}" />
      <meta property="og:type" content="article" />
    </head><body></body></html>`;
    return new Response(fallback, { headers: { "Content-Type": "text/html" }, status: 200 });
  }

  const AIRTABLE_BASE_ID = "apppg1HS8BHcmiyjF";
  const AIRTABLE_TOKEN = "patEHheyAwgUUMjHQ.868501c04f5d75acbad4a34c0c35799978e659dc149919f4ec237dc44f2c72ea";
  const airtableUrl = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${tableId}/${articleId}`;

  try {
    const response = await fetch(airtableUrl, {
      headers: { Authorization: `Bearer ${AIRTABLE_TOKEN}` }
    });

    if (!response.ok) {
      const errorHtml = `<html><head><meta property="og:title" content="DIAGNOSTIC: Airtable Error ${response.status}" /></head><body></body></html>`;
      return new Response(errorHtml, { headers: { "Content-Type": "text/html" }, status: 200 });
    }

    const data = await response.json();
    const fields = data.fields || {};

    const title = fields.Headline || "Ning Finance Update";
    const description = (fields.Summary || "Advanced AI Intelligence.").substring(0, 200);
    let imageUrl = "";

    if (fields["Image URL"]) {
      imageUrl = fields["Image URL"];
    } else if (fields["News Image"] && fields["News Image"].length > 0) {
      imageUrl = fields["News Image"][0].url;
    }

    // Escape for HTML attributes
    const safe = s => String(s)
      .replace(/&/g, "&amp;")
      .replace(/"/g, "&quot;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${safe(title)} | Ning Finance</title>
  <meta property="og:site_name"   content="Ning Finance" />
  <meta property="og:type"        content="article" />
  <meta property="og:url"         content="${safe(request.url)}" />
  <meta property="og:title"       content="${safe(title)}" />
  <meta property="og:description" content="${safe(description)}" />
  <meta property="og:image"       content="${safe(imageUrl)}" />
  <meta property="og:image:width"  content="1200" />
  <meta property="og:image:height" content="630" />
  <meta name="twitter:card"        content="summary_large_image" />
  <meta name="twitter:title"       content="${safe(title)}" />
  <meta name="twitter:description" content="${safe(description)}" />
  <meta name="twitter:image"       content="${safe(imageUrl)}" />
  <meta http-equiv="refresh" content="0; url=${safe(request.url)}" />
</head>
<body></body>
</html>`;

    return new Response(html, {
      headers: {
        "Content-Type": "text/html",
        "Cache-Control": "public, max-age=3600",
      },
      status: 200
    });

  } catch (error) {
    const crashHtml = `<html><head><meta property="og:title" content="DIAGNOSTIC CRASH: ${error.message}" /></head><body></body></html>`;
    return new Response(crashHtml, { headers: { "Content-Type": "text/html" }, status: 200 });
  }
};

export const config = {
  path: "/*"
};