import { useState, useEffect, useRef } from "react";
import { SIGNALS, PATTERNS, PORTFOLIO, SYSTEM_PROMPT, typeColor, typeIcon } from "./data.js";

/* ─── Style Tokens ─── */
const S = {
  bg: "#060911", card: "#0c1322", cardHover: "#111d33", border: "#1a2744",
  borderHover: "#2a3f66", text: "#f0f4f8", muted: "#5e7490", dim: "#3d5272",
  deep: "#04070f", elevated: "#0f1a2e",
};

/* ─── Reusable micro-components ─── */
const Badge = ({ children, color, glow }) => (
  <span style={{ background: color + "15", color, fontSize: 9, fontWeight: 700, padding: "3px 8px", borderRadius: 5, letterSpacing: "0.04em", textTransform: "uppercase", border: `1px solid ${color}25`, boxShadow: glow ? `0 0 8px ${color}20` : "none" }}>{children}</span>
);

const ConfBar = ({ value, color = "#f59e0b", width = 72 }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
    <div style={{ background: "#0a101e", borderRadius: 6, height: 5, width, overflow: "hidden", border: "1px solid #1a274420" }}>
      <div style={{ background: `linear-gradient(90deg, ${color}90, ${color})`, height: "100%", borderRadius: 6, width: `${value}%`, transition: "width 0.8s cubic-bezier(0.34,1.56,0.64,1)", boxShadow: `0 0 6px ${color}40` }} />
    </div>
    <span style={{ color, fontWeight: 700, fontSize: 11, fontFamily: "var(--font-mono)" }}>{value}%</span>
  </div>
);

const GlowDot = ({ color = "#10b981" }) => (
  <span style={{ display: "inline-block", width: 7, height: 7, borderRadius: "50%", background: color, boxShadow: `0 0 6px ${color}, 0 0 12px ${color}60`, animation: "live-pulse 2s ease-in-out infinite" }} />
);

