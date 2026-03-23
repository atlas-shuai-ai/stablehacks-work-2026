# Solana Actions & Blinks: 开发者深度集成指南 (V2.0 生产级强化版)

## 1. 什么是 Solana Actions?
Solana Actions 是遵循规范的 API，返回 Solana 交易，供用户预览、签名和发送。它允许开发者将链上交互（如：打赏、投票、交易）直接集成到各种上下文（QR 码、按钮、社交媒体链接）。

### 核心机制
- **GET 请求**：返回 Action 的元数据（图标、标题、描述、可选参数）。
- **POST 请求**：接收用户的钱包地址 (`account`)，返回一个 Base64 编码的序列化交易 (`transaction`)。

## 2. 什么是 Blinks?
Blinks (Blockchain Links) 将 Action 转化为可分享、富元数据的链接。支持 Blink 的客户端（如特定的钱包扩展、社交平台机器人）会将普通 URL 渲染为交互式 UI（如显示“打赏 1 SOL”的按钮）。

## 3. 生产级代码实现 (SDK 进阶用法)
```typescript
import { ActionGetResponse, ActionPostRequest, ActionPostResponse, ACTIONS_CORS_HEADERS, createPostResponse } from "@solana/actions";
import { Transaction, SystemProgram, PublicKey, Connection } from "@solana/web3.js";

// GET: 动态参数定义 (用户自定义打赏金额)
export async function GET(req: Request) {
  const payload: ActionGetResponse = {
    type: "action",
    icon: "https://your-domain.com/hunter-engine.png",
    title: "支持 Atlas-02 猎手引擎",
    description: "输入 SOL 金额以维持刺客脚本的 24/7 运行。",
    label: "支持",
    links: {
      actions: [
        {
          label: "支持 0.1 SOL",
          href: "/api/actions/tip?amount=0.1",
        },
        {
          label: "支持自定义金额",
          href: "/api/actions/tip?amount={amount}",
          parameters: [
            {
              name: "amount",
              label: "输入 SOL 金额 (例如 0.5)",
              required: true,
            }
          ]
        }
      ]
    }
  };
  return Response.json(payload, { headers: ACTIONS_CORS_HEADERS });
}

// POST: 构建并验证交易
export async function POST(req: Request) {
  const body: ActionPostRequest = await req.json();
  const url = new URL(req.url);
  const amount = parseFloat(url.searchParams.get("amount") || "0.1");
  const account = new PublicKey(body.account);
  
  const connection = new Connection("https://api.mainnet-beta.solana.com");
  const transaction = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey: account,
      toPubkey: new PublicKey("YOUR_WALLET_ADDRESS"),
      lamports: amount * 1e9,
    })
  );
  
  // 设置 Blockhash 和 FeePayer
  transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
  transaction.feePayer = account;
  
  const payload: ActionPostResponse = await createPostResponse({
    fields: {
      transaction,
      message: `感谢您支持了 ${amount} SOL！刺客弹药已补充。`,
    }
  });
  return Response.json(payload, { headers: ACTIONS_CORS_HEADERS });
}
```

## 4. 关键规范与安全 (CORS & Chaining)
- **CORS 预检处理**：
  必须响应 `OPTIONS` 请求。`ACTIONS_CORS_HEADERS` 包含 `Access-Control-Allow-Origin: *` 和必要的 Method/Headers。
- **actions.json 映射规则**：
  在网站根目录部署，实现普通 URL 与 API 的映射。
```json
{
  "rules": [
    { "pathPattern": "/tip/**", "apiPath": "/api/actions/tip/**" }
  ]
}
```

## 5. 商业化路径：Bounties 与实用场景
- **社媒打赏**：Twitter 直接唤起支付。
- **治理投票**：Discord 内一键签章。
- **NFT 铸造**：扫描 QR 码即刻 Mint。
- **动态回执**：通过 `NextAction` 实现支付后的链式跳转（如：领取会员凭证）。
