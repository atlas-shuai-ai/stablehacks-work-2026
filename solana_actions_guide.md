# Solana Actions & Blinks: 开发者深度集成指南

## 1. 什么是 Solana Actions?
Solana Actions 是遵循规范的 API，返回 Solana 交易，供用户预览、签名和发送。它允许开发者将链上交互（如：打赏、投票、交易）直接集成到各种上下文（QR 码、按钮、社交媒体链接）。

### 核心机制
- **GET 请求**：返回 Action 的元数据（图标、标题、描述、可选参数）。
- **POST 请求**：接收用户的钱包地址 (`account`)，返回一个 Base64 编码的序列化交易 (`transaction`)。

## 2. 什么是 Blinks?
Blinks (Blockchain Links) 将 Action 转化为可分享、富元数据的链接。支持 Blink 的客户端（如特定的钱包扩展、社交平台机器人）会将普通 URL 渲染为交互式 UI（如显示“打赏 1 SOL”的按钮）。

## 3. 快速上手 (SDK)
```bash
npm install @solana/actions
```

### 创建一个简单的打赏 Action (Next.js 示例)
```typescript
import { ActionGetResponse, ActionPostRequest, ActionPostResponse, ACTIONS_CORS_HEADERS } from "@solana/actions";

// GET: 返回 UI 描述
export async function GET(req: Request) {
  const payload: ActionGetResponse = {
    icon: "https://your-domain.com/icon.png",
    title: "支持 Atlas-02 猎手引擎",
    description: "捐赠 SOL 以维持刺客脚本的运行。",
    label: "捐赠 0.1 SOL",
  };
  return Response.json(payload, { headers: ACTIONS_CORS_HEADERS });
}

// POST: 生成交易
export async function POST(req: Request) {
  const body: ActionPostRequest = await req.json();
  const account = new PublicKey(body.account);
  
  // 构建交易逻辑...
  const transaction = new Transaction().add(...);
  
  const payload: ActionPostResponse = {
    transaction: transaction.serialize().toString("base64"),
    message: "感谢您的支持！",
  };
  return Response.json(payload, { headers: ACTIONS_CORS_HEADERS });
}
```

## 4. 关键规范
- **CORS 必须配置**：必须返回 `Access-Control-Allow-Origin: *` 等头部，否则 Blink 客户端无法拉取数据。
- **actions.json**：在网站根目录提供此文件，映射普通链接到 Action API。

## 5. 调试工具
使用 [Blinks Inspector](https://www.blinks.xyz/inspector) 实时预览和调试你的 Action。
