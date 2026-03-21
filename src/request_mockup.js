const fs = require('fs');
const path = require('path');

class RequestProcessor {
    constructor() {
        this.requestQueuePath = '/root/.openclaw/workspace/treasury_requests';
        if (!fs.existsSync(this.requestQueuePath)) {
            fs.mkdirSync(this.requestQueuePath);
        }
    }

    async receiveRequest(req) {
        const reqId = `REQ_${Date.now()}`;
        const filePath = path.join(this.requestQueuePath, `${reqId}.json`);
        const data = JSON.stringify({ id: reqId, ...req, status: 'PENDING', receivedAt: new Date().toISOString() }, null, 2);
        fs.writeFileSync(filePath, data);
        console.log(`[Queue] Request ${reqId} received and saved.`);
        return reqId;
    }

    listPending() {
        const files = fs.readdirSync(this.requestQueuePath);
        return files.map(f => JSON.parse(fs.readFileSync(path.join(this.requestQueuePath, f))));
    }
}

// Quick Test
const processor = new RequestProcessor();
processor.receiveRequest({
    amount: 100,
    mint: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
    destination: 'Gv9B5Z...test'
}).then(() => {
    console.log('Current Queue:', processor.listPending());
});
