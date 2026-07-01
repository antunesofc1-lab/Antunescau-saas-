"use client";

import React, { useState } from "react";
import { Sparkles, Copy, Check, Instagram, Linkedin, Twitter, Mail, Loader2, Music2 } from "lucide-react";

const PLATFORMS = [
  { id: "instagram", label: "Instagram", icon: Instagram },
  { id: "tiktok", label: "TikTok", icon: Music2 },
  { id: "linkedin", label: "LinkedIn", icon: Linkedin },
  { id: "twitter", label: "X / Twitter", icon: Twitter },
  { id: "email", label: "E-mail", icon: Mail },
];

const TONES = ["Descontraído", "Profissional", "Divertido", "Inspirador", "Urgente"];

export default function Page() {
  const [topic, setTopic] = useState("");
  const [platform, setPlatform] = useState("instagram");
  const [tone, setTone] = useState("Descontraído");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [results, setResults] = useState([]);
  const [copiedIdx, setCopiedIdx] = useState(null);

  const generate = async () => {
    if (!topic.trim()) {
      setError("Conta pra mim sobre o que é a campanha ou produto.");
      return;
    }
    setError("");
    setLoading(true);
    setResults([]);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, platform, tone }),
      });
      const data = await response.json();
      if (data.error) {
        setError(data.error);
      } else {
        setResults(data.variations || []);
      }
    } catch (e) {
      setError("Não consegui gerar agora. Tenta de novo em instantes.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 1500);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#FAF7F2",
        fontFamily: "'Inter', system-ui, sans-serif",
        color: "#232323",
      }}
    >
      <style>{`
        .ff-display { font-family: 'Fraunces', serif; }
        .ff-mono { font-family: 'JetBrains Mono', monospace; }
        .ff-btn:focus-visible, .ff-input:focus-visible, .ff-chip:focus-visible {
          outline: 2px solid #FF6B4A;
          outline-offset: 2px;
        }
        @media (prefers-reduced-motion: reduce) {
          * { animation: none !important; transition: none !important; }
        }
        @keyframes ff-spin { to { transform: rotate(360deg); } }
      `}</style>

      <header style={{ padding: "28px 24px 8px", maxWidth: 1080, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 30,
              height: 30,
              borderRadius: 8,
              background: "#1B1F3B",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Sparkles size={16} color="#FF6B4A" />
          </div>
          <span className="ff-mono" style={{ fontSize: 12, letterSpacing: 1, color: "#8B8878" }}>
            CONTENT FORGE
          </span>
        </div>
        <h1
          className="ff-display"
          style={{ fontSize: "clamp(28px, 5vw, 44px)", fontWeight: 600, marginTop: 14, marginBottom: 6, lineHeight: 1.1 }}
        >
          Sua próxima campanha,<br />escrita em segundos.
        </h1>
        <p style={{ color: "#5C5850", fontSize: 15, maxWidth: 480 }}>
          Descreva o produto, escolha a plataforma e o tom. A IA forja três variações prontas pra usar.
        </p>
      </header>

      <main style={{ maxWidth: 1080, margin: "0 auto", padding: "24px", display: "grid", gap: 24 }}>
        <section
          style={{
            background: "#fff",
            border: "1px solid #E8E3D8",
            borderRadius: 16,
            padding: 24,
          }}
        >
          <label className="ff-mono" style={{ fontSize: 11, letterSpacing: 1, color: "#8B8878" }}>
            SOBRE O QUE É A CAMPANHA
          </label>
          <textarea
            className="ff-input"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Ex: lançamento de um curso online de finanças pessoais para iniciantes"
            rows={3}
            style={{
              width: "100%",
              marginTop: 8,
              padding: "12px 14px",
              border: "1px solid #E8E3D8",
              borderRadius: 10,
              fontSize: 15,
              fontFamily: "inherit",
              resize: "vertical",
              background: "#FDFCFA",
              boxSizing: "border-box",
            }}
          />

          <div style={{ display: "flex", gap: 28, flexWrap: "wrap", marginTop: 18 }}>
            <div>
              <label className="ff-mono" style={{ fontSize: 11, letterSpacing: 1, color: "#8B8878" }}>
                PLATAFORMA
              </label>
              <div style={{ display: "flex", gap: 8, marginTop: 8, flexWrap: "wrap" }}>
                {PLATFORMS.map((p) => {
                  const Icon = p.icon;
                  const active = platform === p.id;
                  return (
                    <button
                      key={p.id}
                      className="ff-chip"
                      onClick={() => setPlatform(p.id)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        padding: "8px 12px",
                        borderRadius: 20,
                        border: active ? "1px solid #1B1F3B" : "1px solid #E8E3D8",
                        background: active ? "#1B1F3B" : "#fff",
                        color: active ? "#fff" : "#232323",
                        fontSize: 13,
                        cursor: "pointer",
                      }}
                    >
                      <Icon size={14} />
                      {p.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="ff-mono" style={{ fontSize: 11, letterSpacing: 1, color: "#8B8878" }}>
                TOM DE VOZ
              </label>
              <div style={{ display: "flex", gap: 8, marginTop: 8, flexWrap: "wrap" }}>
                {TONES.map((t) => {
                  const active = tone === t;
                  return (
                    <button
                      key={t}
                      className="ff-chip"
                      onClick={() => setTone(t)}
                      style={{
                        padding: "8px 12px",
                        borderRadius: 20,
                        border: active ? "1px
