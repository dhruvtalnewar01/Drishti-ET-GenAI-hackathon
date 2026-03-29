export const SIGNALS = [
  { id: 1, type: "BULK_DEAL", ticker: "TATAMOTORS", name: "Tata Motors", signal: "LIC acquired 2.3% stake via bulk deal at ₹924/share", confidence: 92, impact: "BULLISH", category: "Institutional", time: "09:32 AM", source: "NSE Bulk Deal Feed", detail: "Life Insurance Corporation purchased 6.84 crore shares totalling ₹6,320 Cr. Based on 14 similar LIC bulk acquisitions in Nifty 50, this pattern precedes 12–18% appreciation over 90 days in 78% of cases.", delta: "+2.8%" },
  { id: 2, type: "INSIDER", ticker: "INFY", name: "Infosys", signal: "Promoter pledging slashed from 18% to 6% in one quarter", confidence: 88, impact: "BULLISH", category: "Insider", time: "11:15 AM", source: "SEBI Insider Filing", detail: "Promoter group reduced pledge by 12 percentage points. SEBI data shows pledge reduction of >10% by promoters correlates with bullish reversal in 73% of mid/large-cap cases within 60 days.", delta: "+1.4%" },
  { id: 3, type: "RESULT", ticker: "HDFCBANK", name: "HDFC Bank", signal: "NIM expansion language shift in Q3 concall — missed by consensus", confidence: 79, impact: "BULLISH", category: "Earnings Signal", time: "02:44 PM", source: "Earnings Transcript NLP", detail: "Management used phrase 'comfortable with margin trajectory' 3× — absent in last 4 quarters. Sentiment model flags shift from neutral to cautiously positive. Consensus has not updated NIM estimates yet.", delta: "+0.9%" },
  { id: 4, type: "TECHNICAL", ticker: "RELIANCE", name: "Reliance Industries", signal: "Weekly cup-and-handle breakout above ₹2,940 on 2.4× volume", confidence: 85, impact: "BULLISH", category: "Chart Pattern", time: "03:18 PM", source: "Pattern Detection Engine", detail: "Cup-and-handle formed over 19 weeks. Breakout volume 2.4× 50-day average. Historical success rate of this pattern on RELIANCE: 78% over 24 prior instances. Measured move target: ₹3,220.", delta: "+3.2%" },
  { id: 5, type: "ALERT", ticker: "IDEA", name: "Vodafone Idea", signal: "Block deal: 4.1% stake offloaded by FII at 6.8% discount", confidence: 91, impact: "BEARISH", category: "Institutional", time: "10:02 AM", source: "NSE Block Deal Feed", detail: "Foreign institutional investor sold 4.1% stake at 6.8% discount to market price. Block deals at >5% discount signal near-term weakness in 81% of telecom sector cases historically.", delta: "-4.1%" },
  { id: 6, type: "REGULATORY", ticker: "PAYTM", name: "Paytm (One97)", signal: "SEBI fast-track listing approval for subsidiary granted", confidence: 74, impact: "BULLISH", category: "Regulatory", time: "01:30 PM", source: "SEBI Gazette", detail: "Regulatory clearance reduces holding company discount risk. HoldCo discount typically narrows 8–15% within 30 days of subsidiary listing approval based on 9 comparable events.", delta: "+5.3%" },
];

export const PATTERNS = [
  { ticker: "NIFTY50", pattern: "Ascending triangle", tf: "Daily", sr: "72%", bars: 18, target: "+4.2%", conf: 82 },
  { ticker: "BAJFINANCE", pattern: "Bull flag", tf: "Weekly", sr: "68%", bars: 6, target: "+8.1%", conf: 77 },
  { ticker: "WIPRO", pattern: "Inverse head & shoulders", tf: "Daily", sr: "65%", bars: 34, target: "+6.4%", conf: 70 },
  { ticker: "SBIN", pattern: "Double bottom", tf: "Weekly", sr: "71%", bars: 22, target: "+5.8%", conf: 80 },
  { ticker: "HCLTECH", pattern: "Breakout from base", tf: "Monthly", sr: "79%", bars: 8, target: "+11.2%", conf: 84 },
];

export const PORTFOLIO = [
  { ticker: "RELIANCE", qty: 50, avgPrice: 2710, ltp: 2940 },
  { ticker: "INFY", qty: 100, avgPrice: 1520, ltp: 1498 },
  { ticker: "HDFCBANK", qty: 75, avgPrice: 1680, ltp: 1724 },
  { ticker: "TATAMOTORS", qty: 30, avgPrice: 870, ltp: 924 },
  { ticker: "SBIN", qty: 200, avgPrice: 735, ltp: 808 },
];

export const SYSTEM_PROMPT = `You are DRISHTI — an elite AI market intelligence analyst for Indian equity markets, embedded within ET Markets. You scan NSE bulk/block deal feeds, SEBI filings, earnings call transcripts, and chart patterns across the entire NSE universe.

USER PORTFOLIO:
- RELIANCE: 50 shares @ avg ₹2,710 (CMP ₹2,940, +8.5% unrealised)
- INFY: 100 shares @ avg ₹1,520 (CMP ₹1,498, -1.4% unrealised)
- HDFCBANK: 75 shares @ avg ₹1,680 (CMP ₹1,724, +2.6% unrealised)
- TATAMOTORS: 30 shares @ avg ₹870 (CMP ₹924, +6.2% unrealised)
- SBIN: 200 shares @ avg ₹735 (CMP ₹808, +9.9% unrealised)

YOUR RULES:
- You are a signal-finder, NOT a summarizer. Find what others miss.
- Always cite your source: NSE filing, SEBI alert, pattern engine, or earnings transcript.
- Give specific numbers: success rates, historical instances, time horizons, price targets.
- Relate every answer to the user's specific portfolio holdings when relevant.
- Never give a generic answer. Be specific, data-backed, and direct.
- Use bullet points. Be concise but dense with signal.
- Always end with: "⚠️ For informational purposes only. Not SEBI-registered investment advice."`;

export const typeColor = (t) => ({
  BULK_DEAL: "#f59e0b",
  INSIDER: "#a78bfa",
  RESULT: "#38bdf8",
  TECHNICAL: "#34d399",
  ALERT: "#f87171",
  REGULATORY: "#fb923c"
}[t] || "#94a3b8");

export const typeIcon = (t) => ({
  BULK_DEAL: "📦",
  INSIDER: "🔍",
  RESULT: "📊",
  TECHNICAL: "📈",
  ALERT: "🚨",
  REGULATORY: "⚖️"
}[t] || "📡");
