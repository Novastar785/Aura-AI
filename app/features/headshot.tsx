import React from 'react';
import { useTranslation } from 'react-i18next'; // ✨
import GenericToolScreen from '../../components/GenericToolScreen';

export default function StylistScreen() {
  const { t } = useTranslation(); // ✨
  return (
    <GenericToolScreen 
      title={t('tools.headshot.title')} // ✨
      subtitle={t('feature_descriptions.headshot')} // ✨
      price={15}
      backgroundImage="https://rizzflows.com/img_aura/Image_fx(1).png"
      apiMode="headshot"
    />
  );
}