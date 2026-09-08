import { getTossShareLink, share } from '@apps-in-toss/web-framework';

const APP_NAME = 'paydaypace';

export async function shareText(message: string): Promise<'native' | 'browser' | 'copied'> {
  try {
    const tossLink = await getTossShareLink(`intoss://${APP_NAME}`);
    await share({ message: `${message}\n\n${tossLink}` });
    return 'native';
  } catch {
    try {
      if (navigator.share) {
        await navigator.share({ title: '월급까지', text: message });
        return 'browser';
      }
    } catch {
      // The user dismissed the browser share sheet.
    }
    try {
      await navigator.clipboard.writeText(message);
      return 'copied';
    } catch {
      return 'browser';
    }
  }
}
