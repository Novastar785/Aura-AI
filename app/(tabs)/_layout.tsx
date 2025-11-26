import { Tabs } from 'expo-router';
import React from 'react';
import { View } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false, // Oculta la barra de arriba (Título)
        tabBarStyle: { display: 'none' }, // Oculta la barra de abajo (Tabs nativos)
      }}>
      <Tabs.Screen
        name="index"
        options={{
          href: null, // Evita que aparezca en menus
        }}
      />
    </Tabs>
  );
}