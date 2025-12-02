import { Stack } from "expo-router";
import "../src/i18n";
import "./global.css";

import * as NavigationBar from 'expo-navigation-bar';
import * as SystemUI from 'expo-system-ui';
import { useEffect } from "react";
import { Platform } from "react-native";

// 1. Importamos las herramientas de tema de React Navigation
import { DarkTheme, Theme, ThemeProvider } from '@react-navigation/native';

// --- REVENUECAT IMPORTS ---
import Purchases from 'react-native-purchases';
import { REVENUECAT_API_KEY } from '../src/config/secrets';

// 2. Definimos el tema "Aura" (Forzamos el fondo negro en el motor de navegación)
const AuraTheme: Theme = {
  ...DarkTheme, // Heredamos del tema oscuro base
  colors: {
    ...DarkTheme.colors,
    background: '#0f0f0f', // <--- ESTO ELIMINA EL FLICKER REAL (Fondo del Navigator)
    card: '#0f0f0f',       // Fondo de las barras de navegación
    text: '#ffffff',
    border: '#27272a',     // Color zinc-800 para bordes
  },
};

export default function Layout() {

  useEffect(() => {
    // Configuración nativa para Android (Barras de sistema)
    if (Platform.OS === 'android') {
      SystemUI.setBackgroundColorAsync("#0f0f0f"); // Fondo de la ventana nativa
      NavigationBar.setVisibilityAsync("hidden");
      NavigationBar.setBehaviorAsync("overlay-swipe");
      NavigationBar.setBackgroundColorAsync("transparent");
    }

    // Inicialización de RevenueCat
    const initRevenueCat = async () => {
      try {
        if (Platform.OS === 'android') {
           await Purchases.configure({ apiKey: REVENUECAT_API_KEY });
        }
        // await Purchases.setLogLevel(Purchases.LOG_LEVEL.DEBUG);
      } catch (e) {
        console.error("Error inicializando RevenueCat", e);
      }
    };

    initRevenueCat();
  }, []);

  return (
    // 3. Envolvemos la app en el ThemeProvider con nuestro tema forzado
    <ThemeProvider value={AuraTheme}>
      <Stack 
        screenOptions={{ 
          headerShown: false,
          // 4. Aseguramos que cada pantalla tenga el fondo correcto por defecto
          contentStyle: { backgroundColor: '#0f0f0f' },
          // Opcional: Si en Android la animación sigue siendo brusca, puedes cambiarla:
          animation: 'slide_from_right' 
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </ThemeProvider>
  );
}