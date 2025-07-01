'use client';

import {getAnalytics, isSupported, logEvent} from 'firebase/analytics';
import {FirebaseApp} from 'firebase/app';
import {usePathname} from 'next/navigation';
import {Suspense, useEffect} from 'react';

import app from '@/lib/firebase';

function AnalyticsComponent() {
  const pathname = usePathname();

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('Analytics disabled in development environment');
      return;
    }

    if (!app) {
      console.warn('Firebase not initialized. Analytics will be disabled.');
      return;
    }

    isSupported()
      .then(supported => {
        if (supported) {
          try {
            const analytics = getAnalytics(app as unknown as FirebaseApp);
            logEvent(analytics, 'page_view', {
              page_path: pathname,
              page_location: window.location.href,
            });
          } catch (error) {
            console.warn('Failed to initialize Firebase Analytics:', error);
          }
        }
      })
      .catch(error => {
        console.warn('Firebase Analytics not supported:', error);
      });
  }, [pathname]);

  return null;
}

export function Analytics() {
  return (
    <Suspense fallback={null}>
      <AnalyticsComponent />
    </Suspense>
  );
}
