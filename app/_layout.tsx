import "./global.css";
import { Stack } from "expo-router";

// Este archivo es el punto de entrada de toda la app.
// Aquí importamos los estilos globales y definimos la navegación base.
export default function Layout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Esto carga las pestañas (tabs) automáticamente */}
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}