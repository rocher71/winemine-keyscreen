'use client';

import { Suspense, type ReactNode } from 'react';
import { AppModeProvider } from './app-mode-context';
import { ExperienceProvider } from './experience-context';
import { LocaleProvider } from './locale-context';
import { FavoritesProvider } from './favorites-context';
import { FeatureFlagProvider } from './feature-flag-context';
import { UserDataProvider } from './user-data-context';
import { TastingTemplateProvider } from './tasting-template-context';
import { ThemeProvider } from './theme-context';

/**
 * 4개 Context를 한 번에 wrapping.
 * Suspense는 useSearchParams를 사용하는 provider들을 prerender boundary 안에서
 * 안전하게 hydrate하기 위해 필요 (Next 15 권장 패턴).
 */
export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={null}>
      <ThemeProvider>
        <AppModeProvider>
          <ExperienceProvider>
            <LocaleProvider>
              <FavoritesProvider>
                <UserDataProvider>
                  <TastingTemplateProvider>
                    <FeatureFlagProvider>{children}</FeatureFlagProvider>
                  </TastingTemplateProvider>
                </UserDataProvider>
              </FavoritesProvider>
            </LocaleProvider>
          </ExperienceProvider>
        </AppModeProvider>
      </ThemeProvider>
    </Suspense>
  );
}
