export default async (request, context) => {
  const url = new URL(request.url);
  const articleId = url.searchParams.get("articleId");
  const tabName = url.searchParams.get("tab");

  const userAgent = request.headers.get("user-agent") || "";
  const isBot = userAgent.toLowerCase().includes("facebookexternalhit") || 
                userAgent.toLowerCase().includes("twitterbot") ||
                userAgent.toLowerCase().includes("linkedinbot") ||
                userAgent.toLowerCase().includes("bot");

  if (!isBot || !articleId || !tabName) {
    return context.next();
  }

  const AIRTABLE_BASE_ID = "apppg1HS8BHcmiyjF";
  const AIRTABLE_TOKEN = "patEHheyAwgUUMjHQ.9ca90bc2406d0c66a0829a716d265f3a3a4d94f255b7bad59dcefc22951db0f1";
  
  try {
    const airtableUrl = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(tabName)}/${articleId}`;
    const response = await fetch(airtableUrl, {
      headers: { Authorization: `Bearer ${AIRTABLE_TOKEN}` }
    });
    
    if (!response.ok) return context.next();

    const data = await response.json();
    const fields = data.fields;
    
    const title = fields.Headline || "Ning Finance Update";
    const description = fields.Summary || "Advance AI Intelligence.";
    let imageUrl = ""; 
    
    if (fields["News Image"] && fields["News Image"].length > 0) {
        imageUrl = fields["News Image"][0].url;
    } else if (fields["Image URL"]) {
        imageUrl = fields["Image URL"];
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
        <meta name="twitter:card" content="summary_large_image" />
        <title>${title}</title>
      </head>
      <body></body>
      </html>
    `;

    return new Response(html, {
      headers: { "Content-Type": "text/html" },
    });

  } catch (error) {
    return context.next();
  }
};