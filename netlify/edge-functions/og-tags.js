export default async (request, context) => {
  const url = new URL(request.url);
  const articleId = url.searchParams.get("articleId");
  const tabName = url.searchParams.get("tab");

  const userAgent = request.headers.get("user-agent") || "";
  const isBot = /facebookexternalhit|twitterbot|linkedinbot|whatsapp|viber|skype|telegram|discordbot/i.test(userAgent);

  // 1. If it's a human, let them pass normally
  if (!isBot || !articleId || !tabName) {
    return context.next();
  }

  // 2. It is a Bot. We MUST return a 200 OK status to bypass Netlify 403 blocks.
  const AIRTABLE_BASE_ID = "apppg1HS8BHcmiyjF";
  const AIRTABLE_TOKEN = "patEHheyAwgUUMjHQ.9ca90bc2406d0c66a0829a716d265f3a3a4d94f255b7bad59dcefc22951db0f1";
  const airtableUrl = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(tabName)}/${articleId}`;

  try {
    const response = await fetch(airtableUrl, {
      headers: { Authorization: `Bearer ${AIRTABLE_TOKEN}` }
    });

    // TRAP 1: Did Airtable block us?
    if (!response.ok) {
      const errorHtml = `<html><head><meta property="og:title" content="DIAGNOSTIC: Airtable Blocked Us (Error ${response.status})" /></head><body></body></html>`;
      return new Response(errorHtml, { headers: { "Content-Type": "text/html" }, status: 200 });
    }

    const data = await response.json();
    const fields = data.fields || {};

    const title = fields.Headline || "Ning Finance Update";
    const description = fields.Summary || "Advance AI Intelligence.";
    let imageUrl = "";

    if (fields["Image URL"]) {
      imageUrl = fields["Image URL"];
    } else if (fields["News Image"] && fields["News Image"].length > 0) {
      imageUrl = fields["News Image"][0].url;
    }

    const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta property="og:title" content="${title}" />
        <meta property="og:description" content="${description}" />
        <meta property="og:image" content="${imageUrl}" />
        <meta property="og:url" content="${request.url}" />
        <meta property="og:type" content="article" />
        <title>${title}</title>
      </head>
      <body></body>
      </html>
    `;

    // SUCCESS: Return the actual preview
    return new Response(html, { headers: { "Content-Type": "text/html" }, status: 200 });

  } catch (error) {
    // TRAP 2: Did the code crash?
    const crashHtml = `<html><head><meta property="og:title" content="DIAGNOSTIC CRASH: ${error.message}" /></head><body></body></html>`;
    return new Response(crashHtml, { headers: { "Content-Type": "text/html" }, status: 200 });
  }
};

export const config = {
  path: "/*"
};