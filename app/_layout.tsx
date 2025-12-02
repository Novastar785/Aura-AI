import { Stack } from "expo-router";
import "./global.css";
// Importamos la configuración de i18n para que se ejecute al inicio
import "../src/i18n";

// --- NUEVOS IMPORTS ---
import * as NavigationBar from 'expo-navigation-bar';
import { setStatusBarHidden } from 'expo-status-bar';
import { useEffect } from "react";
import { Platform } from "react-native";

// --- REVENUECAT IMPORTS ---
import Purchases from 'react-native-purchases';
import { REVENUECAT_API_KEY } from '../src/config/secrets';

// Este archivo es el punto de entrada de toda la app.
// Aquí importamos los estilos globales y definimos la navegación base.
export default function Layout() {

  // --- LÓGICA AGREGADA ---
  useEffect(() => {
    // 1. Configuración de UI Sistema (Android)
    if (Platform.OS === 'android') {
      setStatusBarHidden(true, 'fade');
      NavigationBar.setVisibilityAsync("hidden");
      NavigationBar.setBehaviorAsync("overlay-swipe");
      NavigationBar.setBackgroundColorAsync("transparent");
    }

    // 2. Inicialización de RevenueCat
    const initRevenueCat = async () => {
      try {
        if (Platform.OS === 'android') {
           // Asegúrate de que REVENUECAT_API_KEY tenga tu llave real en secrets.ts
           await Purchases.configure({ apiKey: REVENUECAT_API_KEY });
        }
        // Si tienes iOS, agregarías un `else if (Platform.OS === 'ios')` con su llave correspondiente
        
        // (Opcional) Logs para depurar mientras desarrollas
        await Purchases.setLogLevel(Purchases.LOG_LEVEL.DEBUG);
      } catch (e) {
        console.error("Error inicializando RevenueCat", e);
      }
    };

    initRevenueCat();

  }, []);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Esto carga las pestañas (tabs) automáticamente */}
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}