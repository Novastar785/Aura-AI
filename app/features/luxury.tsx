import React from 'react';
import GenericToolScreen from '../../components/GenericToolScreen';

export default function LuxuryScreen() {
  return (
    <GenericToolScreen 
      title="Luxury Flex"
      subtitle="Viaja en jet privado o yate sin salir de casa."
      price={25}
      backgroundImage="https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=600&q=80"
      apiMode="luxury"
    />
  );
}