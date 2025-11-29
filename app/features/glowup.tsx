import React from 'react';
import GenericToolScreen from '../../components/GenericToolScreen';

export default function StylistScreen() {
  return (
    <GenericToolScreen 
      title="Glow Up"
      subtitle="Tú, pero en tu mejor día"
      price={15}
      backgroundImage="https://rizzflows.com/img_aura/Image_fx(8).png"
      apiMode="glowup"
    />
  );
}