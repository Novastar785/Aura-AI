import React from 'react';
import { useTranslation } from 'react-i18next'; // ✨
import GenericToolScreen from '../../components/GenericToolScreen';

export default function StylistScreen() {
  const { t } = useTranslation(); // ✨
  return (
    <GenericToolScreen 
      title={t('tools.socials.title')} // ✨
      subtitle={t('feature_descriptions.socials')} // ✨
      price={2}
      backgroundImage="https://rizzflows.com/img_aura/Image_fx(10).png"
      apiMode="socials"
    />
  );
}