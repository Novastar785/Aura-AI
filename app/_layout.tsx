import { Stack } from "expo-router";
import "./global.css";
// Importamos la configuración de i18n para que se ejecute al inicio
import "../src/i18n";

// --- NUEVOS IMPORTS ---
import * as NavigationBar from 'expo-navigation-bar';
import { setStatusBarHidden } from 'expo-status-bar';
import { useEffect } from "react";
import { Platform } from "react-native";

// Este archivo es el punto de entrada de toda la app.
// Aquí importamos los estilos globales y definimos la navegación base.
export default function Layout() {

  // --- LÓGICA AGREGADA ---
  useEffect(() => {
    if (Platform.OS === 'android') {
      // 1. Ocultar la barra de estado superior
      setStatusBarHidden(true, 'fade');

      // 2. Ocultar la barra de navegación inferior
      NavigationBar.setVisibilityAsync("hidden");

      // 3. Configurar comportamiento al deslizar (aparece y se vuelve a ir)
      NavigationBar.setBehaviorAsync("overlay-swipe");
      
      // (Opcional) Fondo transparente para que no corte el diseño si aparece
      NavigationBar.setBackgroundColorAsync("transparent");
    }
  }, []);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Esto carga las pestañas (tabs) automáticamente */}
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}