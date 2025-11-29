import React from 'react';
import GenericToolScreen, { ToolOption } from '../../components/GenericToolScreen';

export default function FitnessScreen() {
  
  const options: ToolOption[] = [
    { 
      id: 'shredded', 
      label: 'Definido', 
      image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=300&q=80' 
    },
    { 
      id: 'yoga', 
      label: 'Yoga / Toned', 
      image: 'https://images.unsplash.com/photo-1599447421405-0e32096b3033?w=300&q=80' 
    },
  ];

  return (
    <GenericToolScreen 
      title="Fitness Body"
      subtitle="Visualiza tu mejor versión física."
      price={20}
      backgroundImage="https://rizzflows.com/img_aura/Image_fx(14).png"
      apiMode="fitness"
      options={options}
    />
  );
}