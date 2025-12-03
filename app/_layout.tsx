import { Stack } from "expo-router";
import "../src/i18n";
import "./global.css";

import * as NavigationBar from 'expo-navigation-bar';
import * as SplashScreen from 'expo-splash-screen';
import * as SystemUI from 'expo-system-ui';
import LottieView from 'lottie-react-native';
import { useEffect, useRef, useState } from "react";
import { Platform, StyleSheet, View } from "react-native";

// 1. Importamos las herramientas de tema de React Navigation
import { DarkTheme, Theme, ThemeProvider } from '@react-navigation/native';

// --- REVENUECAT IMPORTS ---
import Purchases from 'react-native-purchases';
import { REVENUECAT_API_KEY } from '../src/config/secrets';

// Mantiene el splash nativo visible hasta que le digamos lo contrario
SplashScreen.preventAutoHideAsync();

// 2. Definimos el tema "Aura"
const AuraTheme: Theme = {
  ...DarkTheme, 
  colors: {
    ...DarkTheme.colors,
    background: '#0f0f0f', 
    card: '#0f0f0f',       
    text: '#ffffff',
    border: '#27272a',     
  },
};

export default function Layout() {
  const [appIsReady, setAppIsReady] = useState(false);
  const [animationFinished, setAnimationFinished] = useState(false);
  const animationRef = useRef<LottieView>(null);

  useEffect(() => {
    async function prepare() {
      try {
        if (Platform.OS === 'android') {
          await SystemUI.setBackgroundColorAsync("#0f0f0f");
          await NavigationBar.setVisibilityAsync("hidden");
          await NavigationBar.setBehaviorAsync("overlay-swipe");
          await NavigationBar.setBackgroundColorAsync("transparent");
        }

        const initRevenueCat = async () => {
          try {
            if (Platform.OS === 'android') {
               await Purchases.configure({ apiKey: REVENUECAT_API_KEY });
            }
          } catch (e) {
            console.error("Error inicializando RevenueCat", e);
          }
        };

        await initRevenueCat();
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  // Ocultar splash nativo y reproducir Lottie cuando la app esté lista
  useEffect(() => {
    if (appIsReady) {
      SplashScreen.hideAsync();
      
      // Pequeño delay en Android para suavidad (igual que en tu ejemplo)
      if (Platform.OS === 'android') {
        setTimeout(() => {
          animationRef.current?.play();
        }, 50);
      } else {
        animationRef.current?.play();
      }
    }
  }, [appIsReady]);

  if (!appIsReady || !animationFinished) {
    return (
      <View style={[styles.container, { backgroundColor: '#000000' }]}>
        <LottieView
          ref={animationRef}
          source={require('../assets/animations/splash-animation.json')}
          autoPlay={false} // Controlamos el play manualmente
          loop={false}
          resizeMode="cover"
          onAnimationFinish={() => setAnimationFinished(true)}
          style={styles.lottie} // <--- AQUI ESTABA LA DIFERENCIA
        />
      </View>
    );
  }

  return (
    <ThemeProvider value={AuraTheme}>
      <Stack 
        screenOptions={{ 
          headerShown: false,
          contentStyle: { backgroundColor: '#0f0f0f' },
          animation: 'slide_from_right' 
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lottie: {
    // CORRECCIÓN: Tamaño fijo en lugar de porcentajes
    width: 250, 
    height: 250,
  },
});