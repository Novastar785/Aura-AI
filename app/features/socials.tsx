import React from 'react';
import GenericToolScreen from '../../components/GenericToolScreen';

export default function StylistScreen() {
  return (
    <GenericToolScreen 
      title="Socials Saver"
      subtitle="potencia tus redes con fotos de perfil que se ven naturales"
      price={15}
      backgroundImage="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=600&q=80"
      apiMode="socials"
    />
  );
}