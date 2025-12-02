import { useRouter } from 'expo-router';
import React from 'react';
import { useTranslation } from 'react-i18next'; // <--- Import agregado
import { Alert, View } from 'react-native';
// Importamos el componente de UI de RevenueCat
import RevenueCatUI from 'react-native-purchases-ui';
// Importamos tipos necesarios
import { CustomerInfo, PurchasesStoreTransaction } from 'react-native-purchases';

export default function StoreScreen() {
  const router = useRouter();
  const { t } = useTranslation(); // <--- Hook inicializado

  // Callback de compra exitosa
  const handlePurchaseCompleted = ({ customerInfo }: { customerInfo: CustomerInfo, storeTransaction: PurchasesStoreTransaction }) => {
    console.log("Compra exitosa:", customerInfo);
    // Usamos las claves de traducción
    Alert.alert(t('store.success_title'), t('store.success_msg'));
    
    // Opcional: Redirigir
    // router.push('/(tabs)/profile');
  };

  // Callback de restauración exitosa
  const handleRestoreCompleted = ({ customerInfo }: { customerInfo: CustomerInfo }) => {
    console.log("Restauración:", customerInfo);
    // Usamos las claves de traducción
    Alert.alert(t('store.restore_title'), t('store.restore_msg'));
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#0f0f0f' }}>
      <RevenueCatUI.Paywall 
        onPurchaseCompleted={handlePurchaseCompleted}
        onRestoreCompleted={handleRestoreCompleted}
      />
    </View>
  );
}