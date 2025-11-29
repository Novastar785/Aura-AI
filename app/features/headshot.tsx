import React from 'react';
import GenericToolScreen from '../../components/GenericToolScreen';

export default function StylistScreen() {
  return (
    <GenericToolScreen 
      title="Instant Headshot"
      subtitle="Tu foto profesional para LinkedIn en segundos"
      price={15}
      backgroundImage="https://rizzflows.com/img_aura/Image_fx(1).png"
      apiMode="headshot"
    />
  );
}