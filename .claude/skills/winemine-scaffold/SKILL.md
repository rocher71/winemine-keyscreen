---
name: winemine-scaffold
description: winemine 키스크린 프로젝트의 초기 Next.js 15 + Tailwind v4 + next-intl 골격을 세팅하는 스킬. package.json/tsconfig/next.config/app/layout/globals.css/postcss.config/i18n/request.ts 파일을 생성하고 npm install + npm run build + npm run dev로 빈 / 라우트가 다크 배경에 winemine 로고만 렌더되는 상태를 만든다. 다음 키워드/상황에서 반드시 트리거할 것: '키스크린 scaffold', 'Next.js 초기 셋업', 'winemine 프로젝트 시작', '빌드 가능한 골격 만들기', 'package.json 만들어줘', '레포 초기화'. 또한 '다시 scaffold', 'scaffold 재실행', '패키지 버전 업데이트' 같은 후속 작업에도 트리거. 단, 페이지/컴포넌트/mock 데이터 생성은 트리거하지 않음 — 그건 다른 스킬 담당.
---

# winemine-scaffold — 초기 골격 세팅

## 목적

WINEMINE_KEYSCREEN_SPEC.md의 `technology_stack`, `prerequisites`, `file_structure`를 따라 빌드 가능한 최소 Next.js 프로젝트를 만든다. **이 단계에서 DeviceFrame·페이지·mock·테이스팅 노트는 만들지 않는다.** 후속 에이전트가 들어올 그릇만 만든다.

## Why 작은 골격부터?

빌드 가능한 골격이 첫 산출물이어야 후속 에이전트가 디버깅 없이 진행할 수 있다. 만약 처음부터 모든 페이지를 한 번에 만들면, 사소한 설정 오류 하나가 모든 페이지에서 동시에 터져 root cause 추적이 어렵다. "빈 화면이라도 빌드 통과"가 안전한 기점이다.

## 단계

### Step 1 — 디렉토리 + package.json

```bash
mkdir -p src/app src/components src/lib src/types src/hooks src/context i18n
```

`package.json` 작성 (스펙 `technology_stack.libraries` 정확한 버전):

```json
{
  "name": "winemine-keyscreen",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev --turbopack",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "^15.0.0",
    "next-intl": "^3.20.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "framer-motion": "^12.0.0",
    "lucide-react": "^0.475.0",
    "react-simple-maps": "^3.0.0",
    "topojson-client": "^3.1.0",
    "recharts": "^2.15.0",
    "zod": "^3.23.0"
  },
  "devDependencies": {
    "@types/node": "^22.0.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "@types/topojson-client": "^3.1.5",
    "typescript": "^5.7.0",
    "tailwindcss": "^4.0.0",
    "@tailwindcss/postcss": "^4.0.0",
    "eslint": "^9.0.0",
    "eslint-config-next": "^15.0.0"
  }
}
```

### Step 2 — TypeScript + Next config

`tsconfig.json` strict, paths `@/* → src/*`:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": false,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./src/*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

`next.config.ts`:

```ts
import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

const nextConfig: NextConfig = {
  reactStrictMode: true,
};

export default withNextIntl(nextConfig);
```

### Step 3 — Tailwind v4 + tokens

`postcss.config.mjs`:

```js
export default {
  plugins: { '@tailwindcss/postcss': {} },
};
```

`src/app/globals.css` — `tokens.css` import + `@theme` 블록으로 CSS 변수를 Tailwind utility로 노출:

```css
@import "tailwindcss";
@import "../../styles/tokens.css";

@theme {
  --color-wine-red: #8B1A2A;
  --color-wine-red-hover: #A02030;
  --color-gold: #C9A84C;
  --color-cream: #F5F0E8;
  --color-bg-deepest: #05020A;
  --color-bg-deep: #0A050F;
  --color-bg-map: #1A0A1E;
  --color-surface: #0F0718;
  --color-text-primary: #F5F0E8;
  --color-text-secondary: #D4C5B0;
  --color-text-muted: #9B8B7A;
  --color-text-disabled: #4A3D56;
  --color-border-default: #2D1540;
  --color-border-active: #8B1A2A;
  --color-error: #EF4444;
}
```

> **Why** `@theme` 블록을 추가하는가? Tailwind v4는 `@theme` 변수를 자동으로 `bg-wine-red`, `text-cream` 같은 utility로 노출한다. tokens.css만 import하면 `var(--color-wine-red)`로 인라인 사용은 가능하지만 utility는 안 생긴다.

### Step 4 — i18n 골격

`i18n/request.ts`:

```ts
import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async () => {
  // 시안: 메시지는 page-builder가 채움. scaffold 단계에서는 빈 객체.
  return {
    locale: 'ko',
    messages: {},
  };
});
```

### Step 5 — Fonts + Root layout

`src/app/layout.tsx`:

```tsx
import { Playfair_Display, Inter, Noto_Sans_KR } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import './globals.css';

const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' });
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const notoKr = Noto_Sans_KR({ subsets: ['latin'], weight: ['400', '500', '600', '700'], variable: '--font-noto-kr' });

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const messages = await getMessages();
  return (
    <html lang="ko" className={`${playfair.variable} ${inter.variable} ${notoKr.variable}`}>
      <body>
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
```

### Step 6 — Empty home page

`src/app/page.tsx` — 빈 페이지에 winemine 로고만:

```tsx
export default function Page() {
  return (
    <main style={{ minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--color-bg-deepest)' }}>
      <h1 style={{ fontFamily: 'var(--font-playfair)', fontSize: '56px', color: 'var(--color-cream)', letterSpacing: '-0.02em' }}>winemine</h1>
    </main>
  );
}
```

### Step 7 — Build + Dev 검증

```bash
npm install
npm run build  # 무경고 통과 확인
npm run dev    # http://localhost:3000 다크 배경 + winemine 로고
```

### Step 8 — Report

`_workspace/A_scaffolder_report.md`에 다음 기록:
- 설치된 패키지 버전 (`npm list --depth=0` 출력 일부)
- 빌드 성공 로그 마지막 줄
- 알려진 경고 또는 해결한 peer-dep 충돌

## Edge Cases

- **Tailwind v4 alpha 충돌:** 패키지 버전이 v4를 정확히 가리켜야 함. v3가 설치되면 `@theme` 블록이 무시됨.
- **Next.js 15 + React 19 peer warning:** 일부 의존성이 React 18을 요구할 수 있음. `npm install --legacy-peer-deps`는 최후 수단, 가능하면 호환 가능한 버전 선택.
- **Turbopack dev에서 next-intl 동작:** Turbopack은 next-intl plugin과 호환. 문제 발생 시 `next dev` (Turbopack 없이)로 일시 fallback 후 사용자 보고.

## 스킬 종료 조건

- `npm run build` 무경고 통과
- `npm run dev`로 / 라우트에 winemine 로고가 다크 배경에 렌더
- `_workspace/A_scaffolder_report.md` 작성됨
