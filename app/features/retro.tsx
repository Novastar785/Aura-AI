import React from 'react';
import GenericToolScreen from '../../components/GenericToolScreen';

export default function RetroScreen() {
  return (
    <GenericToolScreen 
      title="Time Traveler"
      subtitle="Vuelve a los años 90 con estilo vintage."
      price={20}
      backgroundImage="https://images.unsplash.com/photo-1550254478-ead40cc54513?w=600&q=80"
      apiMode="retro"
    />
  );
}