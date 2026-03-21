const fs = require('fs');
const path = require('path');

const LOG_DIR = '/root/.openclaw/workspace/audit_logs';
const OUTPUT_FILE = '/root/.openclaw/workspace/dashboard.html';

function generateDashboard() {
    let logs = [];
    
    // Read markdown audits
    const files = fs.readdirSync(LOG_DIR);
    files.forEach(file => {
        if (file.startsWith('audit_') && file.endsWith('.md')) {
            const content = fs.readFileSync(path.join(LOG_DIR, file), 'utf8');
            logs.push({ name: file, content: content.replace(/\n/g, '<br>') });
        }
    });

    // Read stable_pro.log
    if (fs.existsSync(path.join(LOG_DIR, 'stable_pro.log'))) {
        const proLog = fs.readFileSync(path.join(LOG_DIR, 'stable_pro.log'), 'utf8');
        logs.push({ name: 'StableAgent-Pro Log', content: proLog.replace(/\n/g, '<br>') });
    }

    const html = `
<!DOCTYPE html>
<html>
<head>
    <title>StableHacks Dashboard - Atlas-02</title>
    <style>
        body { font-family: sans-serif; background: #1a1a1a; color: #00ff00; padding: 20px; }
        .card { border: 1px solid #333; padding: 15px; margin-bottom: 20px; background: #222; }
        h1 { color: #fff; }
        .timestamp { color: #888; font-size: 0.8em; }
        .status-success { color: #00ff00; font-weight: bold; }
        .status-rejected { color: #ff0000; font-weight: bold; }
    </style>
</head>
<body>
    <h1>StableHacks 2026: Agentic Institutional Treasury</h1>
    <div class="card">
        <h2>Live Audit Stream</h2>
        ${logs.map(log => `
            <div>
                <h3>${log.name}</h3>
                <p style="font-family: monospace; font-size: 0.9em;">${log.content}</p>
            </div>
        `).join('<hr>')}
    </div>
</body>
</html>
    `;

    fs.writeFileSync(OUTPUT_FILE, html);
    console.log(`[Dashboard] Generated at ${OUTPUT_FILE}`);
}

generateDashboard();
