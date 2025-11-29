import React from 'react';
import GenericToolScreen from '../../components/GenericToolScreen';

export default function StylistScreen() {
  return (
    <GenericToolScreen 
      title="Socials Saver"
      subtitle="potencia tus redes con fotos de perfil que se ven naturales"
      price={15}
      backgroundImage="https://rizzflows.com/img_aura/Image_fx(10).png"
      apiMode="socials"
    />
  );
}