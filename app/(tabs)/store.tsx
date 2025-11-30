import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Check, Crown, Zap } from 'lucide-react-native';
import React, { useState } from 'react';
import { Dimensions, ScrollView, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

// --- DATOS MOCK ---
const SUBSCRIPTIONS = [
  {
    id: 'weekly',
    title: 'Semanal',
    price: '$4.99',
    credits: 50,
    badge: null,
    features: ['50 Créditos cada semana', 'Créditos expiran al renovar', 'Acceso a modelos Pro', 'Sin anuncios'],
  },
  {
    id: 'yearly',
    title: 'Anual',
    price: '$89.99',
    credits: 600, // (50 * 12)
    badge: 'AHORRA 50%',
    features: ['Mejor valor', 'Créditos semanales', 'Soporte prioritario', 'Acceso anticipado a features'],
  },
];

const CREDIT_PACKS = [
  {
    id: 'small',
    title: 'Starter Pack',
    price: '$9.99',
    credits: 50,
    badge: null,
    popular: false,
  },
  {
    id: 'medium',
    title: 'Pro Pack',
    price: '$24.99',
    credits: 150,
    badge: 'POPULAR',
    popular: true,
  },
  {
    id: 'large',
    title: 'Mega Pack',
    price: '$49.99',
    credits: 400,
    badge: 'MEJOR PRECIO',
    popular: false,
  },
];

export default function StoreScreen() {
  const router = useRouter();
  // Estado para alternar entre Suscripción (subs) y Pago por uso (credits)
  const [activeTab, setActiveTab] = useState<'subs' | 'credits'>('subs');
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const handlePurchase = () => {
    if (!selectedPlan) return;
    console.log(`Comprando: ${selectedPlan} en modo ${activeTab}`);
    // Aquí iría la lógica de RevenueCat o Stripe
  };

  return (
    <View className="flex-1 bg-[#0f0f0f]">
      <StatusBar barStyle="light-content" />
      
      {/* Fondo ambiental */}
      <LinearGradient
        colors={['rgba(99, 102, 241, 0.15)', 'transparent']}
        className="absolute w-full h-[600px]"
      />

      <SafeAreaView className="flex-1">
        {/* Scroll con padding bottom para no quedar detrás del footer de compra ni del nav bar */}
        <ScrollView contentContainerStyle={{ paddingBottom: 180 }} showsVerticalScrollIndicator={false}>
          
          {/* HEADER */}
          <View className="px-6 py-4 items-center">
            <Text className="text-zinc-400 text-xs font-bold tracking-[4px] uppercase mb-2">TIENDA AURA</Text>
            <Text className="text-white text-3xl font-bold text-center mb-2">
              Desbloquea tu <Text className="text-indigo-500">Creatividad</Text>
            </Text>
            <Text className="text-zinc-400 text-center px-4">
              Elige un plan para obtener créditos constantes o recarga solo lo que necesitas.
            </Text>
          </View>

          {/* TOGGLE SWITCH (El Segmented Control) */}
          <View className="px-6 mb-8">
            <View className="bg-zinc-900/80 p-1 rounded-2xl flex-row border border-zinc-800">
              {/* Botón Suscripción */}
              <TouchableOpacity 
                onPress={() => setActiveTab('subs')}
                className={`flex-1 py-3 rounded-xl flex-row items-center justify-center gap-2 ${activeTab === 'subs' ? 'bg-zinc-800 border border-zinc-700' : ''}`}
              >
                <Crown size={16} color={activeTab === 'subs' ? '#fbbf24' : '#71717a'} />
                <Text className={`font-bold ${activeTab === 'subs' ? 'text-white' : 'text-zinc-500'}`}>Suscripción</Text>
              </TouchableOpacity>

              {/* Botón Créditos */}
              <TouchableOpacity 
                onPress={() => setActiveTab('credits')}
                className={`flex-1 py-3 rounded-xl flex-row items-center justify-center gap-2 ${activeTab === 'credits' ? 'bg-zinc-800 border border-zinc-700' : ''}`}
              >
                <Zap size={16} color={activeTab === 'credits' ? '#818cf8' : '#71717a'} />
                <Text className={`font-bold ${activeTab === 'credits' ? 'text-white' : 'text-zinc-500'}`}>Pack Créditos</Text>
              </TouchableOpacity>
            </View>
            
            {/* Mensaje explicativo dinámico */}
            <View className="mt-3 bg-indigo-500/10 p-3 rounded-lg border border-indigo-500/20">
              <Text className="text-indigo-300 text-xs text-center">
                {activeTab === 'subs' 
                  ? "ℹ️ Los créditos de suscripción se renuevan cada ciclo." 
                  : "ℹ️ Los Packs de créditos son permanentes. Nunca expiran."}
              </Text>
            </View>
          </View>

          {/* CONTENIDO: SUSCRIPCIONES */}
          {activeTab === 'subs' && (
            <View className="px-6 gap-4">
              {SUBSCRIPTIONS.map((plan) => {
                const isSelected = selectedPlan === plan.id;
                return (
                  <TouchableOpacity
                    key={plan.id}
                    onPress={() => setSelectedPlan(plan.id)}
                    activeOpacity={0.9}
                    className={`relative p-5 rounded-3xl border ${isSelected ? 'bg-indigo-600/10 border-indigo-500' : 'bg-zinc-900 border-zinc-800'}`}
                  >
                    {plan.badge && (
                      <View className="absolute -top-3 right-4 bg-amber-400 px-3 py-1 rounded-full shadow-lg">
                        <Text className="text-black text-[10px] font-bold">{plan.badge}</Text>
                      </View>
                    )}

                    <View className="flex-row justify-between items-center mb-4">
                      <View>
                        <Text className="text-white text-xl font-bold">{plan.title}</Text>
                        <Text className="text-zinc-400 text-sm">{plan.credits} créditos / ciclo</Text>
                      </View>
                      <View>
                        <Text className="text-white text-2xl font-bold">{plan.price}</Text>
                      </View>
                    </View>

                    {/* Features List */}
                    <View className="gap-2">
                      {plan.features.map((feature, i) => (
                        <View key={i} className="flex-row items-center gap-2">
                          <Check size={14} color="#818cf8" />
                          <Text className="text-zinc-300 text-sm">{feature}</Text>
                        </View>
                      ))}
                    </View>

                    {/* Radio Button Visual */}
                    <View className={`absolute top-5 right-5 w-5 h-5 rounded-full border items-center justify-center ${isSelected ? 'border-indigo-500 bg-indigo-500' : 'border-zinc-600'}`}>
                      {isSelected && <View className="w-2 h-2 bg-white rounded-full" />}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}

          {/* CONTENIDO: CRÉDITOS (PAY AS YOU GO) */}
          {activeTab === 'credits' && (
            <View className="px-6 gap-4">
              {CREDIT_PACKS.map((pack) => {
                const isSelected = selectedPlan === pack.id;
                return (
                  <TouchableOpacity
                    key={pack.id}
                    onPress={() => setSelectedPlan(pack.id)}
                    activeOpacity={0.9}
                    className={`flex-row items-center p-4 rounded-3xl border ${isSelected ? 'bg-indigo-600/10 border-indigo-500' : 'bg-zinc-900 border-zinc-800'}`}
                  >
                    {/* Imagen Visual del Pack */}
                    <View className="w-16 h-16 bg-zinc-800 rounded-2xl items-center justify-center mr-4">
                      <Zap size={24} color={pack.popular ? "#fbbf24" : "#a1a1aa"} fill={pack.popular ? "#fbbf24" : "transparent"} />
                    </View>

                    <View className="flex-1">
                      {pack.badge && <Text className="text-indigo-400 text-[10px] font-bold mb-1">{pack.badge}</Text>}
                      <Text className="text-white text-lg font-bold">{pack.credits} Créditos</Text>
                      <Text className="text-zinc-500 text-xs">Nunca expiran</Text>
                    </View>

                    <View className="bg-zinc-800 px-4 py-2 rounded-xl border border-zinc-700">
                      <Text className="text-white font-bold">{pack.price}</Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}

        </ScrollView>

        {/* FOOTER FIJO DE COMPRA */}
        {/* Se posiciona encima del Bottom Tab Bar (aprox 100px desde abajo) */}
        <View className="absolute bottom-[90px] w-full px-6 pointer-events-box-none">
          <View className="bg-[#0f0f0f]/95 border-t border-white/10 p-4 rounded-2xl border border-white/5 backdrop-blur-xl">
            <TouchableOpacity 
              onPress={handlePurchase}
              className={`w-full py-4 rounded-2xl items-center shadow-lg ${selectedPlan ? 'bg-white' : 'bg-zinc-800'}`}
              disabled={!selectedPlan}
            >
              <Text className={`font-bold text-lg ${selectedPlan ? 'text-black' : 'text-zinc-500'}`}>
                {selectedPlan ? 'Continuar' : 'Selecciona una opción'}
              </Text>
            </TouchableOpacity>
            <Text className="text-zinc-600 text-[10px] text-center mt-3">
              Pagos seguros procesados por la tienda de aplicaciones.
            </Text>
          </View>
        </View>

      </SafeAreaView>
    </View>
  );
}