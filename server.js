require('dotenv').config();
const express = require('express');
const { createServer } = require('http');
const { WebSocketServer } = require('ws');
const WebSocket = require('ws');

// SENSITIVE: API KEY
const API_KEY = process.env.OPENAI_API_KEY || "YOUR_OPENAI_API_KEY";

const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ server });

app.use(express.static('public'));
const PORT = 3000;

// --- KNOWLEDGE BASE ---
const MOCK_DATABASE = [
    { question: "reset password", answer: "To reset your password, go to Settings > Security > Reset Password. You will receive an email link." },
    { question: "api rate limits", answer: "The Free tier has 100 req/min. Pro has 10,000 req/min. Institutional is unlimited." },
    { question: "refund policy", answer: "We offer a 30-day money-back guarantee for all Pro subscriptions. Institutional plans are contract-based." },
    { question: "pro plan", answer: "The Pro Plan costs $49/mo and includes Real-time Charts, Level 2 Data, and zero-latency execution." },
    { question: "institutional", answer: "Institutional access is $999/mo and includes dedicated analyst support, direct market access (DMA), and API keys." },
    { question: "hours", answer: "Market hours are 9:30 AM to 4:00 PM EST, but our crypto desks are open 24/7." },
    { question: "contact", answer: "You can email support@ningfinance.com or use the 'Call Ning' feature on this dashboard." },
    { question: "crypto", answer: "We currently support spot trading for BTC, ETH, SOL, and XRP." },
    { question: "fees", answer: "Maker fees are 0.1%, and Taker fees are 0.2%. Pro users get a 50% discount on fees." },
    { question: "two factor", answer: "2FA is mandatory for all accounts. We support Google Authenticator and YubiKey." },
    { question: "margin", answer: "Margin trading is available up to 5x for Pro users and 20x for Institutional clients." },
    { question: "mobile app", answer: "The Ning Finance mobile app is available on iOS and Android." }
];

function searchKnowledgeBase(query) {
    const q = query.toLowerCase();
    const results = MOCK_DATABASE.filter(item =>
        item.question.includes(q) || item.answer.toLowerCase().includes(q)
    );

    if (results.length === 0) return "No specific policy found. Advise the user to contact human support.";
    return results.map(r => `Q: ${r.question}\nA: ${r.answer}`).join("\n\n");
}

// --- SYSTEM PROMPT ---
const SYSTEM_PROMPT = `
You are Ning, the AI Support Specialist for Ning Finance. You are professional, sharp, and concise.
Your voice is "shimmer".

Capabilities:
1. You can navigate the terminal interface by changing tabs.
2. You can answer specific helpdesk questions using your knowledge base.

Rules:
- If the user asks to see a specific page (News, Indices, Tech, Opinions, Pricing), generally navigate them there using the 'navigate' tool.
- If the user asks a question about policy, definitions, account help, or pricing details, you MUST use the 'search_knowledge_base' tool. Do not guess.
- Be crisp and "Bloomberg-like" in your speech. No fluff.
`;

const TOOLS = [
    {
        type: "function",
        name: "navigate",
        description: "Changes the visible tab/section of the application.",
        parameters: {
            type: "object",
            properties: {
                section: {
                    type: "string",
                    enum: ["news", "indices", "tech", "opinions", "pricing"]
                }
            },
            required: ["section"]
        }
    },
    {
        type: "function",
        name: "search_knowledge_base",
        description: "Searches the internal FAQ for specific answers about policies, pricing, or technical details.",
        parameters: {
            type: "object",
            properties: {
                query: { type: "string" }
            },
            required: ["query"]
        }
    }
];

wss.on('connection', (ws) => {
    console.log("🟢 Browser Connected");

    const openaiWs = new WebSocket('wss://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview-2024-10-01', {
        headers: {
            "Authorization": "Bearer " + API_KEY,
            "OpenAI-Beta": "realtime=v1"
        }
    });

    openaiWs.on('open', () => {
        console.log("🟢 Connected to OpenAI!");

        const sessionUpdate = {
            type: "session.update",
            session: {
                modalities: ["text", "audio"],
                instructions: SYSTEM_PROMPT,
                voice: "shimmer",
                tools: TOOLS,
                tool_choice: "auto",
                input_audio_format: "pcm16",
                output_audio_format: "pcm16",
                turn_detection: { type: "server_vad" }
            }
        };
        openaiWs.send(JSON.stringify(sessionUpdate));

        // TRIGGER INITIAL GREETING
        setTimeout(() => {
            console.log("👉 Triggering Initial Greeting...");
            openaiWs.send(JSON.stringify({
                type: "response.create",
                response: {
                    modalities: ["text", "audio"],
                    instructions: "Say 'Hello, welcome to Ning Finance. I am ready to assist you.' in a professional but warm tone."
                }
            }));
        }, 1000);
    });

    openaiWs.on('message', (data) => {
        const response = JSON.parse(data);

        // LOGGING
        if (response.type === 'input_audio_buffer.speech_started') console.log("🎤 User started speaking...");
        if (response.type === 'input_audio_buffer.speech_stopped') console.log("🛑 User stopped speaking.");
        if (response.type === 'error') console.error("🔴 OpenAI Error Event:", response.error);

        // Forward audio to browser
        if (response.type === 'response.audio.delta') {
            ws.send(data.toString());
        }

        // Handle Tool Calls
        if (response.type === 'response.function_call_arguments.done') {
            const toolName = response.name;
            const args = JSON.parse(response.arguments);
            const callId = response.call_id;

            console.log(`✨ Tool called: ${toolName}`, args);

            if (toolName === 'navigate') {
                ws.send(JSON.stringify({
                    type: 'command',
                    action: 'navigate',
                    section: args.section
                }));

                openaiWs.send(JSON.stringify({
                    type: "conversation.item.create",
                    item: {
                        type: "function_call_output",
                        call_id: callId,
                        output: JSON.stringify({ success: true, message: `Navigated to ${args.section}` })
                    }
                }));
                openaiWs.send(JSON.stringify({ type: "response.create" }));
            }

            else if (toolName === 'search_knowledge_base') {
                const answer = searchKnowledgeBase(args.query);
                console.log(`📚 Database Answer: ${answer}`);

                openaiWs.send(JSON.stringify({
                    type: "conversation.item.create",
                    item: {
                        type: "function_call_output",
                        call_id: callId,
                        output: JSON.stringify({ result: answer })
                    }
                }));
                openaiWs.send(JSON.stringify({ type: "response.create" }));
            }
        }
    });

    ws.on('message', (message) => {
        if (openaiWs.readyState === WebSocket.OPEN) {
            openaiWs.send(message.toString());
        }
    });

    ws.on('close', () => openaiWs.close());
    openaiWs.on('close', () => ws.close());
    openaiWs.on('error', (err) => console.error("OpenAI Error:", err));
});

server.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});