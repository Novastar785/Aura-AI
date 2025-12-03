import * as FileSystem from 'expo-file-system/legacy';
import Purchases from 'react-native-purchases';
import { supabase } from '../config/supabase';

export const MODELS = {
  ARTIST_PRO: "gemini-3-pro-image-preview", 
};

export const generateAIImage = async (
  imageUri: string, 
  featureKey: string, // Ej: 'stylist'
  variant: string | null = null, // Ej: 'rock'
  garmentUri: string | null = null
): Promise<string> => {
  
  const modelId = MODELS.ARTIST_PRO;
  
  try {
    const appUserID = await Purchases.getAppUserID();
    if (!appUserID) throw new Error("ID de usuario no encontrado.");

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
            modelName: modelId,
            user_id: appUserID,
        }
    });

    if (error) {
        if (error instanceof Error && error.message.includes("402")) throw new Error("INSUFFICIENT_CREDITS");
        throw error;
    }

    if (data && data.error) {
        if (data.code === 'INSUFFICIENT_CREDITS' || data.error.includes("Saldo insuficiente")) {
            throw new Error("INSUFFICIENT_CREDITS");
        }
        throw new Error(data.error);
    }

    if (!data || !data.image) {
        throw new Error("La nube no devolvió imagen.");
    }

    return data.image;

  } catch (error: any) {
    console.error("❌ Error servicio Gemini:", error);
    throw error;
  }
};