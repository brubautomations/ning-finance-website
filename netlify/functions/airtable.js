< !DOCTYPE html >
    <html lang="en">

        <head>
            <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
                    <title>NING FINANCE | PRO TIER</title>

                    <link rel="icon" type="image/png"
                        href="https://ui-avatars.com/api/?name=N&background=000000&color=cba258&rounded=true&bold=true&size=128">

                        <link rel="preconnect" href="https://fonts.googleapis.com">
                            <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
                                <link
                                    href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&family=Merriweather:wght@300;700;900&display=swap"
                                    rel="stylesheet">

                                    <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"></script>

                                    <script>
                                        const urlParams = new URLSearchParams(window.location.search);
                                        const token = urlParams.get('token');
                                        if (!token || token.length < 10) {
                                            window.location.replace('index.html');
        }
                                    </script>

                                    <style>
                                        :root {
                                            --primary: #cba258;
                                        --bg: #f8f9fa;
                                        --card-bg: #ffffff;
                                        --text-main: #1a1a1a;
                                        --border: #e0e0e0;
                                        --up: #16a34a;
                                        --down: #dc2626;
        }

                                        body {
                                            margin: 0;
                                        padding: 0;
                                        background-color: var(--bg);
                                        color: var(--text-main);
                                        font-family: 'Inter', sans-serif;
                                        height: 100vh;
                                        display: flex;
                                        flex-direction: column;
                                        overflow: hidden;
        }

                                        /* VIP HEADER */
                                        header {
                                            display: flex;
                                        justify-content: space-between;
                                        align-items: center;
                                        padding: 15px 40px;
                                        background: #000;
                                        border-bottom: 4px solid var(--primary);
                                        z-index: 100;
                                        flex-shrink: 0;
        }

                                        .logo {
                                            font - family: 'Merriweather', serif;
                                        font-size: 1.8rem;
                                        font-weight: 900;
                                        letter-spacing: -0.5px;
                                        color: #fff;
                                        display: flex;
                                        align-items: center;
                                        gap: 10px;
        }

                                        .logo span {
                                            color: var(--primary);
        }

                                        .logo-tag {
                                            font - family: 'Inter', sans-serif;
                                        font-size: 0.65rem;
                                        background: var(--primary);
                                        color: #000;
                                        padding: 3px 8px;
                                        border-radius: 2px;
                                        text-transform: uppercase;
                                        margin-left: 10px;
                                        font-weight: 800;
                                        letter-spacing: 1px;
        }

                                        .user-status {
                                            color: #fff;
                                        font-size: 0.8rem;
                                        display: flex;
                                        align-items: center;
                                        gap: 10px;
                                        font-weight: 600;
        }

                                        .status-dot {
                                            width: 8px;
                                        height: 8px;
                                        background-color: #16a34a;
                                        border-radius: 50%;
                                        box-shadow: 0 0 10px #16a34a;
        }

                                        /* NAV */
                                        .nav-tabs {
                                            display: flex;
                                        gap: 30px;
                                        background: #fff;
                                        padding: 0 40px;
                                        border-bottom: 1px solid var(--border);
                                        z-index: 90;
                                        flex-shrink: 0;
        }

                                        .tab {
                                            padding: 15px 0;
                                        cursor: pointer;
                                        color: #666;
                                        font-size: 0.85rem;
                                        font-weight: 700;
                                        text-transform: uppercase;
                                        border-bottom: 3px solid transparent;
                                        transition: 0.2s;
                                        white-space: nowrap;
        }

                                        .tab:hover {
                                            color: #000;
        }

                                        .tab.active {
                                            color: #000;
                                        border-bottom: 3px solid var(--primary);
        }

                                        /* CONTENT AREA */
                                        #content-area {
                                            flex: 1;
                                        padding: 30px 40px;
                                        overflow-y: auto;
                                        -webkit-overflow-scrolling: touch;
        }

                                        .page {
                                            display: none;
                                        animation: fadeIn 0.4s ease;
                                        height: 100%;
        }

                                        .page.active {
                                            display: flex;
                                        flex-direction: column;
        }

                                        @keyframes fadeIn {
                                            from {
                                            opacity: 0;
                                        transform: translateY(10px);
            }

                                        to {
                                            opacity: 1;
                                        transform: translateY(0);
            }
        }

                                        h2 {
                                            font - family: 'Merriweather', serif;
                                        font-size: 1.5rem;
                                        margin: 0 0 20px 0;
                                        border-left: 5px solid var(--primary);
                                        padding-left: 15px;
                                        text-transform: uppercase;
        }

                                        /* MACRO REPORT CARD */
                                        .macro-card {
                                            background: #fff;
                                        padding: 40px;
                                        border: 1px solid var(--border);
                                        max-width: 800px;
                                        margin: 0 auto;
                                        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
        }

                                        .btn-download {
                                            background: #000;
                                        color: var(--primary);
                                        border: 1px solid var(--primary);
                                        padding: 8px 15px;
                                        font-size: 0.8rem;
                                        font-weight: 800;
                                        cursor: pointer;
                                        text-transform: uppercase;
                                        transition: 0.2s;
                                        margin-bottom: 20px;
                                        align-self: flex-start;
        }

                                        .btn-download:hover {
                                            background: var(--primary);
                                        color: #000;
        }

                                        /* QUANT SCREENER */
                                        .screener-container {
                                            display: flex;
                                        gap: 30px;
                                        flex-wrap: wrap;
        }

                                        .screener-list-card {
                                            flex: 1;
                                        min-width: 350px;
                                        background: #111;
                                        border-radius: 4px;
                                        padding: 30px;
                                        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
        }

                                        .screener-list-card.bull {
                                            border - top: 4px solid var(--up);
        }

                                        .screener-list-card.bear {
                                            border - top: 4px solid var(--down);
        }

                                        .screener-header {
                                            font - family: 'Merriweather', serif;
                                        font-size: 1.3rem;
                                        font-weight: 900;
                                        margin-bottom: 10px;
                                        display: flex;
                                        align-items: center;
                                        gap: 10px;
        }

                                        .bull-text {
                                            color: var(--up);
        }

                                        .bear-text {
                                            color: var(--down);
        }

                                        .quant-list {
                                            list - style: none;
                                        padding: 0;
                                        margin: 0;
        }

                                        .quant-list li {
                                            display: flex;
                                        justify-content: space-between;
                                        padding: 12px 0;
                                        border-bottom: 1px dashed #333;
                                        font-family: 'Courier New', monospace;
                                        color: #e0e0e0;
                                        font-size: 0.95rem;
        }

                                        .quant-list li:last-child {
                                            border - bottom: none;
        }

                                        .quant-list strong {
                                            color: var(--primary);
                                        font-weight: bold;
        }

                                        .screener-subtext {
                                            font - size: 0.85rem;
                                        color: #888;
                                        margin-bottom: 25px;
                                        font-style: italic;
                                        padding-bottom: 15px;
                                        border-bottom: 1px solid #333;
                                        line-height: 1.5;
        }

                                        .market-dropdown {
                                            background: #111;
                                        color: #fff;
                                        border: 1px solid var(--primary);
                                        padding: 10px 15px;
                                        font-family: 'Inter', sans-serif;
                                        font-size: 0.9rem;
                                        font-weight: bold;
                                        outline: none;
                                        cursor: pointer;
        }

                                        /* ADVANCED CHATBOT UI */
                                        .chat-bubble {
                                            position: fixed;
                                        bottom: 30px;
                                        right: 30px;
                                        background: #000;
                                        color: var(--primary);
                                        padding: 15px 25px;
                                        border-radius: 50px;
                                        border: 2px solid var(--primary);
                                        font-weight: 800;
                                        font-size: 0.9rem;
                                        box-shadow: 0 10px 30px rgba(203, 162, 88, 0.3);
                                        cursor: pointer;
                                        display: flex;
                                        align-items: center;
                                        gap: 10px;
                                        z-index: 999;
                                        transition: transform 0.2s;
                                        text-transform: uppercase;
                                        letter-spacing: 1px;
        }

                                        .chat-bubble:hover {
                                            transform: scale(1.05);
        }

                                        .chat-window {
                                            display: none;
                                        position: fixed;
                                        bottom: 90px;
                                        right: 30px;
                                        width: 400px;
                                        height: 600px;
                                        background: #fff;
                                        border-radius: 8px;
                                        box-shadow: 0 15px 50px rgba(0, 0, 0, 0.2);
                                        flex-direction: column;
                                        z-index: 1000;
                                        overflow: hidden;
                                        border: 1px solid #000;
        }

                                        .chat-window.open {
                                            display: flex;
        }

                                        .chat-header {
                                            padding: 20px;
                                        background: #000;
                                        color: #fff;
                                        font-weight: 900;
                                        display: flex;
                                        justify-content: space-between;
                                        align-items: center;
                                        border-bottom: 3px solid var(--primary);
                                        font-family: 'Merriweather', serif;
        }

                                        .chat-header span {
                                            color: var(--primary);
                                        font-family: 'Inter', sans-serif;
                                        font-size: 0.7rem;
                                        text-transform: uppercase;
                                        letter-spacing: 1px;
                                        border: 1px solid var(--primary);
                                        padding: 2px 6px;
        }

                                        .chat-messages {
                                            flex: 1;
                                        padding: 20px;
                                        overflow-y: auto;
                                        background: #fcfcfc;
                                        display: flex;
                                        flex-direction: column;
                                        gap: 15px;
        }

                                        .msg {
                                            padding: 12px 18px;
                                        border-radius: 4px;
                                        max-width: 85%;
                                        font-size: 0.9rem;
                                        line-height: 1.5;
        }

                                        .msg.user {
                                            background: #f0f0f0;
                                        color: #000;
                                        align-self: flex-end;
                                        border-right: 3px solid #000;
        }

                                        .msg.bot {
                                            background: #000;
                                        color: #fff;
                                        align-self: flex-start;
                                        border-left: 3px solid var(--primary);
        }

                                        .chat-input-area {
                                            padding: 15px;
                                        background: #fff;
                                        border-top: 1px solid var(--border);
                                        display: flex;
                                        gap: 10px;
        }

                                        .chat-input-area input {
                                            flex: 1;
                                        padding: 12px;
                                        border: 1px solid #ccc;
                                        border-radius: 2px;
                                        outline: none;
                                        font-family: 'Inter', sans-serif;
        }

                                        .chat-input-area input:focus {
                                            border - color: #000;
        }

                                        .chat-input-area button {
                                            background: var(--primary);
                                        color: #000;
                                        border: none;
                                        padding: 0 20px;
                                        border-radius: 2px;
                                        font-weight: 800;
                                        cursor: pointer;
                                        transition: 0.2s;
        }

                                        .chat-input-area button:hover {
                                            background: #000;
                                        color: var(--primary);
        }
                                    </style>
                                </head>

                                <body>

                                    <header>
                                        <div class="logo">NING <span>FINANCE</span>
                                            <div class="logo-tag">PRO TIER</div>
                                        </div>
                                        <div class="user-status">
                                            <div class="status-dot"></div>
                                            SECURE CONNECTION ACTIVE
                                        </div>
                                    </header>

                                    <div class="nav-tabs">
                                        <div class="tab active" onclick="nav('macro')" id="tab-macro">MACRO CONTEXT</div>
                                        <div class="tab" onclick="nav('screener')" id="tab-screener">QUANT SCREENER</div>
                                        <div class="tab" onclick="nav('charts')" id="tab-charts">INTERACTIVE CHARTS</div>
                                        <div class="tab" onclick="nav('account')" id="tab-account" style="margin-left: auto; color: var(--primary);">
                                            ACCOUNT</div>
                                    </div>

                                    <div id="content-area">

                                        <div id="macro" class="page active">
                                            <h2>Macro Context & Asset Intelligence on Risk Assets</h2>
                                            <button class="btn-download" onclick="downloadPDF()">⬇ Download as PDF</button>

                                            <div id="report-to-print" style="width: 100%;">
                                                <div class="macro-card" style="font-family: 'Helvetica Neue', Arial, sans-serif; color: #111;">
                                                    <div
                                                        style="background-color: #000000; padding: 25px; color: #ffffff; border-bottom: 4px solid #cba258;">
                                                        <h2
                                                            style="margin: 0; font-size: 26px; text-transform: uppercase; letter-spacing: 2px; border:none; padding:0;">
                                                            Mondays with Ning</h2>
                                                        <p style="margin: 5px 0 0 0; font-size: 14px; color: #aeb6bf;">Macro Context & Asset
                                                            Intelligence | Philippine Risk Assets</p>
                                                    </div>

                                                    <div style="padding: 30px; border: 1px solid #e1e8ed; border-top: none;">
                                                        <p style="font-size: 14px; line-height: 1.6; color: #555; margin-bottom: 25px;">
                                                            <em>Here is your weekly translation of global macro chaos into actionable local order
                                                                flow.</em>
                                                        </p>

                                                        <h3
                                                            style="color: #000; border-bottom: 1px solid #cba258; padding-bottom: 5px; font-size: 16px; text-transform: uppercase;">
                                                            1. The Global Board (Macro & Chaos)</h3>
                                                        <ul style="font-size: 14px; line-height: 1.7; color: #333; margin-bottom: 25px;">
                                                            <li style="margin-bottom: 12px;"><strong>The Fed & Rates:</strong> <span
                                                                id="macro-rates">Loading live data...</span></li>
                                                            <li style="margin-bottom: 12px;"><strong>Geopolitics & Commodities:</strong> <span
                                                                id="macro-geo">Loading live data...</span></li>
                                                        </ul>

                                                        <h3
                                                            style="color: #000; border-bottom: 1px solid #cba258; padding-bottom: 5px; font-size: 16px; text-transform: uppercase;">
                                                            2. PSE Institutional Order Book</h3>
                                                        <ul style="font-size: 14px; line-height: 1.7; color: #333; margin-bottom: 25px;">
                                                            <li style="margin-bottom: 12px;"><strong>Foreign Flows:</strong> <span
                                                                id="macro-flows">Loading live data...</span></li>
                                                            <li style="margin-bottom: 12px;"><strong>The BSP & FX Reality:</strong> <span
                                                                id="macro-fx">Loading live data...</span></li>
                                                        </ul>

                                                        <h3
                                                            style="color: #000; border-bottom: 1px solid #cba258; padding-bottom: 5px; font-size: 16px; text-transform: uppercase;">
                                                            3. Suggested Action Plan</h3>
                                                        <ul style="font-size: 14px; line-height: 1.7; color: #333;">
                                                            <li style="margin-bottom: 12px;">
                                                                <strong style="color: #16a34a;">OVERWEIGHT: <span
                                                                    id="macro-ow-name">Loading...</span></strong><br>
                                                                    <em id="macro-ow-rat">Loading live data...</em>
                                                            </li>
                                                            <li style="margin-bottom: 12px;">
                                                                <strong style="color: #dc2626;">UNDERWEIGHT: <span
                                                                    id="macro-uw-name">Loading...</span></strong><br>
                                                                    <em id="macro-uw-rat">Loading live data...</em>
                                                            </li>
                                                        </ul>
                                                    </div>

                                                    <div
                                                        style="background-color: #f8f9fa; padding: 20px; font-size: 12px; color: #6c757d; text-align: center; border-top: 1px solid #e1e8ed; border-left: 1px solid #e1e8ed; border-right: 1px solid #e1e8ed;">
                                                        <p style="margin: 0 0 10px 0;"><strong>Data provided by <a href="https://ningfinance.com/"
                                                            style="color: #000; text-decoration: none; font-weight: bold;">Ning
                                                            Finance</a></strong> — The 99% AI-Operated News Website.</p>
                                                        <p style="margin: 0; font-style: italic;">Disclaimer: This document contains analysis for
                                                            institutional viewing. It is not individual financial advice.</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div id="screener" class="page">
                                            <h2>Algorithmic Momentum Detection and Statistical Anomaly Alerts</h2>

                                            <div style="margin-bottom: 30px; display: flex; align-items: center; gap: 15px;">
                                                <label style="font-weight: 800; color: #333; font-size: 0.9rem;">SELECT MARKET FEED:</label>
                                                <select id="market-select" class="market-dropdown" onchange="changeMarket()">
                                                    <option value="ph">PHILIPPINES (PSE)</option>
                                                    <option value="asia">ASIA (Japan, Korea, HK)</option>
                                                    <option value="us">US EQUITIES (Nasdaq, Dow)</option>
                                                    <option value="crypto">CRYPTOCURRENCY</option>
                                                </select>
                                            </div>

                                            <p style="color: #666; margin-bottom: 30px;">Automated technical signals triggered at market close. Use
                                                these screens to identify momentum shifts.</p>

                                            <div class="screener-container" id="screener-data-container">
                                            </div>
                                        </div>

                                        <div id="charts" class="page">
                                            <h2>PRICE ACTION METRICS</h2>
                                            <div style="flex: 1; border: 1px solid var(--border); background: #000; position: relative; padding: 5px;">
                                                <div class="tradingview-widget-container" style="height:100%;width:100%">
                                                    <div id="tradingview_123" style="height:calc(100vh - 250px);width:100%"></div>
                                                    <script type="text/javascript" src="https://s3.tradingview.com/tv.js"></script>
                                                    <script type="text/javascript">
                                                        new TradingView.widget(
                                                        {
                                                            "autosize": true,
                                                        "symbol": "PSE:ALI",
                                                        "interval": "D",
                                                        "timezone": "Asia/Manila",
                                                        "theme": "dark",
                                                        "style": "1",
                                                        "locale": "en",
                                                        "enable_publishing": false,
                                                        "backgroundColor": "#000000",
                                                        "gridColor": "#1a1a1a",
                                                        "toolbar_bg": "#000000",
                                                        "hide_top_toolbar": false,
                                                        "hide_legend": false,
                                                        "save_image": false,
                                                        "container_id": "tradingview_123",
                                                        "studies": [
                                                        "RSI@tv-basicstudies",
                                                        "MASimple@tv-basicstudies"
                                                        ]
                            }
                                                        );
                                                    </script>
                                                </div>
                                            </div>
                                        </div>

                                        <div id="account" class="page">
                                            <h2>ACCOUNT SETTINGS</h2>
                                            <div class="macro-card" style="max-width: 600px; margin: 0;">
                                                <p><strong>Tier:</strong> PRO TIER</p>
                                                <p><strong>Status:</strong> Active</p>
                                                <p style="color: #666; font-size: 0.9rem; margin-top: 30px;">To cancel your subscription or update your
                                                    billing details, please contact your account manager.</p>
                                                <button onclick="logout()"
                                                    style="background: #dc2626; color: #fff; border: none; padding: 10px 20px; cursor: pointer; border-radius: 2px; font-weight: bold; margin-top: 20px;">LOGOUT
                                                    & REVOKE SESSION</button>
                                            </div>
                                        </div>

                                    </div>

                                    <div class="chat-bubble" onclick="toggleChat()">
                                        <span>AI ANALYST</span>
                                    </div>

                                    <div class="chat-window" id="ai-chat">
                                        <div class="chat-header">
                                            NING INTELLIGENCE <span>PRO</span>
                                            <span style="cursor:pointer; border:none; padding:0; font-size: 1.2rem; color:#fff;"
                                                onclick="toggleChat()">&times;</span>
                                        </div>
                                        <div class="chat-messages" id="chat-messages">
                                            <div class="msg bot">
                                                System online. I am connected to global fundamental feeds, live price action, and social sentiment
                                                metrics. Which ticker or macro event would you like to analyze?
                                            </div>
                                        </div>
                                        <div class="chat-input-area">
                                            <input type="text" id="chat-input" placeholder="e.g. Analyze PSE:BDO balance sheet...">
                                                <button onclick="sendMsg()">SEND</button>
                                        </div>
                                    </div>

                                    <script>
                                        const BASE_ID = 'app1hHgLzAiJgLB8H';

                                        function nav(section) {
                                            document.querySelectorAll('.page').forEach(el => el.classList.remove('active'));
            document.querySelectorAll('.tab').forEach(el => el.classList.remove('active'));
                                        document.getElementById(section).classList.add('active');
                                        document.getElementById('tab-' + section).classList.add('active');
        }

                                        function downloadPDF() {
            const element = document.getElementById('report-to-print');
                                        const opt = {
                                            margin: 0.5,
                                        filename: 'Ning_Finance_Macro_Report.pdf',
                                        image: {type: 'jpeg', quality: 0.98 },
                                        html2canvas: {scale: 2 },
                                        jsPDF: {unit: 'in', format: 'letter', orientation: 'portrait' }
            };
                                        html2pdf().set(opt).from(element).save();
        }

                                        function changeMarket() {
            const market = document.getElementById('market-select').value;
                                        fetchQuantData(market);
        }

                                        function toggleChat() {
            const chat = document.getElementById('ai-chat');
                                        chat.classList.toggle('open');
        }

                                        function sendMsg() {
            const input = document.getElementById('chat-input');
                                        const val = input.value.trim();
                                        if (!val) return;
                                        const msgs = document.getElementById('chat-messages');
                                        msgs.innerHTML += `<div class="msg user">${val}</div>`;
                                        input.value = '';
                                        msgs.scrollTop = msgs.scrollHeight;
            setTimeout(() => {
                                            msgs.innerHTML += `<div class="msg bot">Processing fundamental data for your query...</div>`;
                                        msgs.scrollTop = msgs.scrollHeight;
            }, 1000);
        }

                                        document.getElementById("chat-input").addEventListener("keypress", function (event) {
            if (event.key === "Enter") {
                                            event.preventDefault();
                                        sendMsg();
            }
        });

                                        // FETCH FROM NEW NETLIFY BACKEND SERVER
                                        async function fetchMacroData() {
            try {
                // Encode the Airtable URL and send it to our new backend
                const target = encodeURIComponent(`https://api.airtable.com/v0/${BASE_ID}/tblzSUq94T48MVxnp/rec4UGS4EtbzsDNBv`);
                                        const response = await fetch(`/.netlify/functions/airtable?target=${target}`);

                                        const data = await response.json();
                                        const payload = JSON.parse(data.fields.Payload);

                                        document.getElementById('macro-rates').innerText = payload.global_board_rates;
                                        document.getElementById('macro-geo').innerText = payload.global_board_geopolitics;
                                        document.getElementById('macro-flows').innerText = payload.foreign_flows;
                                        document.getElementById('macro-fx').innerText = payload.bsp_fx;
                                        document.getElementById('macro-ow-name').innerText = payload.overweight_sector_name;
                                        document.getElementById('macro-ow-rat').innerText = payload.overweight_rationale;
                                        document.getElementById('macro-uw-name').innerText = payload.underweight_sector_name;
                                        document.getElementById('macro-uw-rat').innerText = payload.underweight_rationale;
            } catch (error) {
                                            console.error("Error fetching macro data:", error);
            }
        }

                                        // FETCH FROM NEW NETLIFY BACKEND SERVER
                                        async function fetchQuantData(marketCode) {
            const container = document.getElementById('screener-data-container');
                                        container.innerHTML = '<p style="color: #888; font-weight: bold; font-family: monospace;">Loading live quant data...</p>';

                                        try {
                // Encode the Airtable URL and send it to our new backend
                const target = encodeURIComponent(`https://api.airtable.com/v0/${BASE_ID}/Quant%20Data?filterByFormula={Market}='${marketCode}'`);
                                        const response = await fetch(`/.netlify/functions/airtable?target=${target}`);

                                        const data = await response.json();

                if (data.records && data.records.length > 0) {
                    const fields = data.records[0].fields;
                                        let html = '';

                                        if (fields['Bullish 5/20']) {
                                            html += `<div class="screener-list-card bull">
                                    <div class="screener-header bull-text">🟢 Bullish Momentum (5/20 MA Cross Up)</div>
                                    <ul class="quant-list">${fields['Bullish 5/20']}</ul>
                                 </div>`;
                    }
                                        if (fields['Bearish 5/20']) {
                                            html += `<div class="screener-list-card bear">
                                    <div class="screener-header bear-text">🔴 Bearish Momentum (5/20 MA Cross Down)</div>
                                    <ul class="quant-list">${fields['Bearish 5/20']}</ul>
                                 </div>`;
                    }
                                        if (fields['RSI30']) {
                                            html += `<div class="screener-list-card bull">
                                    <div class="screener-header bull-text">📉 Oversold (RSI < 30)</div>
                                    <ul class="quant-list">${fields['RSI30']}</ul>
                                 </div>`;
                    }
                                        if (fields['RSI70']) {
                                            html += `<div class="screener-list-card bear">
                                    <div class="screener-header bear-text">📈 Overbought (RSI > 70)</div>
                                    <ul class="quant-list">${fields['RSI70']}</ul>
                                 </div>`;
                    }
                                        if (fields['Above200']) {
                                            html += `<div class="screener-list-card bull">
                                    <div class="screener-header bull-text">🚀 Long-Term Breakout (Crossed 200D MA)</div>
                                    <ul class="quant-list">${fields['Above200']}</ul>
                                 </div>`;
                    }
                                        if (fields['GoldenSniper']) {
                                            html += `<div class="screener-list-card bull" style="border-top-color: #d4af37;">
                                    <div class="screener-header" style="color: #d4af37;">🎯 Golden Sniper</div>
                                    <ul class="quant-list">${fields['GoldenSniper']}</ul>
                                 </div>`;
                    }

                                        container.innerHTML = html || '<p style="color: #888;">No quant signals generated today.</p>';
                } else {
                                            container.innerHTML = '<p style="color: #888;">Market data currently unavailable or compiling.</p>';
                }
            } catch (error) {
                                            console.error("Error fetching quant data:", error);
                                        container.innerHTML = '<p style="color: #dc2626;">Error loading data.</p>';
            }
        }

        document.addEventListener('DOMContentLoaded', () => {
                                            fetchMacroData();
                                        fetchQuantData('ph'); 
        });

                                    </script>
                                </body>

                            </html>