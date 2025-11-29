import React from 'react';
import GenericToolScreen, { ToolOption } from '../../components/GenericToolScreen';

export default function StylistScreen() {
  
  // Aquí definimos las tarjetas visuales
  // El 'id' debe coincidir con lo que pusimos en gemini.ts después del guion bajo (stylist_ROCK)
  const options: ToolOption[] = [
    { 
      id: 'urban', 
      label: 'Urbano', 
      image: 'https://rizzflows.com/img_aura/Image_fx(4).png' // Chico con hoodie en la calle
    },
    { 
      id: 'rock', 
      label: 'Rockero', 
      image: 'https://rizzflows.com/img_aura/rockera.jpeg' // Ambiente concierto/guitarra
    },
    { 
      id: 'cyberpunk', 
      label: 'Cyberpunk', 
      image: 'https://rizzflows.com/img_aura/Image_fx(5).png' // Luces neón y lluvia
    },
    { 
      id: 'viking', 
      label: 'Vikingo', 
      image: 'https://rizzflows.com/img_aura/Image_fx(6).png' // Bosque oscuro y misterioso
    },
    { 
      id: 'retro', 
      label: 'retro', 
      image: 'https://rizzflows.com/img_aura/Image_fx(11).png' // Bosque oscuro y misterioso
    },
  ];

  return (
    <GenericToolScreen 
      title="Stylist"
      subtitle="Elige tu estilo y deja que la IA diseñe tu outfit."
      price={15}
      // Imagen de fondo general de la pantalla
      backgroundImage="https://rizzflows.com/img_aura/Image_fx(3).png"
      apiMode="stylist"
      options={options}
    />
  );
}
      