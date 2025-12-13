// src/services/user.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import Purchases from 'react-native-purchases';
import { supabase } from '../config/supabase';
import i18n from '../i18n';

export const deleteAccount = async () => {
  try {
    const appUserID = await Purchases.getAppUserID();
    
    // 1. Borrar datos en Supabase
    const { error } = await supabase.rpc('delete_user_account', {
      target_user_id: appUserID
    });

    if (error) throw error;

    // 2. Resetear RevenueCat (Crea un nuevo ID anónimo limpio)
    // Esto "desconecta" al dispositivo del historial de compras anterior
    if (!Purchases.isAnonymous) {
        await Purchases.logOut();
    } 
    // Si ya es anónimo, logOut no siempre es necesario, pero resetear ayuda:
    // await Purchases.reset(); // Depende de la versión del SDK, a veces logOut basta.

    Alert.alert(
      i18n.t('profile.account_deleted_title'), 
      i18n.t('profile.account_deleted_msg')
    );
    
    // Aquí podrías redirigir al Onboarding o recargar la app
    
  } catch (e: any) {
    console.error("Error deleting account:", e);
    Alert.alert(i18n.t('common.error'), i18n.t('profile.delete_error'));
  }
  }
export const initializeUser = async () => {
  try {
    // 1. Verificación local rápida para no saturar la base de datos
    const isInitialized = await AsyncStorage.getItem('IS_USER_INITIALIZED');
    if (isInitialized === 'true') {
      return; 
    }

    // 2. Obtener ID de RevenueCat
    const appUserID = await Purchases.getAppUserID();
    console.log("Verificando usuario en user_credits:", appUserID);

    // 3. Buscar si ya existe en TU tabla 'user_credits'
    const { data: existingUser, error: fetchError } = await supabase
      .from('user_credits')
      .select('*')
      .eq('user_id', appUserID)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 = no encontrado
      console.error("Error buscando usuario:", fetchError);
      return;
    }

    // 4. Si NO existe, creamos la fila y regalamos 3 créditos en 'pack_credits'
    if (!existingUser) {
      console.log("Usuario nuevo detectado. Regalando créditos...");
      
      const { error: insertError } = await supabase
        .from('user_credits')
        .insert([
          { 
            user_id: appUserID, 
            subscription_credits: 0,
            pack_credits: 3 // <--- AQUÍ ESTÁ EL REGALO DE BIENVENIDA
          }
        ]);

      if (insertError) {
        console.error("Error registrando usuario:", insertError);
      } else {
        console.log("¡Usuario inicializado con 3 créditos de regalo!");
        // Opcional: Mostrar alerta
        Alert.alert("¡Welcome to Aura AI!");
      }
    } else {
      console.log("El usuario ya tiene registro de créditos.");
    }

    // 5. Guardar marca local para no volver a ejecutar esto
    await AsyncStorage.setItem('IS_USER_INITIALIZED', 'true');

  } catch (e) {
    console.error("Error en initializeUser:", e);
  }
};