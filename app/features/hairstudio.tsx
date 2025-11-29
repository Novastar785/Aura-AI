import React from 'react';
import GenericToolScreen, { ToolOption } from '../../components/GenericToolScreen';

export default function HairStudioScreen() {
  
  const options: ToolOption[] = [
    { 
      id: 'butterfly', 
      label: 'Butterfly Hair Style', 
      image: 'https://rizzflows.com/img_aura/hairstudio/butterflycut.png' 
    },
    { 
      id: 'layer', 
      label: 'Layered Hair Style', 
      image: 'https://rizzflows.com/img_aura/hairstudio/layered.png' 
    },
    { 
      id: 'bob', 
      label: 'Corte Bob', 
      image: 'https://rizzflows.com/img_aura/hairstudio/bobcut.png' 
    }, 
    { 
      id: 'mullet', 
      label: 'Moderm Mullet', 
      image: 'https://rizzflows.com/img_aura/hairstudio/modermmullet.png' 
    },
    { 
      id: 'fade', 
      label: 'Tapper fade', 
      image: 'https://rizzflows.com/img_aura/hairstudio/taperfade.png' 
    },
    { 
      id: 'buzzcut', 
      label: 'Buzz Cut', 
      image: 'https://rizzflows.com/img_aura/hairstudio/buzzcut.png' 
    },
    { 
      id: 'blonde', 
      label: 'Rubio Platino', 
      image: 'https://rizzflows.com/img_aura/hairstudio/blonde.png' 
    },
    { 
      id: 'red', 
      label: 'Pelirrojo', 
      image: 'https://rizzflows.com/img_aura/hairstudio/red.png' 
    },
    { 
      id: 'dark', 
      label: 'Dark Hair', 
      image: 'https://rizzflows.com/img_aura/hairstudio/dark.png' 
    },
    { 
      id: 'balayage', 
      label: 'Balayage', 
      image: 'https://rizzflows.com/img_aura/hairstudio/balayage.png' 
    }, 
   
  ];

  return (
    <GenericToolScreen 
      title="Hair Studio"
      subtitle="Prueba un nuevo look sin ir a la peluquería."
      price={15}
      backgroundImage="https://rizzflows.com/img_aura/Image_fx(13).png"
      apiMode="hairstudio"
      options={options}
    />
  );
}