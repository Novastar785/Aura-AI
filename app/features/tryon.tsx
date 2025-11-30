import React from 'react';
import { useTranslation } from 'react-i18next'; // ✨
import TryOnToolScreen from '../../components/TryOnToolScreen';

export default function TryOnScreen() {
  const { t } = useTranslation(); // ✨
  return (
    <TryOnToolScreen 
      title={t('tools.tryon.title')} // ✨
      subtitle={t('feature_descriptions.tryon')} // ✨
      price={25}
      // Imagen de fondo (Probador/Tienda de ropa)
      backgroundImage="https://rizzflows.com/img_aura/Vtryon.png"
    />
  );
}