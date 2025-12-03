import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect, useRouter } from 'expo-router';
import {
  ChevronRight,
  CreditCard,
  FileText,
  HelpCircle,
  Infinity as InfinityIcon,
  Lock,
  RefreshCcw,
  Rocket,
  User
} from 'lucide-react-native';
import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, Linking, ScrollView, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import Purchases from 'react-native-purchases';
import RevenueCatUI from 'react-native-purchases-ui';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '../../src/config/supabase'; // ✅ IMPORTANTE: Importamos Supabase directamente
import { restorePurchases } from '../../src/services/revenueCat';

export default function ProfileScreen() {
  const router = useRouter();
  const { t } = useTranslation();

  // --- ESTADO REAL ---
  const [credits, setCredits] = useState({ sub: 0, pack: 0, total: 0 });
  const [userId, setUserId] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  // --- CARGA DE DATOS ---
  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const loadData = async () => {
    try {
      // 1. Obtener Info del Cliente de RevenueCat (FUENTE DE LA VERDAD)
      const customerInfo = await Purchases.getCustomerInfo();
      const appUserID = await Purchases.getAppUserID(); 
      
      console.log("🔍 Profile - RevenueCat ID:", appUserID); // Debug para ver el ID
      setUserId(appUserID);

      // 2. Verificar Suscripción
      if (customerInfo.entitlements.active['pro']) {
          setIsSubscribed(true);
      } else {
          setIsSubscribed(false);
      }

      // 3. Obtener Créditos de Supabase USANDO EL ID DE REVENUECAT
      // ⚠️ Reemplazamos getUserCredits() por una consulta directa y segura
      const { data, error } = await supabase
        .from('profiles')
        .select('credits') // Asegúrate de que tu columna se llama 'credits'
        .eq('id', appUserID) // 🔥 CLAVE: Usamos el ID de RevenueCat, no el de Auth
        .single();

      if (data) {
        // Asumimos que 'credits' es el total. Si tienes lógica de packs vs subs, ajusta aquí.
        // Por defecto, asignamos todo al 'pack' o 'standard' para que se vea en el UI.
        setCredits({ 
            sub: 0, // Si tienes una columna 'credits_sub', úsala aquí
            pack: data.credits || 0, 
            total: data.credits || 0 
        });
      } else {
        console.log("⚠️ No se encontró perfil para este ID (Usuario nuevo o error)", error);
        setCredits({ sub: 0, pack: 0, total: 0 });
      }

    } catch (e) {
      console.log("Error cargando perfil", e);
    }
  };

  // --- FUNCIONES DE REVENUECAT ---
  const handleRestore = async () => {
    try {
        await restorePurchases();
        await loadData();
        Alert.alert("Éxito", "Compras restauradas y saldo sincronizado.");
    } catch (e) {
        // El error ya se maneja en el servicio
    }
  };

  const openCustomerCenter = async () => {
    try {
      await RevenueCatUI.presentCustomerCenter();
    } catch (e) {
      Alert.alert("Info", t('profile.manage_sub_desc'));
    }
  };

  const openUpgradePaywall = async () => {
    try {
        await RevenueCatUI.presentPaywall({ 
            displayCloseButton: true 
        });
    } catch (e) {
        console.log("Paywall cerrado", e);
    }
  };

  // --- FUNCIÓN DE SOPORTE ---
  const handleSupport = async () => {
    const email = 'info@rizzflows.com';
    const subject = t('profile.subject');
    const url = `mailto:${email}?subject=${subject}`;

    const canOpen = await Linking.canOpenURL(url);
    if (canOpen) {
      await Linking.openURL(url);
    } else {
      Alert.alert("Error", t('profile.error_mail'));
    }
  };

  // --- MENÚS ---
  const subscriptionItems = [
    { 
      icon: CreditCard, 
      label: t('profile.manage_sub'), 
      action: openCustomerCenter,
      subtitle: t('profile.manage_sub_desc'),
      iconColor: '#3b82f6', 
      bgIcon: 'bg-blue-500/10'
    },
    { 
      icon: Rocket, 
      label: t('profile.upgrade'), 
      action: openUpgradePaywall,
      subtitle: t('profile.upgrade_desc'),
      iconColor: '#8b5cf6', 
      bgIcon: 'bg-violet-500/10'
    },
    { 
      icon: RefreshCcw, 
      label: "Restaurar Compras", 
      action: handleRestore,
      subtitle: "Recuperar saldo y suscripción",
      iconColor: '#14b8a6', 
      bgIcon: 'bg-teal-500/10'
    },
  ];

  const legalItems = [
    { 
      icon: Lock, 
      label: t('profile.privacy'), 
      action: () => router.push('/privacy' as any),
      iconColor: '#10b981', 
      bgIcon: 'bg-emerald-500/10'
    },
    { 
      icon: FileText, 
      label: t('profile.terms'), 
      action: () => router.push('/terms' as any),
      iconColor: '#f59e0b', 
      bgIcon: 'bg-amber-500/10'
    },
    { 
      icon: HelpCircle, 
      label: t('profile.support'), 
      action: handleSupport,
      iconColor: '#ec4899', 
      bgIcon: 'bg-pink-500/10'
    },
  ];

  return (
    <View className="flex-1 bg-[#0f0f0f]">
      <StatusBar barStyle="light-content" />
      
      <LinearGradient
        colors={['#4f46e5', '#1e1b4b', '#0f0f0f']} 
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 0.6 }}
        className="absolute w-full h-[500px] opacity-40"
      />

      <SafeAreaView className="flex-1">
        <ScrollView contentContainerStyle={{ paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
          
          {/* HEADER DEL PERFIL */}
          <View className="items-center mt-10 mb-8 px-6">
            <View className="relative mb-4 shadow-2xl shadow-indigo-500/50">
              <View className="w-28 h-28 rounded-full border-4 border-white/10 bg-white/5 items-center justify-center backdrop-blur-xl">
                <User size={56} color="#e0e7ff" />
              </View>
              
              <View className={`absolute -bottom-3 self-center px-4 py-1.5 rounded-full border border-white/10 flex-row items-center shadow-lg ${isSubscribed ? 'bg-indigo-500' : 'bg-zinc-800'}`}>
                {isSubscribed && <InfinityIcon size={12} color="white" strokeWidth={3} className="mr-1" />}
                <Text className="text-white text-[10px] font-bold uppercase tracking-widest">
                  {isSubscribed ? t('profile.status_premium') : t('profile.status_free')}
                </Text>
              </View>
            </View>
            
            <Text className="text-white text-xl font-bold mt-2 font-mono">
               {userId ? `ID: ${userId.substring(0, 8)}...` : "Cargando..."}
            </Text>
            
            <Text className="text-indigo-200/80 text-sm mt-1 font-medium tracking-widest uppercase">
              {isSubscribed ? t('profile.member_pro') : t('profile.member_free')}
            </Text>
          </View>

          {/* ESTADÍSTICAS RÁPIDAS */}
          <View className="mx-6 mb-8 bg-white/5 rounded-3xl p-4 border border-white/10 backdrop-blur-md">
            
            <View className="items-center mb-3 border-b border-white/5 pb-3">
                 <Text className="text-zinc-400 text-[10px] uppercase tracking-widest mb-1">Total Balance</Text>
                 <Text className="text-4xl font-bold text-white shadow-sm">{credits.total}</Text>
            </View>

            <View className="flex-row">
                <View className="flex-1 items-center border-r border-white/10">
                  <Text className="text-xl font-bold text-white">{credits.sub}</Text>
                  <Text className="text-amber-300 text-[10px] font-bold uppercase tracking-wider mt-1">Premium</Text>
                  <Text className="text-zinc-500 text-[8px] uppercase tracking-widest">credits</Text>
                </View>

                <View className="flex-1 items-center">
                  <Text className="text-xl font-bold text-white">{credits.pack}</Text>
                  <Text className="text-indigo-300 text-[10px] font-bold uppercase tracking-wider mt-1">Standard</Text>
                  <Text className="text-zinc-500 text-[8px] uppercase tracking-widest">credits</Text>
                </View>
            </View>
          </View>

          {/* SECCIÓN SUSCRIPCIÓN */}
          <View className="px-6 mb-6">
            <Text className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-3 ml-2">{t('profile.manage_sub')}</Text>
            <View className="bg-[#18181b] rounded-3xl overflow-hidden border border-white/5">
              {subscriptionItems.map((item, index) => (
                <MenuRow key={index} item={item} isLast={index === subscriptionItems.length - 1} />
              ))}
            </View>
          </View>

          {/* SECCIÓN LEGAL */}
          <View className="px-6 mb-8">
            <Text className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-3 ml-2">{t('profile.legal_help')}</Text>
            <View className="bg-[#18181b] rounded-3xl overflow-hidden border border-white/5">
              {legalItems.map((item, index) => (
                <MenuRow key={index} item={item} isLast={index === legalItems.length - 1} />
              ))}
            </View>
          </View>

          {/* FOOTER */}
          <View className="px-6 pb-10">
            <Text className="text-zinc-600 text-[10px] text-center mt-6 uppercase tracking-widest">
              Aura AI v1.0.0
            </Text>
          </View>

        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

function MenuRow({ item, isLast }: { item: any, isLast: boolean }) {
  return (
    <TouchableOpacity 
      onPress={item.action}
      className={`flex-row items-center justify-between p-4 active:bg-white/5 ${!isLast ? 'border-b border-white/5' : ''}`}
    >
      <View className="flex-row items-center gap-4 flex-1">
        <View className={`w-10 h-10 rounded-full items-center justify-center ${item.bgIcon}`}>
          <item.icon size={20} color={item.iconColor} />
        </View>
        <View>
            <Text className="font-medium text-base text-zinc-100">
                {item.label}
            </Text>
            {item.subtitle && (
                <Text className="text-zinc-500 text-xs mt-0.5">{item.subtitle}</Text>
            )}
        </View>
      </View>
      <ChevronRight size={18} color="#52525b" />
    </TouchableOpacity>
  );
}