import React from 'react';
import TryOnToolScreen from '../../components/TryOnToolScreen';

export default function TryOnScreen() {
  return (
    <TryOnToolScreen 
      title="Virtual Try On"
      subtitle="Visualiza cómo te queda cualquier prenda antes de comprarla."
      price={25}
      // Imagen de fondo (Probador/Tienda de ropa)
      backgroundImage="https://rizzflows.com/img_aura/Vtryon.png"
    />
  );
}