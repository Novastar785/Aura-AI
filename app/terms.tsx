import { useRouter } from 'expo-router';
import { ArrowLeft, FileText } from 'lucide-react-native';
import React from 'react';
import { ScrollView, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function TermsScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-[#0f0f0f]">
      <StatusBar barStyle="light-content" />
      
      {/* Header Personalizado */}
      <SafeAreaView edges={['top']} className="px-6 pb-4 bg-[#0f0f0f] border-b border-white/5 z-10">
        <View className="flex-row items-center gap-4">
          <TouchableOpacity 
            onPress={() => router.back()} 
            className="w-10 h-10 bg-zinc-900 rounded-full items-center justify-center border border-white/10"
          >
            <ArrowLeft size={20} color="white" />
          </TouchableOpacity>
          <Text className="text-white text-xl font-bold">Términos de Servicio</Text>
        </View>
      </SafeAreaView>

      <ScrollView className="flex-1 px-6 pt-6" contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
        
        {/* Icono decorativo */}
        <View className="items-center mb-8">
          <View className="w-16 h-16 bg-indigo-500/10 rounded-full items-center justify-center mb-4 border border-indigo-500/20">
            <FileText size={32} color="#818cf8" />
          </View>
          <Text className="text-zinc-400 text-xs uppercase tracking-widest">Última actualización: Nov 2023</Text>
        </View>

        {/* Contenido del contrato */}
        <View className="gap-6">
          <Section title="1. Aceptación de los Términos">
            Al descargar o utilizar la aplicación Aura AI, aceptas automáticamente estos términos. Asegúrate de leerlos atentamente antes de usar la app. No puedes copiar ni modificar la app, ninguna parte de la app, ni nuestras marcas comerciales de ninguna manera.
          </Section>

          <Section title="2. Uso de Créditos y Suscripciones">
            <Text className="text-zinc-300 leading-6">
              • <Text className="font-bold text-white">Suscripciones:</Text> Los créditos otorgados por suscripción (Semanal/Anual) expiran al final de cada ciclo de facturación y no son acumulables.{'\n'}
              • <Text className="font-bold text-white">Pay as you go:</Text> Los paquetes de créditos comprados individualmente son permanentes y no expiran mientras tu cuenta esté activa.
            </Text>
          </Section>

          <Section title="3. Generación de Imágenes con IA">
            Aura AI utiliza modelos de inteligencia artificial para generar imágenes. Tú eres responsable del contenido que subes y generas. No está permitido subir fotos de otras personas sin su consentimiento ni generar contenido ilegal, ofensivo o NSFW.
          </Section>

          <Section title="4. Propiedad Intelectual">
            Las imágenes generadas por ti a través de Aura AI son de tu propiedad. Sin embargo, Aura AI retiene los derechos sobre los algoritmos, el diseño de la app y el software subyacente.
          </Section>

          <Section title="5. Reembolsos">
            Debido a la naturaleza de los productos digitales y los costos de computación de la IA, todas las compras son finales y no reembolsables, salvo que la ley local exija lo contrario.
          </Section>
        </View>

        <View className="h-20" />
      </ScrollView>
    </View>
  );
}

// Componente auxiliar para secciones
function Section({ title, children }: { title: string, children: React.ReactNode }) {
  return (
    <View>
      <Text className="text-white text-lg font-bold mb-2">{title}</Text>
      <Text className="text-zinc-400 leading-6 text-base">{children}</Text>
    </View>
  );
}