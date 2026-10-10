import type { CapacitorConfig } from '@capacitor/cli';


const config: CapacitorConfig = {
  appId: 'com.lkyle.mmoclicker',
  appName: 'MMO Clicker',
  // Le jeu est 100% offline : le bundle Vite (dist/) est copié dans l'APK
  // et chargé via file://. Aucun server.url → pas de redirect vers localhost.
  webDir: 'dist',
  android: {
    allowMixedContent: false,
  },
};

export default config;
