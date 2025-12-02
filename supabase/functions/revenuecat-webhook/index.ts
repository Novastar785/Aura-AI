import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// --- CONFIGURACIÓN DE TUS PLANES ---
// Asegúrate de que estos IDs coincidan con los de RevenueCat
const CREDIT_MAP = {
  // Suscripciones (Use it or lose it)
  "aura_weekly_premium": 150,
  "aura_monthly_premium": 700,
  
  // Packs (Se suman)
  "aura_pack_50": 50,
  "aura_pack_100": 100
};

serve(async (req) => {
  try {
    // 1. Verificar seguridad (Token simple en la URL o Header)
    // Para simplificar, asumiremos que configuras el Webhook en RC con un secreto en la URL
    // Ej: https://tu-proyecto.functions.supabase.co/revenuecat-webhook?secret=MI_SECRETO_SEGURO
    
    const url = new URL(req.url);
    const secret = url.searchParams.get("secret");
    if (secret !== "MI_SECRETO_AURA_123") { // Cambia esto por algo difícil
      return new Response("Unauthorized", { status: 401 });
    }

    // 2. Inicializar Supabase Admin (para poder escribir en la DB)
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const body = await req.json();
    const event = body.event;
    
    if (!event) return new Response("No event data", { status: 400 });

    const type = event.type;
    const appUserId = event.app_user_id;
    const productId = event.product_id;
    
    console.log(`🔔 Evento recibido: ${type} para ${appUserId} (${productId})`);

    // 3. Lógica de Negocio según el Evento
    
    // CASO A: COMPRA INICIAL O RENOVACIÓN DE SUSCRIPCIÓN
    if (type === "INITIAL_PURCHASE" || type === "RENEWAL" || type === "PRODUCT_CHANGE") {
      
      const creditsToGive = CREDIT_MAP[productId];
      
      // Si es una suscripción conocida
      if (creditsToGive && (productId.includes("weekly") || productId.includes("monthly"))) {
        console.log(`💎 Reseteando créditos de suscripción a: ${creditsToGive}`);
        
        // UPSERT: Si no existe el usuario lo crea, si existe lo actualiza
        const { error } = await supabaseAdmin
          .from("user_credits")
          .upsert({ 
            user_id: appUserId, 
            subscription_credits: creditsToGive, // SOBRESCRIBE (Use it or lose it)
            updated_at: new Date()
          });
          
        if (error) throw error;
      }
      // Si es una compra de Pack (a veces llega como Initial Purchase si es consumible)
      else if (creditsToGive && productId.includes("pack")) {
         await addPackCredits(supabaseAdmin, appUserId, creditsToGive);
      }
    }

    // CASO B: COMPRA DE PACKS (Consumibles - Non Renewing)
    if (type === "NON_RENEWING_PURCHASE") {
      const creditsToGive = CREDIT_MAP[productId];
      if (creditsToGive) {
        await addPackCredits(supabaseAdmin, appUserId, creditsToGive);
      }
    }

    // CASO C: EXPIRACIÓN (Opcional: Poner saldo en 0 inmediatamente)
    if (type === "EXPIRATION") {
       // Opcional: Podrías forzar subscription_credits a 0 aquí si quieres ser estricto
       // await supabaseAdmin.from("user_credits").update({ subscription_credits: 0 }).eq("user_id", appUserId);
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("❌ Error processing webhook:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
});

// Helper para sumar packs (ya que estos NO se sobrescriben, se suman)
async function addPackCredits(supabase, userId, amount) {
  console.log(`➕ Sumando ${amount} créditos de pack`);
  
  // Primero obtenemos el usuario actual para ver si existe
  const { data: current } = await supabase.from("user_credits").select("pack_credits").eq("user_id", userId).single();
  
  const currentPack = current ? current.pack_credits : 0;
  const newTotal = currentPack + amount;

  const { error } = await supabase
    .from("user_credits")
    .upsert({
      user_id: userId,
      pack_credits: newTotal,
      updated_at: new Date()
    }, { onConflict: 'user_id' }); // En upsert, esto combina con los datos existentes si no especificamos columnas, pero aquí queremos asegurar la suma.
    
    // Nota: El upsert simple arriba podría borrar sub_credits si no tenemos cuidado.
    // Forma más segura para packs: RPC o Update específico si existe.
    // Para simplificar este script, haremos un update directo si existe, o insert si no.
    
    if (current) {
        await supabase.from("user_credits").update({ pack_credits: newTotal }).eq("user_id", userId);
    } else {
        await supabase.from("user_credits").insert({ user_id: userId, pack_credits: newTotal, subscription_credits: 0 });
    }
}