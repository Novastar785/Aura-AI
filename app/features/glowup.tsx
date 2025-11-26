import React from 'react';
import GenericToolScreen from '../../components/GenericToolScreen';

export default function StylistScreen() {
  return (
    <GenericToolScreen 
      title="Glow Up"
      subtitle="Tú, pero en tu mejor día"
      price={15}
      backgroundImage="https://images.unsplash.com/photo-1616766098956-c81f12114571?w=600&q=80"
      apiMode="glowup"
    />
  );
}