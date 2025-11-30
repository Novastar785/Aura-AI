import { useRouter } from 'expo-router';
import { ArrowLeft, Lock } from 'lucide-react-native';
import React from 'react';
import { ScrollView, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PrivacyScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-[#0f0f0f]">
      <StatusBar barStyle="light-content" />
      
      {/* Header */}
      <SafeAreaView edges={['top']} className="px-6 pb-4 bg-[#0f0f0f] border-b border-white/5 z-10">
        <View className="flex-row items-center gap-4">
          <TouchableOpacity 
            onPress={() => router.back()} 
            className="w-10 h-10 bg-zinc-900 rounded-full items-center justify-center border border-white/10"
          >
            <ArrowLeft size={20} color="white" />
          </TouchableOpacity>
          <Text className="text-white text-xl font-bold">Política de Privacidad</Text>
        </View>
      </SafeAreaView>

      <ScrollView className="flex-1 px-6 pt-6" contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
        
        <View className="items-center mb-8">
          <View className="w-16 h-16 bg-emerald-500/10 rounded-full items-center justify-center mb-4 border border-emerald-500/20">
            <Lock size={32} color="#34d399" />
          </View>
          <Text className="text-zinc-400 text-xs uppercase tracking-widest">Tus datos están seguros</Text>
        </View>

        <View className="gap-6">
          <Section title="1. Recopilación de Datos">
            Para ofrecerte nuestros servicios de edición de fotos con IA, recopilamos las imágenes que subes temporalmente. Estas imágenes se utilizan exclusivamente para el proceso de generación y se eliminan de nuestros servidores de procesamiento poco después (generalmente en 24 horas).
          </Section>

          <Section title="2. Uso de Tus Fotos">
            <Text className="text-zinc-300 leading-6">
              • <Text className="font-bold text-white">No vendemos tus fotos.</Text>{'\n'}
              • No utilizamos tus fotos para entrenar modelos de IA públicos sin tu consentimiento explícito.{'\n'}
              • Tus fotos originales y las generadas solo son visibles para ti.
            </Text>
          </Section>

          <Section title="3. Almacenamiento Local">
            Aura AI almacena las imágenes generadas en tu dispositivo o en tu galería privada dentro de la app (si usas la función de álbum). Si eliminas la app, es posible que pierdas las imágenes que no hayas guardado en tu carrete.
          </Section>

          <Section title="4. Servicios de Terceros">
            Utilizamos proveedores de servicios en la nube seguros (como Google Cloud o AWS) para procesar las imágenes. Estos proveedores están obligados por contrato a mantener la confidencialidad de tus datos.
          </Section>

          <Section title="5. Eliminación de Cuenta">
            Puedes solicitar la eliminación completa de tu cuenta y todos los datos asociados desde la configuración de la aplicación en cualquier momento.
          </Section>
        </View>

        <View className="h-20" />
      </ScrollView>
    </View>
  );
}

function Section({ title, children }: { title: string, children: React.ReactNode }) {
  return (
    <View>
      <Text className="text-white text-lg font-bold mb-2">{title}</Text>
      <Text className="text-zinc-400 leading-6 text-base">{children}</Text>
    </View>
  );
}