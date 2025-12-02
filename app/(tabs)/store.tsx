import { useRouter } from 'expo-router';
import React from 'react';
import { Alert, View } from 'react-native';
// Importamos el componente de UI de RevenueCat
import RevenueCatUI from 'react-native-purchases-ui';
// Importamos tipos necesarios
import { CustomerInfo, PurchasesStoreTransaction } from 'react-native-purchases';

export default function StoreScreen() {
  const router = useRouter();

  // CORRECCIÓN: Ahora recibimos un objeto y desestructuramos { customerInfo }
  const handlePurchaseCompleted = ({ customerInfo }: { customerInfo: CustomerInfo, storeTransaction: PurchasesStoreTransaction }) => {
    console.log("Compra exitosa:", customerInfo);
    Alert.alert("¡Éxito!", "Tu compra se ha realizado correctamente.");
    
    // Opcional: Redirigir al usuario al perfil o home tras comprar
    // router.push('/(tabs)/profile');
  };

  // CORRECCIÓN: Igual aquí, recibimos un objeto { customerInfo }
  const handleRestoreCompleted = ({ customerInfo }: { customerInfo: CustomerInfo }) => {
    console.log("Restauración:", customerInfo);
    Alert.alert("Restaurado", "Tus compras han sido restauradas.");
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#0f0f0f' }}>
      {/* RevenueCatUI.Paywall renderiza la UI completa configurada en tu Dashboard. */}
      <RevenueCatUI.Paywall 
        onPurchaseCompleted={handlePurchaseCompleted}
        onRestoreCompleted={handleRestoreCompleted}
      />
    </View>
  );
}