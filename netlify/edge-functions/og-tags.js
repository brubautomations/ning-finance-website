export default async (request, context) => {
  const url = new URL(request.url);
  const articleId = url.searchParams.get("articleId");
  const tabName = url.searchParams.get("tab");

  const userAgent = request.headers.get("user-agent") || "";
  const isBot = userAgent.toLowerCase().includes("facebookexternalhit") || 
                userAgent.toLowerCase().includes("twitterbot") ||
                userAgent.toLowerCase().includes("linkedinbot") ||
                userAgent.toLowerCase().includes("bot") ||
                userAgent.toLowerCase().includes("make");

  // TRACKER LOGS - This forces text to appear in Netlify so we aren't blind!
  console.log(`[Bouncer] Visitor detected! User-Agent: ${userAgent}`);
  console.log(`[Bouncer] URL: ${request.url}`);
  console.log(`[Bouncer] Is Bot? ${isBot} | Article: ${articleId} | Tab: ${tabName}`);

  if (!isBot || !articleId || !tabName) {
    console.log(`[Bouncer] Human visitor or missing data. Letting them pass normally.`);
    return context.next();
  }

  console.log(`[Bouncer] BOT DETECTED! Pulling data from Airtable...`);

  const AIRTABLE_BASE_ID = "apppg1HS8BHcmiyjF";
  const AIRTABLE_TOKEN = Netlify.env.get("AIRTABLE_TOKEN");
  
  try {
    const airtableUrl = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(tabName)}/${articleId}`;
    const response = await fetch(airtableUrl, {
      headers: { Authorization: `Bearer ${AIRTABLE_TOKEN}` }
    });
    
    if (!response.ok) {
      console.log(`[Bouncer ERROR] Airtable refused connection: ${response.status} ${response.statusText}`);
      return context.next();
    }

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

    console.log(`[Bouncer SUCCESS] Image found! Injecting: ${imageUrl}`);

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
    console.log(`[Bouncer CRASH] Code broke: ${error.message}`);
    return context.next();
  }
};

// HARDCODED TRIGGER - Bypasses the need for netlify.toml
export const config = {
  path: "/*"
};