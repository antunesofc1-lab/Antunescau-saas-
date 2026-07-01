import { NextResponse } from "next/server";

function platformPrompt(platform) {
  switch (platform) {
    case "instagram":
      return "um post para Instagram com legenda envolvente, emojis com moderação e 5 hashtags relevantes ao final";
    case "tiktok":
      return "um roteiro curto de vídeo para TikTok (gancho nos 3 primeiros segundos, 3 a 5 falas/cenas numeradas, linguagem bem informal) mais uma legenda curta com 3 a 5 hashtags";
    case "linkedin":
      return "um post para LinkedIn com tom mais profissional, sem hashtags em excesso (máximo 3) e um gancho forte na primeira linha";
    case "twitter":
      return "um post curto para X/Twitter, direto, com no máximo 280 caracteres";
    case "email":
      return "um e-mail de marketing com assunto (subject line) chamativo e um corpo curto e persuasivo, terminando com uma chamada para ação clara";
    default:
      return "um post de marketing";
  }
}

export async function POST(request) {
  try {
    const { topic, platform, tone } = await request.json();

    if (!topic || !topic.trim()) {
      return NextResponse.json({ error: "Tema obrigatório" }, { status: 400 });
    }

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "GROQ_API_KEY não configurada no servidor" },
        { status: 500 }
      );
    }

    const prompt = `Você é um redator publicitário sênior especializado em marketing digital.
Crie 3 variações de ${platformPrompt(platform)} sobre o seguinte produto/tema: "${topic}".
Tom de voz: ${tone}.
Responda APENAS em formato JSON puro, sem markdown, sem crases, seguindo exatamente este formato:
{"variations": [{"headline": "string curta de até 6 palavras resumindo a variação", "content": "o texto completo do post ou e-mail"}]}
O array "variations" deve ter exatamente 3 itens.`;

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      return NextResponse.json({ error: `Erro da API: ${errText}` }, { status: 500 });
    }

    const data = await response.json();
    const text = data.choices[0].message.content;
    const clean = text.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(clean);

    return NextResponse.json({ variations: parsed.variations || [] });
  } catch (e) {
    return NextResponse.json({ error: "Falha ao gerar conteúdo" }, { status: 500 });
  }
}
