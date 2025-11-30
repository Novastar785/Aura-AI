import React from 'react';
import { useTranslation } from 'react-i18next'; // ✨
import GenericToolScreen from '../../components/GenericToolScreen';

export default function LuxuryScreen() {
  const { t } = useTranslation(); // ✨
  return (
    <GenericToolScreen 
      title={t('tools.luxury.title')} // ✨
      subtitle={t('feature_descriptions.luxury')} // ✨
      price={25}
      backgroundImage="https://rizzflows.com/img_aura/bmw%20rojo.jpg"
      apiMode="luxury"
    />
  );
}