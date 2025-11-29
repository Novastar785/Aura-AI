import React from 'react';
import GenericToolScreen, { ToolOption } from '../../components/GenericToolScreen';

export default function GlobetrotterScreen() {
  
  const options: ToolOption[] = [
    { 
      id: 'santorini', 
      label: 'Santorini', 
      image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=300&q=80' 
    },
    { 
      id: 'paris', 
      label: 'París', 
      image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=300&q=80' 
    },
    { 
      id: 'nyc', 
      label: 'Nueva York', 
      image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=300&q=80' 
    },
  ];

  return (
    <GenericToolScreen 
      title="Globetrotter"
      subtitle="Viaja a los lugares más icónicos del mundo."
      price={20}
      backgroundImage="https://rizzflows.com/img_aura/Image_fx(12).png"
      apiMode="globetrotter"
      options={options}
    />
  );
}