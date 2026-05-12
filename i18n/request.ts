import { getRequestConfig } from 'next-intl/server';

/**
 * next-intl 서버 측 메시지 로더.
 *
 * 시안에서는 SSR 시 항상 'ko' 메시지를 fallback으로 노출하고, 실제 locale 분기는
 * 클라이언트 측 LocaleContext + Provider re-mount로 처리한다 (URL ↔ localStorage 동기화).
 * SSR hydration mismatch 없이 useTranslations()를 안전하게 사용 가능.
 */
export default getRequestConfig(async () => {
  const messages = (await import('../messages/ko.json')).default;
  return {
    locale: 'ko',
    messages,
  };
});
