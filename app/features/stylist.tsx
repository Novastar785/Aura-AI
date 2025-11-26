import React from 'react';
import GenericToolScreen, { ToolOption } from '../../components/GenericToolScreen';

export default function StylistScreen() {
  
  // Aquí definimos las tarjetas visuales
  // El 'id' debe coincidir con lo que pusimos en gemini.ts después del guion bajo (stylist_ROCK)
  const options: ToolOption[] = [
    { 
      id: 'urban', 
      label: 'Urbano', 
      image: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=300&q=80' // Chico con hoodie en la calle
    },
    { 
      id: 'rock', 
      label: 'Rockero', 
      image: 'https://images.unsplash.com/photo-1746688384436-5de8ea663966?w=300&q=80' // Ambiente concierto/guitarra
    },
    { 
      id: 'cyberpunk', 
      label: 'Cyberpunk', 
      image: 'https://images.unsplash.com/photo-1580046939256-c377c5b099f1?w=300&q=80' // Luces neón y lluvia
    },
    { 
      id: 'viking', 
      label: 'Vikingo', 
      image: 'https://images.unsplash.com/photo-1612018564901-7e689c6693ec?w=300&q=80' // Bosque oscuro y misterioso
    },
  ];

  return (
    <GenericToolScreen 
      title="Virtual Stylist"
      subtitle="Elige tu estilo y deja que la IA diseñe tu outfit."
      price={15}
      // Imagen de fondo general de la pantalla
      backgroundImage="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80"
      apiMode="stylist"
      options={options}
    />
  );
}
      