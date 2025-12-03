import React from 'react';
import { useTranslation } from 'react-i18next'; // ✨
import GenericToolScreen from '../../components/GenericToolScreen';

export default function StylistScreen() {
  const { t } = useTranslation(); // ✨
  return (
    <GenericToolScreen 
      title={t('tools.glowup.title')} // ✨
      subtitle={t('feature_descriptions.glowup')} // ✨
      price={2}
      backgroundImage="https://rizzflows.com/img_aura/Image_fx(8).png"
      apiMode="glowup"
    />
  );
}