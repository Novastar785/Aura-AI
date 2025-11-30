import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import {
  ChevronRight,
  CreditCard,
  FileText,
  HelpCircle,
  Infinity as InfinityIcon,
  Lock,
  LogOut,
  Rocket,
  Settings,
  User
} from 'lucide-react-native';
import React from 'react';
import { Alert, Image, ScrollView, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// ✅ HABILITADO: Importamos la UI de RevenueCat
import RevenueCatUI from 'react-native-purchases-ui';

export default function ProfileScreen() {
  const router = useRouter();

  // --- DATOS MOCK ---
  const user = {
    name: 'Usuario Demo',
    email: 'usuario@aura.ai',
    credits: 120,
    plan: 'PRO', 
    isSubscribed: true,
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&q=80',
  };

  // --- FUNCIONES DE REVENUECAT ---
  const openCustomerCenter = async () => {
    try {
      // Abre el centro de gestión de suscripciones nativo
      await RevenueCatUI.presentCustomerCenter();
    } catch (e) {
      // Fallback por si falla o no está soportado en la plataforma
      Alert.alert("Info", "Puedes gestionar tu suscripción en los Ajustes de tu dispositivo.");
    }
  };

  const openUpgradePaywall = async () => {
    try {
        // ✅ MUESTRA TU PAYWALL DE REVENUECAT
        // Esto cargará el "Default Paywall" que diseñaste en el dashboard de RevenueCat
        await RevenueCatUI.presentPaywall({ 
            displayCloseButton: true 
        });
    } catch (e) {
        console.log("Paywall cerrado o falló la carga", e);
    }
  };

  // --- MENÚS ---
  const subscriptionItems = [
    { 
      icon: CreditCard, 
      label: 'Gestionar Suscripción', 
      action: openCustomerCenter,
      subtitle: 'Ver facturación y planes'
    },
    { 
      icon: Rocket, 
      label: 'Mejorar Plan (Upgrade)', 
      action: openUpgradePaywall,
      color: '#818cf8', // Indigo para destacar
      subtitle: 'Desbloquea funciones PRO'
    },
  ];

  const accountItems = [
    { icon: User, label: 'Editar Perfil', action: () => Alert.alert('Editar', 'Próximamente') },
    { icon: Settings, label: 'Configuración', action: () => {} },
  ];

  const legalItems = [
    { icon: Lock, label: 'Política de Privacidad', action: () => router.push('/privacy' as any) },
    { icon: FileText, label: 'Términos de Servicio', action: () => router.push('/terms' as any) },
    { icon: HelpCircle, label: 'Ayuda y Soporte', action: () => {} },
  ];

  return (
    <View className="flex-1 bg-[#0f0f0f]">
      <StatusBar barStyle="light-content" />
      
      <LinearGradient
        colors={['rgba(129, 140, 248, 0.1)', 'transparent']}
        className="absolute w-full h-[400px]"
      />

      <SafeAreaView className="flex-1">
        <ScrollView contentContainerStyle={{ paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
          
          {/* HEADER DEL PERFIL */}
          <View className="items-center mt-6 mb-8 px-6">
            <View className="relative mb-4">
              <View className="w-28 h-28 rounded-full border-4 border-zinc-800 overflow-hidden shadow-xl">
                <Image source={{ uri: user.avatar }} className="w-full h-full" resizeMode="cover" />
              </View>
              
              {user.isSubscribed && (
                <View className="absolute -bottom-2 self-center bg-emerald-500 px-3 py-1 rounded-full border-4 border-[#0f0f0f] flex-row items-center shadow-sm">
                  <InfinityIcon size={12} color="white" strokeWidth={3} className="mr-1" />
                  <Text className="text-white text-[10px] font-bold uppercase tracking-wider">Activo</Text>
                </View>
              )}
            </View>
            
            <Text className="text-white text-2xl font-bold mb-1">{user.name}</Text>
            <Text className="text-zinc-500 text-sm">{user.email}</Text>
          </View>

          {/* ESTADÍSTICAS RÁPIDAS */}
          <View className="flex-row mx-6 mb-8 bg-zinc-900 rounded-3xl p-4 border border-zinc-800/50">
            <View className="flex-1 items-center border-r border-zinc-800">
              <Text className="text-2xl font-bold text-white">{user.credits}</Text>
              <Text className="text-zinc-500 text-xs uppercase tracking-wide mt-1">Créditos</Text>
            </View>
            <View className="flex-1 items-center">
              <Text className="text-2xl font-bold text-white">12</Text>
              <Text className="text-zinc-500 text-xs uppercase tracking-wide mt-1">Generadas</Text>
            </View>
          </View>

          {/* SECCIÓN SUSCRIPCIÓN */}
          <View className="px-6 mb-6">
            <Text className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-3 ml-2">Membresía</Text>
            <View className="bg-zinc-900 rounded-3xl overflow-hidden border border-zinc-800/50">
              {subscriptionItems.map((item, index) => (
                <MenuRow key={index} item={item} isLast={index === subscriptionItems.length - 1} />
              ))}
            </View>
          </View>

          {/* SECCIÓN CUENTA */}
          <View className="px-6 mb-6">
            <Text className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-3 ml-2">Cuenta</Text>
            <View className="bg-zinc-900 rounded-3xl overflow-hidden border border-zinc-800/50">
              {accountItems.map((item, index) => (
                <MenuRow key={index} item={item} isLast={index === accountItems.length - 1} />
              ))}
            </View>
          </View>

          {/* SECCIÓN LEGAL */}
          <View className="px-6 mb-8">
            <Text className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-3 ml-2">Legal</Text>
            <View className="bg-zinc-900 rounded-3xl overflow-hidden border border-zinc-800/50">
              {legalItems.map((item, index) => (
                <MenuRow key={index} item={item} isLast={index === legalItems.length - 1} />
              ))}
            </View>
          </View>

          {/* BOTÓN CERRAR SESIÓN */}
          <View className="px-6">
            <TouchableOpacity 
              className="flex-row items-center justify-center p-4 rounded-2xl border border-red-500/30 bg-red-500/10 active:bg-red-500/20"
              onPress={() => Alert.alert("Cerrar Sesión", "¿Estás seguro?", [{text: "Cancelar"}, {text: "Salir", style: "destructive"}])}
            >
              <LogOut size={20} color="#ef4444" className="mr-2" />
              <Text className="text-red-500 font-bold">Cerrar Sesión</Text>
            </TouchableOpacity>
            
            <Text className="text-zinc-700 text-xs text-center mt-6">
              Aura AI v1.0.0
            </Text>
          </View>

        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

// Componente auxiliar para filas de menú
function MenuRow({ item, isLast }: { item: any, isLast: boolean }) {
  return (
    <TouchableOpacity 
      onPress={item.action}
      className={`flex-row items-center justify-between p-5 active:bg-zinc-800/50 ${!isLast ? 'border-b border-zinc-800' : ''}`}
    >
      <View className="flex-row items-center gap-4 flex-1">
        <View className="w-10 h-10 rounded-full bg-zinc-800 items-center justify-center">
          <item.icon size={20} color={item.color || "#a1a1aa"} />
        </View>
        <View>
            <Text className={`font-medium text-base ${item.color ? 'text-indigo-400 font-bold' : 'text-zinc-200'}`}>
                {item.label}
            </Text>
            {item.subtitle && (
                <Text className="text-zinc-500 text-xs">{item.subtitle}</Text>
            )}
        </View>
      </View>
      <ChevronRight size={20} color="#52525b" />
    </TouchableOpacity>
  );
}