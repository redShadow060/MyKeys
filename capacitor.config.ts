import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'myApp',
  webDir: 'www',
  plugins: {
    "CapacitorStorage": {
      "group": "CapacitorStorage"
    },
    "CapacitorFilesystem": {
      "group": "CapacitorFilesystem"
    },

  }
};

export default config;
