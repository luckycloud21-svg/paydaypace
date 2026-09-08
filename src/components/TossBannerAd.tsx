import { useEffect, useRef, useState } from 'react';
import { TossAds, type TossAdsAttachBannerResult } from '@apps-in-toss/web-framework';
import { track } from '../lib/analytics';

export const BANNER_AD_GROUP_ID = 'ait.v2.live.fdaf405b39144ed0';

type InitializationState = 'idle' | 'pending' | 'ready' | 'unsupported' | 'failed';

let initializationState: InitializationState = 'idle';
let initializationError: Error | undefined;
let initializationWaiters: Array<(supported: boolean) => void> = [];

function initializeTossAds(): Promise<boolean> {
  if (initializationState === 'ready') return Promise.resolve(true);
  if (initializationState === 'unsupported' || initializationState === 'failed') return Promise.resolve(false);

  const result = new Promise<boolean>((resolve) => {
    initializationWaiters.push(resolve);
  });

  if (initializationState !== 'idle') return result;

  initializationState = 'pending';
  try {
    if (!TossAds.initialize.isSupported()) {
      initializationState = 'unsupported';
      const waiters = initializationWaiters;
      initializationWaiters = [];
      waiters.forEach((resolve) => resolve(false));
      return result;
    }

    TossAds.initialize({
      callbacks: {
        onInitialized: () => {
          initializationState = 'ready';
          const waiters = initializationWaiters;
          initializationWaiters = [];
          waiters.forEach((resolve) => resolve(true));
        },
        onInitializationFailed: (error) => {
          initializationState = 'failed';
          initializationError = error;
          const waiters = initializationWaiters;
          initializationWaiters = [];
          waiters.forEach((resolve) => resolve(false));
        },
      },
    });
  } catch (error) {
    initializationState = 'failed';
    initializationError = error instanceof Error ? error : new Error(String(error));
    const waiters = initializationWaiters;
    initializationWaiters = [];
    waiters.forEach((resolve) => resolve(false));
  }

  return result;
}

type BannerStatus = 'loading' | 'rendered' | 'no-fill' | 'error' | 'unsupported';

export default function TossBannerAd() {
  const targetRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<BannerStatus>('loading');

  useEffect(() => {
    let cancelled = false;
    let attachedBanner: TossAdsAttachBannerResult | undefined;

    void initializeTossAds().then((supported) => {
      if (cancelled) return;
      if (!supported || !targetRef.current) {
        if (initializationError && import.meta.env.DEV) {
          console.warn('[TossAds] 배너 광고를 사용할 수 없습니다.', initializationError);
        }
        setStatus('unsupported');
        return;
      }

      try {
        attachedBanner = TossAds.attachBanner(BANNER_AD_GROUP_ID, targetRef.current, {
          theme: 'light',
          tone: 'grey',
          variant: 'expanded',
          callbacks: {
            onAdRendered: () => {
              if (!cancelled) setStatus('rendered');
            },
            onAdImpression: () => track('ad_impression', { adGroupId: BANNER_AD_GROUP_ID }),
            onAdViewable: () => track('ad_viewable', { adGroupId: BANNER_AD_GROUP_ID }),
            onAdClicked: () => track('ad_clicked', { adGroupId: BANNER_AD_GROUP_ID }),
            onNoFill: () => {
              if (!cancelled) setStatus('no-fill');
            },
            onAdFailedToRender: () => {
              if (!cancelled) setStatus('error');
            },
          },
        });
      } catch (error) {
        if (import.meta.env.DEV) console.warn('[TossAds] 배너 광고 연결에 실패했습니다.', error);
        setStatus('error');
      }
    });

    return () => {
      cancelled = true;
      attachedBanner?.destroy();
    };
  }, []);

  if (status === 'unsupported') {
    return <p className="toss-banner-ad-fallback">토스 앱에서 배너 광고가 노출됩니다.</p>;
  }

  return (
    <section className={`toss-banner-ad toss-banner-ad-${status}`} aria-label="광고">
      <div ref={targetRef} className="toss-banner-ad-slot" />
    </section>
  );
}
