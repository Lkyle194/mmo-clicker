import type { CapacitorConfig } from '@capacitor/cli';


const config: CapacitorConfig = {
  appId: 'com.lkyle.mmoclicker',
  appName: 'MMO Clicker',
  webDir: 'dist',
  android: {
    allowMixedContent: false,
  },
  server: {
    // En mode dev, pointe vers le serveur Vite local
    url: 'http://localhost:5173',
    cleartext: true,
  },
};

export default config;
