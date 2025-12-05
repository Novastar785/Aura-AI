import * as FileSystem from 'expo-file-system/legacy';
import Purchases from 'react-native-purchases';
import { supabase } from '../config/supabase';
import i18n from '../i18n'; // <--- ÚNICA IMPORTACIÓN NUEVA

export const generateAIImage = async (
  imageUri: string, 
  featureKey: string, 
  variant: string | null = null,
  garmentUri: string | null = null
): Promise<string> => {

  // --- ⚡ MODO DEBUG: ACTIVA ESTO PARA PROBAR SIN CRÉDITOS ---
  const DEBUG_MODE = true; // <--- Pon en FALSE cuando vayas a producción

  if (DEBUG_MODE) {
    console.log("🛠️ MODO DEBUG: Simulando generación de IA...");
    
    // 1. Simulamos tiempo de espera (3 segundos)
    await new Promise(resolve => setTimeout(resolve, 3000));

    // 2. Retornamos una imagen de prueba (URL pública para que funcione el slider)
    // Puedes cambiar esta URL por cualquier imagen de ejemplo que quieras ver en el resultado
    return "https://rizzflows.com/img_aura/Image_fx(3).png";
  }
  // ------------------------------------------------------------
  
  try {
    const appUserID = await Purchases.getAppUserID();
    // CAMBIO 1: Traducción del mensaje de error
    if (!appUserID) throw new Error(i18n.t('errors.user_id_missing'));

    const base64 = await FileSystem.readAsStringAsync(imageUri, { encoding: 'base64' });
    
    let garmentBase64 = null;
    if (garmentUri) {
        garmentBase64 = await FileSystem.readAsStringAsync(garmentUri, { encoding: 'base64' });
    }
    
    console.log(`☁️ Solicitando generación para Feature: ${featureKey}, Variante: ${variant || 'base'}`);

    // Llamamos a la Edge Function
    const { data, error } = await supabase.functions.invoke('generate-ai-image', {
        body: { 
            // YA NO ENVIAMOS EL PROMPT DE TEXTO, SOLO LOS IDs
            feature_id: featureKey,
            variant: variant,
            
            imageBase64: base64,
            garmentBase64: garmentBase64,
            user_id: appUserID,
        }
    });

    if (error) {
        if (error instanceof Error && error.message.includes("402")) throw new Error("INSUFFICIENT_CREDITS");
        throw error;
    }

    if (data && data.error) {
        if (data.code === 'INSUFFICIENT_CREDITS' || data.error.includes("Saldo insuficiente")) {
            // Mantenemos este código igual porque la UI lo detecta
            throw new Error("INSUFFICIENT_CREDITS");
        }
        throw new Error(data.error);
    }

    if (!data || !data.image) {
        // CAMBIO 2: Traducción del mensaje de error
        throw new Error(i18n.t('errors.no_image_returned'));
    }

    return data.image;

  } catch (error: any) {
    console.error("❌ Error servicio Gemini:", error);
    throw error;
  }
};