// Importamos las herramientas necesarias
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { GoogleGenerativeAI } from "npm:@google/generative-ai";

// Configuración de seguridad para permitir que tu app se conecte
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // 1. Manejo de permisos (CORS)
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // 2. BUSCAMOS TU LLAVE SECRETA "AURA"
    // Aquí es donde ocurre la magia de seguridad
    const apiKey = Deno.env.get("GEMINI_API_KEY_AURA");
    
    if (!apiKey) {
      throw new Error("ERROR CRÍTICO: No encontré la llave GEMINI_API_KEY_AURA en los secretos de Supabase.");
    }

    // 3. Recibimos los datos que envía tu celular
    // UPDATE: Agregamos 'garmentBase64' para el Virtual Try On (opcional)
    const { prompt, imageBase64, garmentBase64, modelName } = await req.json();

    if (!prompt || !imageBase64) {
      throw new Error("Faltan datos: No llegó el prompt o la imagen principal.");
    }

    // 4. Conectamos con Google (Lado Servidor)
    // Usamos el modelo que pide la app o el default
    const modelId = modelName || "gemini-3-pro-image-preview";
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: modelId });

    // 5. Preparamos el contenido para la IA (Soporte Multimodal)
    // Construimos un array dinámico de partes
    const contentParts = [
      prompt,
      { inlineData: { data: imageBase64, mimeType: "image/jpeg" } } // Imagen 1: Usuario (Base)
    ];

    // Si nos enviaron una prenda (Virtual Try On), la agregamos como segunda imagen
    if (garmentBase64) {
      console.log("👗 Modo Virtual Try On detectado: Agregando imagen de prenda...");
      contentParts.push({ 
        inlineData: { data: garmentBase64, mimeType: "image/jpeg" } 
      });
    }

    // 6. Generamos la imagen
    const result = await model.generateContent(contentParts);

    const response = result.response;
    const candidates = response.candidates;

    if (!candidates || candidates.length === 0) {
        throw new Error("Gemini no devolvió ninguna imagen.");
    }

    // 7. Preparamos la imagen para devolverla al celular
    const imagePart = candidates[0].content.parts.find(
      (part) => part.inlineData && part.inlineData.mimeType.startsWith('image/')
    );

    let finalData = null;
    if (imagePart && imagePart.inlineData) {
      finalData = `data:${imagePart.inlineData.mimeType};base64,${imagePart.inlineData.data}`;
    }

    // 8. Enviamos la respuesta final
    return new Response(JSON.stringify({ image: finalData }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    // Si algo falla, avisamos al celular
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});