import { defineConfig } from '@apps-in-toss/web-framework/config';

export default defineConfig({
  // 앱인토스 콘솔에서 실제로 발급한 appName으로 교체하세요.
  appName: 'paydaypacekr',
  brand: {
    primaryColor: '#2FA57C',
  },
  navigationBar: {
    // 앱 내부 헤더가 화면 전환과 뒤로가기를 담당하므로 기본 버튼과 중복하지 않아요.
    withBackButton: false,
    withHomeButton: false,
    withTitle: false,
    theme: 'light',
  },
  permissions: [],
  webBundleDir: 'dist',
});
