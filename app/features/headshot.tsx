import React from 'react';
import GenericToolScreen from '../../components/GenericToolScreen';

export default function StylistScreen() {
  return (
    <GenericToolScreen 
      title="Instant Headshot"
      subtitle="Tu foto profesional para LinkedIn en segundos"
      price={15}
      backgroundImage="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=600&q=80"
      apiMode="headshot"
    />
  );
}