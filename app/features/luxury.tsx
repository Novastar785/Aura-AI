import React from 'react';
import GenericToolScreen from '../../components/GenericToolScreen';

export default function LuxuryScreen() {
  return (
    <GenericToolScreen 
      title="Luxury Flex"
      subtitle="Viaja en jet privado o yate sin salir de casa."
      price={25}
      backgroundImage="https://rizzflows.com/img_aura/bmw%20rojo.jpg"
      apiMode="luxury"
    />
  );
}