export default function DRISHTI() {
  const [tab, setTab] = useState("radar");
  const [selected, setSelected] = useState(null);
  const [messages, setMessages] = useState([{ role: "assistant", content: "Namaste! I am DRISHTI — your AI market intelligence layer.\n\nI have loaded your portfolio (RELIANCE, INFY, HDFCBANK, TATAMOTORS, SBIN) and I am monitoring 1,847 live signals across the NSE universe.\n\n• 6 actionable signals detected today\n• 3 directly impact your holdings\n• Portfolio P&L: +₹60,890 (+5.26%)\n\nWhat would you like to know?" }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("ALL");
  const [hoveredCard, setHoveredCard] = useState(null);
  const bottom = useRef(null);

  useEffect(() => { bottom.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const pnl = PORTFOLIO.reduce((a, s) => a + (s.ltp - s.avgPrice) * s.qty, 0);
  const invested = PORTFOLIO.reduce((a, s) => a + s.avgPrice * s.qty, 0);
  const currentVal = invested + pnl;
  const filtered = filter === "ALL" ? SIGNALS : SIGNALS.filter(s => s.impact === filter);

  const send = async (q) => {
    const msg = q || input.trim();
    if (!msg || loading) return;
    setInput("");
    setTab("analyst");
    setMessages(prev => [...prev, { role: "user", content: msg }]);
    setLoading(true);
    try {
      const history = messages.map(m => ({ role: m.role, content: m.content }));
      const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer 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",
          "HTTP-Referer": "https://drishti-markets.netlify.app",
          "X-Title": "DRISHTI Market Intelligence"
        },
        body: JSON.stringify({ model: "meta-llama/llama-3.3-70b-instruct:free", messages: [{ role: "system", content: SYSTEM_PROMPT }, ...history, { role: "user", content: msg }] })
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: "assistant", content: data.choices?.[0]?.message?.content || "Signal processing error. Please retry." }]);
    } catch { setMessages(prev => [...prev, { role: "assistant", content: "Network error — please retry." }]); }
    setLoading(false);
  };

  const tabs = [["radar", "Opportunity Radar", "📡"], ["patterns", "Pattern Intelligence", "📐"], ["analyst", "AI Analyst", "🧠"], ["portfolio", "My Portfolio", "💼"]];

  return (
    <div style={{ background: S.bg, color: S.text, minHeight: "100vh", fontFamily: "var(--font-sans)", fontSize: 13, position: "relative" }}>
      {/* Ambient glow orbs */}
      <div style={{ position: "fixed", top: -120, right: -120, width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(245,158,11,0.06) 0%, transparent 70%)", pointerEvents: "none", zIndex: 0 }} />
      <div style={{ position: "fixed", bottom: -150, left: -100, width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(56,189,248,0.04) 0%, transparent 70%)", pointerEvents: "none", zIndex: 0 }} />

      {/* ═══ HEADER ═══ */}
      <header style={{ borderBottom: `1px solid ${S.border}`, padding: "14px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12, backdropFilter: "blur(12px)", background: "rgba(6,9,17,0.85)", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ background: "linear-gradient(135deg, #f59e0b, #ef4444, #f59e0b)", backgroundSize: "200% 200%", animation: "gradient-shift 4s ease infinite", width: 38, height: 38, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 17, color: "#fff", boxShadow: "0 0 20px rgba(245,158,11,0.3)", letterSpacing: "-0.02em" }}>D</div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 16, color: "#f8fafc", letterSpacing: "-0.02em", display: "flex", alignItems: "center", gap: 8 }}>DRISHTI<span style={{ display: "inline-flex", alignItems: "center", gap: 4, color: "#f59e0b", fontSize: 9, background: "linear-gradient(135deg, #1a1400, #1a0f00)", padding: "3px 8px", borderRadius: 5, border: "1px solid #f59e0b30", fontWeight: 700 }}><GlowDot color="#f59e0b" /> LIVE</span></div>
            <div style={{ color: S.muted, fontSize: 10, letterSpacing: "0.02em" }}>Deep Research Intelligence System · ET Markets</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 24, flexWrap: "wrap", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 9, color: S.dim, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 2 }}>Portfolio P&L</div>
            <div style={{ color: "#10b981", fontWeight: 800, fontSize: 15, fontFamily: "var(--font-mono)" }}>+₹{pnl.toLocaleString("en-IN")} <span style={{ fontSize: 11, opacity: 0.7 }}>({((pnl / invested) * 100).toFixed(1)}%)</span></div>
          </div>
          <div>
            <div style={{ fontSize: 9, color: S.dim, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 2 }}>Live Signals</div>
            <div style={{ color: "#f59e0b", fontWeight: 800, fontSize: 15, fontFamily: "var(--font-mono)", display: "flex", alignItems: "center", gap: 6 }}><GlowDot color="#f59e0b" />{SIGNALS.length} active</div>
          </div>
          <div style={{ background: "linear-gradient(135deg, #0a1628, #0f1e38)", border: "1px solid #1e3a5f", borderRadius: 8, padding: "6px 14px", fontSize: 9, color: "#38bdf8", display: "flex", alignItems: "center", gap: 6, letterSpacing: "0.05em", fontWeight: 600 }}><GlowDot color="#38bdf8" />NSE · SEBI · ET CONNECTED</div>
        </div>
      </header>

      {/* ═══ TAB BAR ═══ */}
      <nav style={{ borderBottom: `1px solid ${S.border}`, padding: "0 24px", display: "flex", overflowX: "auto", background: "rgba(6,9,17,0.6)", backdropFilter: "blur(8px)" }}>
        {tabs.map(([k, l, icon]) => (
          <button key={k} onClick={() => setTab(k)} style={{ background: "none", border: "none", color: tab === k ? "#f59e0b" : S.muted, borderBottom: tab === k ? "2px solid #f59e0b" : "2px solid transparent", padding: "11px 18px", fontSize: 12, fontWeight: tab === k ? 700 : 400, whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: 6, transition: "all 0.2s", letterSpacing: "0.01em" }}><span style={{ fontSize: 13 }}>{icon}</span>{l}</button>
        ))}
      </nav>

      <main style={{ padding: "20px 24px", position: "relative", zIndex: 1 }}>

        {/* ═══ RADAR TAB ═══ */}
        {tab === "radar" && <div style={{ animation: "fadeIn 0.3s ease" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 10 }}>
            <div>
              <div style={{ fontWeight: 800, fontSize: 16, color: "#f8fafc", letterSpacing: "-0.02em" }}>Signal Finder — Not a Summarizer</div>
              <div style={{ color: S.muted, fontSize: 11, marginTop: 2 }}>NSE filings · block deals · insider trades · concall NLP · pattern detection</div>
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              {["ALL", "BULLISH", "BEARISH"].map(f => (
                <button key={f} onClick={() => setFilter(f)} style={{ padding: "5px 14px", borderRadius: 20, border: `1px solid ${filter === f ? "#f59e0b" : S.border}`, background: filter === f ? "linear-gradient(135deg, #1a1400, #1a0f00)" : "none", color: filter === f ? "#f59e0b" : S.muted, fontSize: 11, fontWeight: filter === f ? 700 : 400, boxShadow: filter === f ? "0 0 12px rgba(245,158,11,0.15)" : "none" }}>{f === "BULLISH" ? "🟢 " : f === "BEARISH" ? "🔴 " : ""}{f}</button>
              ))}
            </div>
          </div>
          <div style={{ display: "grid", gap: 10 }}>
            {filtered.map((sig, idx) => (
              <div key={sig.id} onClick={() => setSelected(selected?.id === sig.id ? null : sig)}
                onMouseEnter={() => setHoveredCard(sig.id)} onMouseLeave={() => setHoveredCard(null)}
                style={{ background: hoveredCard === sig.id ? S.cardHover : S.card, border: `1px solid ${selected?.id === sig.id ? "#f59e0b50" : hoveredCard === sig.id ? S.borderHover : S.border}`, borderRadius: 12, padding: 16, cursor: "pointer", transition: "all 0.25s ease", animation: `fadeInUp 0.4s ease ${idx * 0.06}s both`, boxShadow: selected?.id === sig.id ? "0 0 20px rgba(245,158,11,0.1)" : hoveredCard === sig.id ? "0 4px 20px rgba(0,0,0,0.3)" : "var(--shadow-card)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 14 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, flexWrap: "wrap" }}>
                      <span style={{ fontSize: 15 }}>{typeIcon(sig.type)}</span>
                      <Badge color={typeColor(sig.type)} glow>{sig.type.replace("_", " ")}</Badge>
                      <span style={{ fontWeight: 800, fontSize: 15, color: "#f8fafc", fontFamily: "var(--font-mono)" }}>{sig.ticker}</span>
                      <span style={{ color: S.muted, fontSize: 11 }}>{sig.name}</span>
                      <span style={{ color: S.dim, fontSize: 10, marginLeft: "auto", fontFamily: "var(--font-mono)" }}>{sig.time}</span>
                    </div>
                    <div style={{ color: "#cbd5e1", fontSize: 12.5, lineHeight: 1.6, marginBottom: 6 }}>{sig.signal}</div>
                    <div style={{ fontSize: 10, color: S.dim, display: "flex", alignItems: "center", gap: 4 }}>
                      <span style={{ opacity: 0.5 }}>📡</span> Source: {sig.source}
                    </div>
                  </div>
                  <div style={{ textAlign: "right", minWidth: 80, display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
                    <Badge color={sig.impact === "BULLISH" ? "#10b981" : "#ef4444"} glow>{sig.impact}</Badge>
                    <div style={{ color: sig.impact === "BULLISH" ? "#10b981" : "#ef4444", fontSize: 16, fontWeight: 800, fontFamily: "var(--font-mono)", textShadow: sig.impact === "BULLISH" ? "0 0 12px rgba(16,185,129,0.3)" : "0 0 12px rgba(239,68,68,0.3)" }}>{sig.delta}</div>
                    <ConfBar value={sig.confidence} color={sig.confidence > 85 ? "#10b981" : "#f59e0b"} />
                  </div>
                </div>
                {selected?.id === sig.id && (
                  <div style={{ marginTop: 14, padding: 14, background: "linear-gradient(135deg, #04070f, #060d18)", borderRadius: 10, borderLeft: `3px solid ${typeColor(sig.type)}`, animation: "fadeInUp 0.3s ease", boxShadow: `inset 0 0 20px ${typeColor(sig.type)}08` }}>
                    <div style={{ fontSize: 11.5, color: "#94a3b8", lineHeight: 1.8 }}>{sig.detail}</div>
                    <button onClick={e => { e.stopPropagation(); send(`${sig.ticker} signal: ${sig.signal}. How does this affect my portfolio?`); }} style={{ marginTop: 10, background: "linear-gradient(135deg, #1a1400, #1a0f00)", border: "1px solid #f59e0b40", color: "#f59e0b", borderRadius: 8, padding: "7px 16px", fontSize: 11, fontWeight: 600, display: "flex", alignItems: "center", gap: 6, boxShadow: "0 0 12px rgba(245,158,11,0.1)" }}>🧠 Ask DRISHTI about this →</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>}

        {/* ═══ PATTERNS TAB ═══ */}
        {tab === "patterns" && <div style={{ animation: "fadeIn 0.3s ease" }}>
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontWeight: 800, fontSize: 16, color: "#f8fafc", letterSpacing: "-0.02em" }}>Chart Pattern Intelligence</div>
            <div style={{ color: S.muted, fontSize: 11, marginTop: 2 }}>Back-tested success rates per stock · measured move targets · plain-English explanations</div>
          </div>
          <div style={{ display: "grid", gap: 10 }}>
            {PATTERNS.map((p, i) => (
              <div key={i} style={{ background: S.card, border: `1px solid ${S.border}`, borderRadius: 12, padding: 16, transition: "all 0.2s", animation: `fadeInUp 0.4s ease ${i * 0.08}s both` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 10 }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, flexWrap: "wrap" }}>
                      <span style={{ fontWeight: 800, fontSize: 15, color: "#f8fafc", fontFamily: "var(--font-mono)" }}>{p.ticker}</span>
                      <Badge color="#38bdf8">{p.tf}</Badge>
                      <Badge color="#a78bfa">{p.pattern}</Badge>
                    </div>
                    <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
                      <div style={{ fontSize: 11 }}><span style={{ color: S.dim }}>Formation: </span><span style={{ color: "#94a3b8", fontFamily: "var(--font-mono)" }}>{p.bars} bars</span></div>
                      <div style={{ fontSize: 11 }}><span style={{ color: S.dim }}>Target: </span><span style={{ color: "#10b981", fontWeight: 700, fontFamily: "var(--font-mono)" }}>{p.target}</span></div>
                      <div style={{ fontSize: 11 }}><span style={{ color: S.dim }}>Historical: </span><span style={{ color: "#f59e0b", fontWeight: 700, fontFamily: "var(--font-mono)" }}>{p.sr}</span></div>
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: 9, color: S.dim, marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.08em" }}>AI Confidence</div>
                    <ConfBar value={p.conf} color="#a78bfa" />
                  </div>
                </div>
                <div style={{ marginTop: 12, background: "linear-gradient(135deg, #04070f, #060d18)", borderRadius: 8, padding: "10px 12px", height: 56, position: "relative", overflow: "hidden", border: "1px solid #1a274420" }}>
                  <svg width="100%" height="44" viewBox="0 0 380 44">
                    {p.pattern === "Bull flag" && <><polyline points="8,38 30,26 55,12 75,20 95,15 115,21 135,17 155,23 175,19 195,24 210,8" fill="none" stroke="#10b981" strokeWidth="1.5" /><line x1="210" y1="8" x2="270" y2="8" stroke="#f59e0b" strokeWidth="1" strokeDasharray="3 2" /><text x="275" y="12" fill="#f59e0b" fontSize="8">Target</text></>}
                    {p.pattern === "Ascending triangle" && <><line x1="8" y1="10" x2="240" y2="10" stroke="#10b981" strokeWidth="1" /><polyline points="8,38 30,26 58,16 78,28 108,18 128,26 158,14 178,24 208,13" fill="none" stroke="#38bdf8" strokeWidth="1.5" /><line x1="208" y1="13" x2="270" y2="5" stroke="#f59e0b" strokeWidth="1" strokeDasharray="3 2" /></>}
                    {p.pattern === "Inverse head & shoulders" && <><polyline points="8,14 35,32 58,20 88,42 118,20 145,30 170,14" fill="none" stroke="#38bdf8" strokeWidth="1.5" /><line x1="8" y1="14" x2="240" y2="14" stroke="#10b981" strokeWidth="0.8" strokeDasharray="2 2" /><line x1="170" y1="14" x2="240" y2="5" stroke="#f59e0b" strokeWidth="1" strokeDasharray="3 2" /></>}
                    {p.pattern === "Double bottom" && <><polyline points="8,10 35,28 65,40 90,26 115,40 140,26 165,10" fill="none" stroke="#38bdf8" strokeWidth="1.5" /><line x1="8" y1="10" x2="240" y2="10" stroke="#10b981" strokeWidth="0.8" strokeDasharray="2 2" /><line x1="165" y1="10" x2="240" y2="3" stroke="#f59e0b" strokeWidth="1" strokeDasharray="3 2" /></>}
                    {p.pattern === "Breakout from base" && <><polyline points="8,33 35,30 65,32 90,31 120,33 145,29 165,32 185,30 205,18 225,10" fill="none" stroke="#38bdf8" strokeWidth="1.5" /><line x1="8" y1="30" x2="200" y2="30" stroke="#64748b" strokeWidth="0.5" strokeDasharray="2 2" /><line x1="225" y1="10" x2="270" y2="3" stroke="#f59e0b" strokeWidth="1" strokeDasharray="3 2" /></>}
                  </svg>
                  <div style={{ position: "absolute", top: 6, right: 10, fontSize: 8, color: S.dim, textTransform: "uppercase", letterSpacing: "0.08em" }}>Schematic</div>
                </div>
                <button onClick={() => send(`Explain the ${p.pattern} pattern on ${p.ticker} in plain English. What confirms the breakout?`)} style={{ marginTop: 10, background: "none", border: `1px solid ${S.border}`, color: S.muted, borderRadius: 8, padding: "6px 14px", fontSize: 10, display: "flex", alignItems: "center", gap: 6, fontWeight: 500 }}>🧠 Ask DRISHTI to explain →</button>
              </div>
            ))}
          </div>
        </div>}

        {/* ═══ ANALYST TAB ═══ */}
        {tab === "analyst" && (
          <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 210px)", minHeight: 400, animation: "fadeIn 0.3s ease" }}>
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontWeight: 800, fontSize: 16, color: "#f8fafc", letterSpacing: "-0.02em" }}>DRISHTI AI Analyst</div>
              <div style={{ color: S.muted, fontSize: 11, marginTop: 2 }}>Portfolio-aware · source-cited · powered by Llama 3.3 70B via OpenRouter</div>
            </div>
            <div style={{ flex: 1, overflowY: "auto", background: "linear-gradient(180deg, #04070f, #060911)", borderRadius: 12, border: `1px solid ${S.border}`, padding: 16, display: "flex", flexDirection: "column", gap: 14, marginBottom: 12, boxShadow: "inset 0 2px 20px rgba(0,0,0,0.3)" }}>
              {messages.map((m, i) => (
                <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start", animation: `fadeInUp 0.3s ease` }}>
                  <div style={{ maxWidth: "88%", background: m.role === "user" ? "linear-gradient(135deg, #1a1400, #1a0f00)" : S.card, border: `1px solid ${m.role === "user" ? "#f59e0b30" : S.border}`, borderRadius: m.role === "user" ? "14px 14px 2px 14px" : "2px 14px 14px 14px", padding: "12px 16px", fontSize: 12.5, lineHeight: 1.8, color: m.role === "user" ? "#fde68a" : "#cbd5e1", whiteSpace: "pre-wrap", boxShadow: m.role === "user" ? "0 0 15px rgba(245,158,11,0.08)" : "var(--shadow-card)" }}>
                    {m.role === "assistant" && <div style={{ fontSize: 9, color: "#f59e0b", fontWeight: 700, marginBottom: 6, letterSpacing: "0.08em", display: "flex", alignItems: "center", gap: 5 }}><GlowDot color="#f59e0b" />DRISHTI INTELLIGENCE</div>}
                    {m.content}
                  </div>
                </div>
              ))}
              {loading && <div style={{ display: "flex", animation: "fadeInUp 0.3s ease" }}><div style={{ background: S.card, border: `1px solid ${S.border}`, borderRadius: "2px 14px 14px 14px", padding: "12px 16px" }}><div style={{ fontSize: 9, color: "#f59e0b", fontWeight: 700, marginBottom: 6, letterSpacing: "0.08em", display: "flex", alignItems: "center", gap: 5 }}><GlowDot color="#f59e0b" />DRISHTI INTELLIGENCE</div><div style={{ color: S.dim, fontSize: 11, display: "flex", gap: 4 }}>Scanning NSE signals<span style={{ animation: "typing-dots 1.4s infinite" }}>.</span><span style={{ animation: "typing-dots 1.4s infinite 0.2s" }}>.</span><span style={{ animation: "typing-dots 1.4s infinite 0.4s" }}>.</span></div></div></div>}
              <div ref={bottom} />
            </div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 10 }}>
              {["Which of my holdings are at risk?", "Find missed opportunities today", "Explain TATAMOTORS LIC deal", "Best tax-loss harvesting move now"].map(q => <button key={q} onClick={() => send(q)} style={{ background: S.card, border: `1px solid ${S.border}`, color: S.muted, borderRadius: 20, padding: "5px 12px", fontSize: 10, whiteSpace: "nowrap", fontWeight: 500 }}>{q}</button>)}
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && send()} placeholder="Ask DRISHTI anything about the market or your portfolio..." style={{ flex: 1, background: S.card, border: `1px solid ${S.border}`, borderRadius: 10, padding: "12px 16px", color: S.text, fontSize: 12, transition: "border-color 0.2s" }} onFocus={e => e.target.style.borderColor = "#f59e0b40"} onBlur={e => e.target.style.borderColor = S.border} />
              <button onClick={() => send()} disabled={loading} style={{ background: loading ? S.border : "linear-gradient(135deg, #f59e0b, #f97316)", color: loading ? S.muted : "#000", border: "none", borderRadius: 10, padding: "12px 24px", fontSize: 12, fontWeight: 800, boxShadow: loading ? "none" : "0 0 20px rgba(245,158,11,0.25)" }}>{loading ? "···" : "Send ↗"}</button>
            </div>
            <div style={{ fontSize: 9, color: "#1e2d45", marginTop: 6, textAlign: "center" }}>For informational purposes only. Not SEBI-registered investment advice.</div>
          </div>
        )}

        {/* ═══ PORTFOLIO TAB ═══ */}
        {tab === "portfolio" && <div style={{ animation: "fadeIn 0.3s ease" }}>
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontWeight: 800, fontSize: 16, color: "#f8fafc", letterSpacing: "-0.02em" }}>Portfolio Intelligence View</div>
            <div style={{ color: S.muted, fontSize: 11, marginTop: 2 }}>DRISHTI maps every active signal to your holdings automatically</div>
          </div>
          {/* Summary cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 10, marginBottom: 18 }}>
            {[
              { label: "Total Invested", value: `₹${invested.toLocaleString("en-IN")}`, color: "#f8fafc", icon: "💰" },
              { label: "Current Value", value: `₹${currentVal.toLocaleString("en-IN")}`, color: "#f8fafc", icon: "📊" },
              { label: "Unrealised P&L", value: `+₹${pnl.toLocaleString("en-IN")}`, sub: `${((pnl / invested) * 100).toFixed(2)}%`, color: "#10b981", icon: "📈" },
              { label: "Active Signals", value: "3 bullish · 0 bearish", color: "#f59e0b", icon: "📡" },
            ].map((c, i) => (
              <div key={i} style={{ background: S.card, border: `1px solid ${S.border}`, borderRadius: 12, padding: 16, animation: `fadeInUp 0.4s ease ${i * 0.08}s both` }}>
                <div style={{ fontSize: 9, color: S.dim, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6, display: "flex", alignItems: "center", gap: 5 }}><span>{c.icon}</span>{c.label}</div>
                <div style={{ fontWeight: 800, fontSize: 17, color: c.color, fontFamily: "var(--font-mono)" }}>{c.value}</div>
                {c.sub && <div style={{ fontSize: 11, color: c.color, opacity: 0.7, fontFamily: "var(--font-mono)" }}>{c.sub}</div>}
              </div>
            ))}
          </div>
          {/* Holdings */}
          <div style={{ display: "grid", gap: 10 }}>
            {PORTFOLIO.map((h, i) => {
              const pct = ((h.ltp - h.avgPrice) / h.avgPrice) * 100;
              const sig = SIGNALS.find(s => s.ticker === h.ticker);
              return (
                <div key={i} style={{ background: S.card, border: `1px solid ${sig ? "#f59e0b30" : S.border}`, borderRadius: 12, padding: 16, animation: `fadeInUp 0.4s ease ${i * 0.06}s both`, transition: "all 0.2s" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                        <span style={{ fontWeight: 800, fontSize: 15, color: "#f8fafc", fontFamily: "var(--font-mono)" }}>{h.ticker}</span>
                        {sig && <Badge color="#f59e0b" glow>⚡ SIGNAL ACTIVE</Badge>}
                      </div>
                      <div style={{ fontSize: 11, color: S.dim }}>{h.qty} shares · Avg ₹{h.avgPrice.toLocaleString("en-IN")}</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontWeight: 800, fontSize: 16, color: "#f8fafc", fontFamily: "var(--font-mono)" }}>₹{h.ltp.toLocaleString("en-IN")}</div>
                      <div style={{ color: pct >= 0 ? "#10b981" : "#ef4444", fontWeight: 700, fontSize: 13, fontFamily: "var(--font-mono)", textShadow: pct >= 0 ? "0 0 8px rgba(16,185,129,0.3)" : "0 0 8px rgba(239,68,68,0.3)" }}>{pct >= 0 ? "+" : ""}{pct.toFixed(2)}%</div>
                      <div style={{ color: S.dim, fontSize: 10, fontFamily: "var(--font-mono)" }}>₹{((h.ltp - h.avgPrice) * h.qty).toLocaleString("en-IN")}</div>
                    </div>
                  </div>
                  {sig && <div style={{ marginTop: 12, padding: "10px 12px", background: "linear-gradient(135deg, #04070f, #060d18)", borderRadius: 8, borderLeft: "3px solid #f59e0b" }}>
                    <div style={{ fontSize: 11, color: "#94a3b8", lineHeight: 1.7 }}><span style={{ color: "#f59e0b", fontWeight: 700 }}>DRISHTI: </span>{sig.signal}</div>
                    <button onClick={() => send(`I hold ${h.ticker}. ${sig.signal}. What should I know?`)} style={{ marginTop: 8, background: "none", border: "1px solid #f59e0b30", color: "#f59e0b", borderRadius: 7, padding: "5px 12px", fontSize: 10, fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}>🧠 Ask DRISHTI →</button>
                  </div>}
                </div>
              );
            })}
          </div>
        </div>}
      </main>

      {/* Footer */}
      <footer style={{ borderTop: `1px solid ${S.border}`, padding: "12px 24px", textAlign: "center", fontSize: 9, color: S.dim, background: "rgba(6,9,17,0.6)" }}>
        DRISHTI Intelligence System · ET Markets · For informational purposes only · Not SEBI-registered investment advice
      </footer>
    </div>
  );
}
