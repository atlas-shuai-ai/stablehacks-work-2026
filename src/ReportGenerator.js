const fs = require('fs');
const path = require('path');

class ReportGenerator {
    constructor(logPath) {
        this.logPath = logPath;
    }

    generateDailySummary() {
        const logFile = path.join(this.logPath, 'stable_agent.log');
        if (!fs.existsSync(logFile)) return "No logs found.";

        const logs = fs.readFileSync(logFile, 'utf8').split('\n').filter(l => l.trim());
        const total = logs.length;
        const success = logs.filter(l => l.includes('SUCCESS')).length;
        const rejected = logs.filter(l => l.includes('REJECTED')).length;

        const report = `
# StableAgent 每日合规审计报告
**日期**: ${new Date().toISOString().split('T')[0]}
**系统状态**: 运行中

## 核心指标
- **总处理请求**: ${total}
- **成功支付**: ${success}
- **合规拦截**: ${rejected}
- **拦截率**: ${((rejected/total)*100).toFixed(2)}%

## 拦截详情记录
${logs.filter(l => l.includes('REJECTED')).map(l => `- ${l}`).join('\n')}

---
*此报告由 Atlas-02 自动化审计模块生成*
`;
        const reportPath = path.join(this.logPath, 'DAILY_SUMMARY.md');
        fs.writeFileSync(reportPath, report);
        return reportPath;
    }
}

const gen = new ReportGenerator('/root/.openclaw/workspace/audit_logs');
console.log('Report generated at:', gen.generateDailySummary());
