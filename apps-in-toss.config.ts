import { defineConfig } from '@apps-in-toss/web-framework/config';

export default defineConfig({
  // 앱인토스 콘솔에서 실제로 발급한 appName으로 교체하세요.
  appName: 'paydaypacekr',
  brand: {
    primaryColor: '#2FA57C',
  },
  permissions: [],
  webBundleDir: 'dist',
});
