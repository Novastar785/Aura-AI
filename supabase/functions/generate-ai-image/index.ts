// Importamos las herramientas necesarias
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { GoogleGenerativeAI } from "npm:@google/generative-ai";

// Configuración de seguridad para permitir que tu app se conecte
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// --- MAPA DE COSTOS (Categorías Principales) ---
const FEATURE_COSTS: Record<string, number> = {
  tryon: 3,
  
  // Mantenemos AMBOS para seguridad (evitar cobros erróneos por typos)
  stylist: 2, // Para IDs como "stylist_rock", "stylist_urban" (Visto en gemini.ts)
  stylish: 2, // Para IDs como "stylish_rock" (Tu preferencia)
  
  hairstudio: 2,
  fitness: 3,
  glowup: 2,
  luxury: 2,
  socials: 2,
  globetrotter: 2,
  headshot: 3
};

serve(async (req) => {
  // 1. Manejo de permisos (CORS)
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Inicializar cliente Supabase para verificar créditos
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // 2. BUSCAMOS TU LLAVE SECRETA "AURA"
    const apiKey = Deno.env.get("GEMINI_API_KEY_AURA");
    
    if (!apiKey) {
      throw new Error("ERROR CRÍTICO: No encontré la llave GEMINI_API_KEY_AURA en los secretos de Supabase.");
    }

    // 3. Recibimos los datos que envía tu celular
    const { prompt, imageBase64, garmentBase64, modelName, user_id, feature_id } = await req.json();

    if (!prompt || !imageBase64) {
      throw new Error("Faltan datos: No llegó el prompt o la imagen principal.");
    }

    // --- INICIO BLOQUE DE CRÉDITOS INTELIGENTE ---
    if (!user_id) {
        throw new Error("Usuario no identificado (Falta user_id para procesar créditos)");
    }

    // LÓGICA DE COBRO DINÁMICA
    // Paso A: Definir costo por defecto alto por seguridad
    let cost = 3; 

    // Paso B: Normalizar el feature_id (minusculas y sin espacios extra)
    const normalizedId = (feature_id || "").toLowerCase().trim();

    // Paso C: Buscar precio
    if (normalizedId in FEATURE_COSTS) {
      // 1. Búsqueda exacta (Ej: "tryon")
      cost = FEATURE_COSTS[normalizedId];
    } else {
      // 2. Búsqueda por Categoría (Ej: "stylish_rock" -> busca "stylish")
      const category = normalizedId.split('_')[0]; // Toma la primera parte antes del guion bajo
      if (category in FEATURE_COSTS) {
        cost = FEATURE_COSTS[category];
        console.log(`ℹ️ Variante detectada: "${normalizedId}" cobrará precio base de "${category}" (${cost} créditos)`);
      } else {
        console.log(`⚠️ Feature "${normalizedId}" no encontrado en lista. Cobrando default: ${cost}`);
      }
    }

    console.log(`💰 Intentando cobrar ${cost} créditos al usuario ${user_id} por ${normalizedId}...`);
    
    // Llamar a la función de base de datos segura
    const { data: transaction, error: txError } = await supabase.rpc('deduct_credits', {
      p_user_id: user_id,
      p_cost: cost
    });

    if (txError) {
        console.error("Error en DB:", txError);
        throw new Error(`Error verificando saldo: ${txError.message}`);
    }
    
    // Verificar si el cobro fue exitoso
    if (!transaction || !transaction.success) {
      return new Response(JSON.stringify({ error: "Saldo insuficiente", code: "INSUFFICIENT_CREDITS" }), {
        status: 402, 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    console.log("✅ Cobro exitoso. Procediendo con Gemini...");
    // --- FIN BLOQUE DE CRÉDITOS ---


    // 4. Conectamos con Google (Lado Servidor)
    const modelId = modelName || "gemini-3-pro-image-preview";
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: modelId });

    // 5. Preparamos el contenido para la IA
    const contentParts = [
      prompt,
      { inlineData: { data: imageBase64, mimeType: "image/jpeg" } } 
    ];

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

    const imagePart = candidates[0].content.parts.find(
      (part) => part.inlineData && part.inlineData.mimeType.startsWith('image/')
    );

    let finalData = null;
    if (imagePart && imagePart.inlineData) {
      finalData = `data:${imagePart.inlineData.mimeType};base64,${imagePart.inlineData.data}`;
    }

    return new Response(JSON.stringify({ image: finalData }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error: any) {
    console.error("❌ Error en función:", error);
    return new Response(JSON.stringify({ error: error.message || "Error desconocido" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});