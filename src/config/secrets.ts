// AQUÍ GUARDAMOS LOS SECRETOS DE FORMA CENTRALIZADA
// En el futuro, moveremos esto a Variables de Entorno (.env) o Edge Functions

// REEMPLAZA ESTO CON TU PUBLIC API KEY DE REVENUECAT (Project Settings -> API Keys -> Public Key)
export const REVENUECAT_API_KEY = "test_GOyQyspeXcnwtOigxRsrialvYIb"; 

// Si tuviéramos más keys (Supabase, RevenueCat), irían aquí:
// export const SUPABASE_URL = "...";
// Este archivo centraliza tus claves API.
// IMPORTANTE: Nunca subas tus claves reales a un repositorio público de GitHub.

export const SUPABASE_URL = "https://acrqlwtkhcvdnkmdeibi.supabase.co"; // Tu URL de proyecto
export const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."; // Tu clave anónima pública

// RevenueCat Keys (Las obtienes en el Dashboard de RevenueCat -> API Keys)
export const REVENUECAT_APPLE_KEY = "appl_TU_CLAVE_DE_APPLE"; 
export const REVENUECAT_GOOGLE_KEY = "goog_TU_CLAVE_DE_GOOGLE";

// Otras configuraciones
export const APP_NAME = "Aura AI";