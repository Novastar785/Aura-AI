import { LinearGradient } from 'expo-linear-gradient';
import * as MediaLibrary from 'expo-media-library';
import { useRouter } from 'expo-router';
import { Plus, Sparkles, User, Wallet } from 'lucide-react-native';
import { cssInterop } from "nativewind";
import React, { useEffect, useState } from 'react';
import { Alert, Dimensions, Image, ScrollView, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

cssInterop(LinearGradient, {
  className: "style",
});

const { width } = Dimensions.get('window');

// --- 1. CONFIGURACIÓN DE RUTAS ---
const TOOLS = [
   { 
    id: 'tryon', 
    route: '/features/tryon', 
    title: 'Virtual Try-On', 
    subtitle: 'Try on Any outfit', 
    price: '20', 
    image: 'https://rizzflows.com/img_aura/Vtryon.png', 
    badge: 'FUN' 
  },
  { 
    id: 'stylist', 
    route: '/features/stylist', 
    title: 'Change your Style', 
    subtitle: 'Your vide your style', 
    price: '15', 
    image: 'https://rizzflows.com/img_aura/Image_fx(3).png', 
    badge: 'TRENDING' 
  },
  { 
    id: 'hairstudio', 
    route: '/features/hairstudio', 
    title: 'Hair Studio', 
    subtitle: 'Prueba nuevos colores y cortes', 
    price: '15', 
    image: 'https://rizzflows.com/img_aura/Image_fx(13).png', 
    badge: 'NEW' 
  },
   { 
    id: 'fitness', 
    route: '/features/fitness', 
    title: 'Fitness Body', 
    subtitle: 'Tu versión más atlética', 
    price: '20', 
    image: 'https://rizzflows.com/img_aura/Image_fx(14).png', 
    badge: '' 
  },
    { 
    id: 'glowup', 
    route: '/features/glowup', 
    title: 'Glow Up', 
    subtitle: 'Mejora estética natural', 
    price: '10', 
    image: 'https://rizzflows.com/img_aura/Image_fx(8).png', 
    badge: '' 
  },
  { 
    id: 'luxury', 
    route: '/features/luxury', 
    title: 'Luxury Flex', 
    subtitle: 'Estilo de vida millonario', 
    price: '25', 
    // NUEVA IMAGEN: Interior de auto de lujo (Más confiable)
    image: 'https://rizzflows.com/img_aura/bmw%20rojo.jpg', 
    badge: 'VIRAL' 
  },
  { 
    id: 'socials', 
    route: '/features/socials', 
    title: 'Socials Saver', 
    subtitle: 'Fotos casuales atractivas', 
    price: '15', 
    image: 'https://rizzflows.com/img_aura/Image_fx(10).png', 
    badge: '' 
  },
    { 
    id: 'globetrotter', 
    route: '/features/globetrotter', 
    title: 'Globetrotter', 
    subtitle: 'Viaja por el mundo', 
    price: '20', 
    image: 'https://rizzflows.com/img_aura/Image_fx(12).png', 
    badge: 'NEW' 
  }, 
  { 
    id: 'headshot', 
    route: '/features/headshot', 
    title: 'Instant Headshot', 
    subtitle: 'Foto profesional LinkedIn', 
    price: '20', 
    image: 'https://rizzflows.com/img_aura/Image_fx(1).png', 
    badge: 'POPULAR' 
  },
];

// --- 2. DATOS DE RELLENO (PLACEHOLDERS) ---
const PLACEHOLDER_GALLERY = [
  { id: 'p1', uri: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80', type: 'Ejemplo' },
  { id: 'p2', uri: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&q=80', type: 'Ejemplo' },
  { id: 'p3', uri: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&q=80', type: 'Ejemplo' },
  { id: 'p4', uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80', type: 'Ejemplo' },
];

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  
  const [galleryPhotos, setGalleryPhotos] = useState<any[]>([]);
  const [hasPermission, setHasPermission] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      try {
        const { status } = await MediaLibrary.requestPermissionsAsync();
        
        if (status === 'granted') {
          setHasPermission(true);
          loadAuraAlbum();
        } else {
          console.log("Permisos denegados o limitados.");
        }
      } catch (e) {
        console.log("Modo Expo Go: Usando galería de ejemplo.");
      }
    })();
  }, []);

  const loadAuraAlbum = async () => {
    try {
      const album = await MediaLibrary.getAlbumAsync('Aura AI');
      if (album) {
        const assets = await MediaLibrary.getAssetsAsync({
          album: album,
          first: 20,
          mediaType: 'photo',
          sortBy: ['creationTime'],
        });
        setGalleryPhotos(assets.assets);
      } else {
        setGalleryPhotos([]);
      }
    } catch (e) {
      console.log("No se pudo cargar el álbum, usando ejemplos.");
    }
  };

  const displayPhotos = galleryPhotos.length > 0 ? galleryPhotos : PLACEHOLDER_GALLERY;
  const isShowingPlaceholders = galleryPhotos.length === 0;

  return (
    <View className="flex-1 bg-[#0f0f0f]">
      <StatusBar barStyle="light-content" />
      
      <View style={{ paddingTop: insets.top }} className="flex-1">
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 140 }}>
          
          {/* HEADER */}
          <View className="flex-row justify-between items-center px-6 pt-2 mb-8">
            <View>
              <Text className="text-zinc-500 text-xs font-medium tracking-widest uppercase mb-1">AURA AI</Text>
              <Text className="text-white text-3xl font-bold">Tu Mejor Versión</Text>
            </View>
            <TouchableOpacity className="flex-row items-center bg-zinc-800/80 px-3 py-1.5 rounded-full border border-zinc-700">
              <View className="w-2 h-2 rounded-full bg-purple-500 mr-2 shadow-lg shadow-purple-500" />
              <Text className="text-white font-bold mr-2">120</Text>
              <Plus size={14} color="#a1a1aa" />
            </TouchableOpacity>
          </View>

          {/* CARRUSEL DE HERRAMIENTAS IA */}
          <View className="mb-8">
            <View className="flex-row justify-between items-center px-6 mb-4">
              <View className="flex-row items-center gap-2">
                <Sparkles size={16} color="#fbbf24" />
                <Text className="text-white font-bold text-lg">HERRAMIENTAS IA</Text>
              </View>
              <Text className="text-zinc-500 text-xs">Desliza →</Text>
            </View>

            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false} 
              contentContainerStyle={{ paddingHorizontal: 24, gap: 16 }}
            >
              {TOOLS.map((item) => (
                <TouchableOpacity 
                  key={item.id} 
                  activeOpacity={0.9}
                  className="relative overflow-hidden rounded-[32px] bg-zinc-800"
                  style={{ width: width * 0.75, height: 380 }}
                  onPress={() => router.push(item.route as any)}
                >
                  <Image source={{ uri: item.image }} className="w-full h-full" resizeMode="cover" />
                  
                  <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.2)', 'rgba(0,0,0,0.95)']}
                    className="absolute bottom-0 w-full h-full justify-end p-6"
                  >
                    {item.badge && (
                      <View className="absolute top-6 left-6 bg-rose-500 px-3 py-1 rounded-full shadow-lg border border-white/10">
                        <Text className="text-white text-[10px] font-bold tracking-wider">{item.badge}</Text>
                      </View>
                    )}
                    
                    <Text className="text-white text-3xl font-bold leading-tight shadow-sm mb-1">{item.title}</Text>
                    <Text className="text-zinc-300 text-sm mb-5 font-medium">{item.subtitle}</Text>
                    
                    <View className="bg-white/10 backdrop-blur-md self-start px-5 py-3 rounded-2xl flex-row items-center border border-white/20">
                      <Text className="text-white font-bold mr-2">Empezar</Text>
                      <View className="bg-black/40 px-2 py-0.5 rounded-md">
                         <Text className="text-zinc-200 text-xs font-bold">{item.price} 💎</Text>
                      </View>
                    </View>
                  </LinearGradient>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* GALERÍA INTELIGENTE + PLACEHOLDERS */}
          <View className="px-6">
            <View className="flex-row justify-between items-center mb-4">
              <View className="flex-row items-center gap-2">
                <Text className="text-zinc-200 font-bold text-lg">TUS CREACIONES</Text>
                {!isShowingPlaceholders && (
                  <View className="bg-zinc-800 px-2 py-0.5 rounded-md">
                    <Text className="text-zinc-400 text-xs">{galleryPhotos.length}</Text>
                  </View>
                )}
              </View>
              <Text className="text-zinc-400 text-sm">Ver todo</Text>
            </View>
            
            <View className="flex-row flex-wrap justify-between">
              {displayPhotos.map((photo) => (
                <View 
                  key={photo.id} 
                  className="bg-zinc-900 rounded-3xl mb-4 overflow-hidden border border-zinc-800 relative"
                  style={{ width: (width - 48) / 2 - 6, height: 220 }}
                >
                  <Image source={{ uri: photo.uri }} className="w-full h-full opacity-80" resizeMode="cover" />
                  
                  {isShowingPlaceholders && (
                     <View className="absolute top-3 right-3 bg-black/40 backdrop-blur-md px-2 py-1 rounded-lg border border-white/10">
                        <Text className="text-white text-[10px] font-medium tracking-wide">Ejemplo</Text>
                     </View>
                  )}
                </View>
              ))}
            </View>

            {isShowingPlaceholders && (
               <Text className="text-zinc-600 text-xs text-center mt-2 italic">
                  Tus futuras obras maestras aparecerán aquí.
               </Text>
            )}
          </View>
        </ScrollView>

        {/* BOTTOM NAV + HOME RESET */}
        <View 
          className="absolute bottom-0 w-full bg-[#0f0f0f]/95 border-t border-white/5 flex-row justify-between px-10 pt-4 z-10"
          style={{ paddingBottom: Math.max(insets.bottom, 20) }}
        >
          <TouchableOpacity className="items-center opacity-60 p-2">
              <Wallet size={24} color="white"/>
              <Text className="text-[10px] text-white mt-1 font-medium">Tienda</Text>
          </TouchableOpacity>
          <View className="w-20" />
          <TouchableOpacity className="items-center opacity-60 p-2">
              <User size={24} color="white"/>
              <Text className="text-[10px] text-white mt-1 font-medium">Perfil</Text>
          </TouchableOpacity>
        </View>

        <View 
          className="absolute left-0 right-0 items-center justify-center z-50 pointer-events-box-none"
          style={{ bottom: insets.bottom + 30 }}
        >
           <View className="absolute w-20 h-20 bg-indigo-500/40 rounded-full blur-2xl" />
           <TouchableOpacity 
             activeOpacity={0.9}
             onPress={() => Alert.alert("Home", "Ya estás en el inicio")}
             className="w-18 h-18 rounded-full items-center justify-center shadow-2xl shadow-indigo-500/50"
             style={{ width: 72, height: 72, elevation: 10 }}
           >
              <LinearGradient
                colors={['#e0e7ff', '#818cf8']}
                className="w-full h-full rounded-full items-center justify-center border-4 border-white/10"
              >
                <Sparkles size={32} color="#312e81" fill="#312e81" />
              </LinearGradient>
           </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}