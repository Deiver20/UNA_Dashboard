import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "OPENAI_API_KEY no está configurada. Añade tu API key en el archivo .env.local" },
        { status: 503 }
      );
    }

    const openai = new OpenAI({ apiKey });

    const body = await req.json();
    const { section, dataSnapshot, year } = body;

    if (!Array.isArray(dataSnapshot)) {
      return NextResponse.json(
        { error: "dataSnapshot debe ser un array" },
        { status: 400 }
      );
    }

    const prompt = `Eres un analista de datos senior especializado en el sector avícola mexicano.
Analiza los siguientes datos agregados de la sección "${section}" para el año ${year}.

Datos (JSON):
${JSON.stringify(dataSnapshot.slice(0, 200), null, 2)}

Genera entre 4 y 7 insights relevantes en español. Enfócate en: tendencias, anomalías, cambios relevantes, crecimiento/disminución, comportamientos atípicos y comparaciones importantes.

Responde ÚNICAMENTE con un array JSON de objetos. Cada objeto debe tener esta estructura exacta:
{
  "id": "string-unico",
  "title": "Título corto del insight",
  "description": "Descripción detallada del hallazgo",
  "timestamp": "${year}",
  "badge": "success" | "warning" | "info" | "danger"
}

No incluyas texto adicional fuera del array JSON. Asegúrate de que sea JSON válido.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "Eres un analista experto en datos avícolas. Responde únicamente con JSON válido.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.5,
      max_tokens: 1500,
    });

    const raw = completion.choices[0]?.message?.content?.trim() ?? "[]";

    // Extraer JSON si la IA lo envuelve en markdown \`\`\`json ... \`\`\`
    const jsonMatch = raw.match(/\[[\s\S]*\]/);
    const jsonString = jsonMatch ? jsonMatch[0] : raw;

    let insights;
    try {
      insights = JSON.parse(jsonString);
    } catch {
      throw new Error(`La IA no devolvió un JSON válido. Respuesta raw: ${raw}`);
    }

    if (!Array.isArray(insights)) {
      throw new Error(`La respuesta de la IA no es un array. Respuesta: ${jsonString}`);
    }

    return NextResponse.json({ insights });
  } catch (err) {
    console.error("Error en /api/insights:", err);
    const message = err instanceof Error ? err.message : "Error interno";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
